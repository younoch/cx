<template>
  <v-container>
    <page-header />

    <v-row>
      <template v-if="loading">
        <v-col v-for="(n, i) in 8" :key="i" cols="12" md="3">
          <v-skeleton-loader elevation="2" type="card" />
        </v-col>
      </template>
      <template v-else>
        <v-col v-for="(user, i) in members" :key="i" cols="12" md="3">
          <v-card outlined>
            <div class="avatar">
              <v-img height="102" :src="user.cover_image" />
              <v-avatar class="profile" color="grey" size="120">
                <v-img :src="user && user.image? user.image : $store.state.defaultProfileImage"  />
              </v-avatar>
            </div>
            <div class="avatar-spacer" />
            <v-card-title class="justify-center">
              <n-link :to="`/${user.username}`">
                {{ user.name }}
              </n-link>
            </v-card-title>
            <v-card-subtitle class="text-center">
              <strong>Joined: </strong> {{ user.created_at }}
            </v-card-subtitle>
            <v-divider />
            <v-card-actions class="justify-center">
              <template v-if="user.is_following">
                <v-btn
                  v-if="loggedIn"
                  color="primary"
                  outlined
                  :loading="following && i === index"
                  @click="followMember(user, i)"
                >
                  Following
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  v-if="loggedIn"
                  class="primary"
                  depressed
                  :loading="following && i === index"
                  @click="followMember(user, i)"
                >
                  <v-icon left>
                    {{ mdiPlus }}
                  </v-icon>
                  Follow
                </v-btn>
                <v-btn v-else depressed class="primary" to="/auth/login">
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
    </v-row>
  </v-container>
</template>

<script>
import { mdiPlus } from '@mdi/js';
export default {
  name: 'MembersPage',
  data: () => ({
    loading: false,
    members: [],
    following: false,
    index: -1,
    current_page: 1,
    last_page: 0,
    load_more: false,
    mdiPlus,
  }),
  head: {
    title: 'Members',
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
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
        const { data, meta } = await this.$axios.$get('api/get-users', {
          params: { page: 1, limit: 16 },
        });
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
        const { message, following } = await this.$axios.$get(
          `api/user/follow/${user.id}`
        );
        this.following = false;
        user.is_following = following;
        this.$set(this.members, i, user);
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (e) {}
    },
    // load more
    async loadMore() {
      this.load_more = true;
      try {
        const { data } = await this.$axios.$get('api/get-users', {
          params: {
            page: this.current_page,
            limit: 16,
          },
        });
        this.load_more = false;
        data.forEach((item) => this.members.push(item));
      } catch (e) {}
    },
  },
};
</script>
