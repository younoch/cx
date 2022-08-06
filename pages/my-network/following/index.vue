<template>
  <div>
    <div class="sticky-top-8 z-index-3 background">
      <template v-if="followingHeaderLoading">
        <v-card flat class="mb-3 border-1" rounded="lg">
          <v-row class="my-1 align-center">
            <v-col class="py-0" cols="12">
              <v-skeleton-loader type="table-heading" />
            </v-col>
          </v-row>
        </v-card>
      </template>
      <template v-else>
        <v-card flat class="py-2 border-1" rounded="lg">
          <v-row class="px-4 my-1 align-center">
            <v-col class="py-0" cols="12" sm="7"
              ><h4 class="font-weight-medium subtitle-1 text--text">
                {{ followingCount }} Following
              </h4></v-col
            >
            <v-col class="py-0" cols="12" sm="5">
              <v-text-field
                v-model="query"
                label="Search by name"
                persistent-hint
                outlined
                dense
                hide-details
                :prepend-inner-icon="mdiMagnify"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </div>
    <v-row class="mt-6">
      <template v-if="loading">
        <v-col v-for="(n, i) in 8" :key="i" cols="12" md="4" class="py-0 pb-6">
          <v-skeleton-loader type="card" />
        </v-col>
      </template>
      <template v-else>
        <template v-if="members.length > 0">
          <v-col
            v-for="(user, i) in members"
            :key="i"
            cols="12"
            md="4"
            class="py-0 pb-6"
          >
            <v-card outlined class="rounded-lg">
              <div class="avatar">
                <v-img
                  class="rounded-t-lg"
                  height="80"
                  :src="user.cover_image"
                />
                <v-avatar class="profile" color="grey" size="100">
                  <v-img :src="user && user.image? user.image : $store.state.defaultProfileImage"  />
                </v-avatar>
              </div>
              <div class="avatar-spacer" />
              <v-card-title class="justify-center py-0">
                <n-link
                  class="title--text h6 font-weight-bold mambers-name subtitle-1"
                  :to="`/${user.username}`"
                >
                  {{
                    user.name && user.name.length > 20
                      ? user.name.substr(0, 20) + '...'
                      : user.name
                  }}
                </n-link>
              </v-card-title>
              <v-card-subtitle
                class="text-center title--text font-weight-light user-designation pt-3 caption pb-1"
                :class="[
                  user.tagline && user.tagline.length > 0 ? '' : 'height-36',
                ]"
              >
                {{
                  user.tagline && user.tagline.length > 30
                    ? user.tagline.substr(0, 30) + '...'
                    : user.tagline
                }}
              </v-card-subtitle>
              <v-card-subtitle class="text-center pb-3 pt-0">
                <strong class="caption font-weight-bold">Joined: </strong>
                <span class="caption"
                  >{{ user.created_at | datetime }} ago</span
                >
              </v-card-subtitle>
              <v-divider class="user-v-divider-color"></v-divider>
              <v-card-actions class="justify-center">
                <template v-if="loggedIn">
                  <v-btn
                    color="primary"
                    class="rounded-pill px-5"
                    outlined
                    :loading="following && i === index"
                    @click="followMember(user, i)"
                  >
                    Following
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn
                    color="primary"
                    class="rounded-pill px-5"
                    outlined
                    to="/auth/login"
                  >
                    <v-icon left>
                      {{ mdiPlus }}
                    </v-icon>
                    Follow
                  </v-btn>
                </template>
              </v-card-actions>
            </v-card>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="12">
            <div class="d-flex align-center justify-center">
              <p class="text-h5 title--text opacity-08">No following found</p>
            </div>
          </v-col>
        </template>
      </template>
    </v-row>
  </div>
</template>
<script>
import { mdiPlus, mdiMagnify } from '@mdi/js';
import * as debounce from 'lodash.debounce';

export default {
  name: 'MyFollowings',
  props: {
    followingCount: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    loading: false,
    members: [],
    following: false,
    index: -1,
    current_page: 1,
    last_page: 0,
    load_more: false,
    mdiPlus,
    mdiMagnify,
    query: '',
    followingHeaderLoading: true,
  }),
  head: {
    title: 'Followings',
  },

  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    username() {
      return this.$auth ? this.$auth.user.username : '';
    },
  },

  watch: {
    query: debounce(function () {
      this.index = -1;
      this.current_page = 1;
      this.last_page = 0;
      this.getMembers(this.query);
    }, 500),
  },

  async mounted() {
    await this.getMembers();
    this.followingHeaderLoading = false;
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
    async getMembers(query = '') {
      this.loading = true;
      try {
        const { data, meta } = await this.$axios.$get(
          `api/user/following/${this.username}?query=${query}`,
          {
            params: { page: 1, limit: 16 },
          }
        );
        this.loading = false;
        this.members = data;
        this.last_page = meta.last_page;
      } catch (e) {
        this.loading = false;
      }
    },

    // follow member
    async followMember(user, i) {
      this.index = i;
      this.following = true;
      try {
        const { following } = await this.$axios.$get(
          `api/user/follow/${user.id}`
        );
        this.following = false;
        user.amIFollowingThisUser = following;
        this.$set(this.members, i, user);

        if (!following) {
          const updateUser = JSON.parse(JSON.stringify(this.$auth.user));
          updateUser.peopleIFollow = updateUser.peopleIFollow.filter((id) => {
            return Number(id) !== Number(user.id);
          });
          this.$auth.setUser(updateUser);
        }

        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          following ? 'Successfully followed' : 'Successfully unfollowed'
        );
        this.members = this.members.filter((item) => {
          return item.id !== user.id;
        });
        this.$emit('removefollowCount');
      } catch (e) {}
    },
    // load more
    async loadMore() {
      this.load_more = true;
      try {
        const { data } = await this.$axios.$get(
          `api/user/following/${this.username}`,
          {
            params: {
              page: this.current_page,
              limit: 16,
            },
          }
        );
        this.load_more = false;
        data.forEach((item) => this.members.push(item));
      } catch (e) {
        this.load_more = false;
      }
    },
  },
};
</script>

<style scoped>
.sticky-top-8 {
  position: sticky !important;
  top: 7rem !important;
}

@media only screen and (max-width: 960px) {
  .sticky-top-8 {
    top: 6.5rem !important;
  }
}
</style>
