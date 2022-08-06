<template>
  <div>
    <v-container class="follows__sticky-topbar py-0">
      <page-header />

      <!-- topbar -->
      <template v-if="loading">
        <v-card flat class="mb-6" rounded="lg">
          <v-row class="my-1 align-center">
            <v-col class="py-0" cols="12">
              <v-skeleton-loader type="table-heading" />
            </v-col>
          </v-row>
        </v-card>
      </template>
      <template v-else>
        <v-card flat class="mb-6 py-2" rounded outlined>
          <v-row class="px-4 my-1 align-center">
            <v-col class="py-0" cols="12" md="8" sm="6"
              ><h4
                class="
                  font-weight-medium
                  subtitle-1
                  text--text
                  mb-2 mb-sm-0 mb-lg-0 mb-xl-0
                "
              >
                {{ userInfo.followers }} Followers
              </h4></v-col
            >
            <v-col class="py-0" cols="12" md="4" sm="6">
              <v-text-field
                v-model="query"
                label="Search by name"
                persistent-hint
                outlined
                dense
                hide-details
                :prepend-inner-icon="mdiMagnify"
                @keyup="searchFollowers"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </v-container>
    <!-- main container -->
    <v-container>
      <v-row>
        <template v-if="loading">
          <v-col v-for="(n, i) in 8" :key="i" cols="12" lg="3" md="4" sm="6">
            <v-skeleton-loader elevation="2" type="card" />
          </v-col>
        </template>
        <template v-else-if="members.length > 0">
          <v-col
            v-for="(user, i) in members"
            :key="i"
            cols="12"
            lg="3"
            md="4"
            sm="6"
            class="py-0 pb-6"
          >
            <UserCard :logged-in="loggedIn" :user="user" />
          </v-col>
        </template>
        <template v-else>
          <v-col cols="12">
            <h3 class="font-18 text-center greyMuted--text font-weight-regular">
              No Follower Found!
            </h3>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mdiPlus, mdiMagnify } from '@mdi/js';
import debounce from 'lodash.debounce';
export default {
  name: 'MyFollowers',
  async asyncData({ app, params }) {
    try {
      const { data } = await app.$axios.$get(`api/get-user/${params.username}`);
      return {
        userInfo: data,
      };
    } catch (e) {}
  },
  data: () => ({
    userInfo: null,
    loading: false,
    members: [],
    following: false,
    index: -1,
    current_page: 1,
    last_page: 0,
    load_more: false,
    query: '',
    mdiPlus,
    mdiMagnify,
  }),
  head: {
    title: 'Followers',
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    username() {
      return this.$route.params.username;
    },
  },
  async mounted() {
    await this.getMembers();
    // auto scroll pagination
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    // handle scroll pagination
    handleScroll() {
      const bottom = document.documentElement.getBoundingClientRect().bottom;
      const height = document.documentElement.clientHeight;

      if (bottom < height + 200) {
        // let's add more data
        if (this.current_page < this.last_page) {
          if (!this.load_more) {
            this.current_page++;
            this.loadMore();
          }
        }
      }
    },
    // get members
    async getMembers() {
      this.loading = true;
      try {
        const { data, meta } = await this.$axios.$get(
          `api/user/followers/${this.username}`,
          {
            params: { page: 1, limit: 16 },
          }
        );
        this.loading = false;
        this.members = data;
        this.last_page = meta.last_page;
      } catch (e) {}
    },
    // follow member
    async followMember(user, i) {
      this.index = i;
      this.following = true;
      try {
        const { following } = await this.$axios.$get(
          `api/user/follow/${user.id}`
        );
        const message = following
          ? 'Successfully followed'
          : 'Successfully unfollowed';
        this.following = false;
        user.isFollowing = following;
        this.$set(this.members, i, user);

        const updateUser = JSON.parse(JSON.stringify(this.$auth.user));
        if (following) {
          updateUser.peopleIFollow.push(user.id);
        } else {
          updateUser.peopleIFollow = updateUser.peopleIFollow.filter((id) => {
            return Number(id) !== Number(user.id);
          });
        }
        this.$auth.setUser(updateUser);

        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (e) {}
    },
    // load more
    async loadMore() {
      this.load_more = true;
      try {
        const { data } = await this.$axios.$get(
          `api/user/followers/${this.username}`,
          {
            params: {
              page: this.current_page,
              limit: 16,
            },
          }
        );
        this.load_more = false;
        data.forEach((item) => this.members.push(item));
      } catch (e) {}
    },
    // search followers
    searchFollowers: debounce(async function () {
      try {
        const { data } = await this.$axios.$get(
          `api/user/followers/${this.username}?query=${this.query}&page=1&limit=16`
        );
        this.members = data;
      } catch (e) {}
    }, 500),
  },
};
</script>
