<template>
  <div>
    <div class="sticky-top-8 z-index-5 background">
      <template v-if="connectionHeaderLoading">
        <v-card flat class="border-1" rounded="lg">
          <v-row class="my-1 align-center">
            <v-col class="py-0 px-1" cols="12">
              <v-skeleton-loader type="table-heading"/>
            </v-col>
          </v-row>
        </v-card>
      </template>
      <template v-else>
        <v-card flat class="py-2 border-1" rounded="lg">
          <v-row class="px-4 my-1 align-center">
            <v-col class="py-0" cols="12" sm="7"
              ><h4 class="font-weight-medium subtitle-1 text--text">
                {{ connectionCount }} Connections
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
        <template v-if="connections.length > 0">
          <v-col
            v-for="(user, i) in connections"
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
                <v-btn
                  class="text-capitalize rounded-pill px-6"
                  color="primary"
                  outlined
                  @click="selectUser(user)"
                >
                  Message
                </v-btn>
                <v-menu bottom left class="text-right">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      right
                      fab
                      small
                      absolute
                      dark
                      icon
                      v-bind="attrs"
                      class="text--text z-index-3"
                      v-on="on"
                    >
                      <v-icon>{{ mdiDotsVertical }}</v-icon>
                    </v-btn>
                  </template>

                  <v-list class="py-0">
                    <v-list-item
                      class="cursor-pointer"
                      @click="removeConfirm(user, i)"
                    >
                      <svg
                        class="width-25"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20.11 22.92"
                      >
                        <defs>
                          <style>
                            .cls-delete-svg {
                              fill: #707070;
                            }
                          </style>
                        </defs>
                        <g id="Layer_2" data-name="Layer 2">
                          <g id="Layer_1-2" data-name="Layer 1">
                            <path
                              class="cls-delete-svg"
                              d="M17.86,6.51h-16c-.61,0-.71.13-.65.73l.12,1.51c.15,2,.32,3.92.48,5.87s.35,4.07.51,6.1a2,2,0,0,0,1.83,2.2H16a1.81,1.81,0,0,0,1.61-1.12,3.33,3.33,0,0,0,.22-1l.48-5.83c.2-2.44.39-4.89.61-7.34C19,6.46,18.85,6.51,17.86,6.51ZM6.73,20.23c-.42,0-.67-.28-.71-.84-.2-3.35-.41-6.69-.63-10h0c0-.21,0-.42,0-.62A.61.61,0,0,1,6,8.08a.6.6,0,0,1,.7.55c.06.56.09,1.12.13,1.69.18,3,.37,6,.55,9C7.4,19.88,7.16,20.21,6.73,20.23Zm4-1a2.32,2.32,0,0,1,0,.53.61.61,0,0,1-.66.5.6.6,0,0,1-.6-.5,2.32,2.32,0,0,1,0-.53V9.1c0-.71.22-1,.69-1s.65.34.65,1V19.2Zm3.94-9h0q-.3,4.61-.58,9.23c0,.35-.1.65-.46.78a.67.67,0,0,1-.88-.74c.05-1.13.13-2.26.2-3.39l.42-6.74c0-.19,0-.38,0-.58a.7.7,0,0,1,.74-.67.69.69,0,0,1,.59.77C14.73,9.28,14.7,9.73,14.67,10.18Z"
                            />
                            <path
                              class="cls-delete-svg"
                              d="M18.66,2.7c-1.11,0-2.23,0-3.35,0-.43,0-.57-.08-.57-.55A2,2,0,0,0,12.55,0C10.94,0,9.33.07,7.72,0A2.12,2.12,0,0,0,5.36,2.32c0,.33-.1.39-.4.39-1.18,0-2.36,0-3.53,0a1.5,1.5,0,0,0-.85.24,1.34,1.34,0,0,0,.84,2.44H18.67a1.34,1.34,0,1,0,0-2.68Zm-5.25-.15c-.07.22-.23.15-.36.15H10c-1,0-1.94,0-2.9,0-.3,0-.42-.07-.41-.39,0-.75.2-1,1-1h4.87A.86.86,0,0,1,13.41,2.55Z"
                            />
                          </g>
                        </g>
                      </svg>
                      <v-list-item-title
                        class="ml-3 text--text text-capitalize"
                      >
                        Remove connection
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-actions>
            </v-card>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="12">
            <div class="d-flex align-center justify-center">
              <p class="text-h5 title--text opacity-08">No connections found</p>
            </div>
          </v-col>
        </template>
      </template>
    </v-row>
    <Confirm ref="confirm" />
  </div>
</template>

<script>
import {
  mdiPlus,
  mdiDotsVertical,
  mdiTrashCanOutline,
  mdiMagnify,
} from '@mdi/js';
import * as debounce from 'lodash.debounce';

export default {
  name: 'MyConnections',
  middleware: 'auth',
  props: {
    connectionCount: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    items: [{ title: 'Click Me' }],
    loading: false,
    connections: [],
    following: false,
    index: -1,
    current_page: 1,
    last_page: 0,
    load_more: false,
    mdiPlus,
    mdiDotsVertical,
    mdiTrashCanOutline,
    mdiMagnify,
    query: '',
    connectionHeaderLoading: true,
  }),
  head: {
    title: 'Connections',
  },

  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
  },
  watch: {
    query: debounce(function () {
      this.index = -1;
      this.current_page = 1;
      this.last_page = 0;
      this.getConnections(this.query);
    }, 500),
  },

  async mounted() {
    await this.getConnections();
    this.connectionHeaderLoading = false;
    // auto scroll pagination
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    // select user to open chatbox
    selectUser(user) {
      if (this.$vuetify && this.$vuetify.breakpoint.mobile) {
        // load mobile chat
        this.$store.commit('chat/USER_SELECTED_IN_MOBILE', user);
        this.$router.push('/messaging');
      } else {
        this.$store.commit('chat/USER_SELECTED', user);
      }
    },
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
    // get connections
    async getConnections(query = '') {
      this.loading = true;
      try {
        const { data, meta } = await this.$axios.$get(
          `api/connection?query=${query}`,
          {
            params: { type: 'connected', page: 1, limit: 16 },
          }
        );
        this.loading = false;
        this.connections = data;
        this.last_page = meta.last_page;
      } catch (e) {
        this.loading = false;
      }
    },

    // load more
    async loadMore() {
      this.load_more = true;
      try {
        const { data } = await this.$axios.$get('api/connection', {
          params: {
            type: 'connected',
            page: this.current_page,
            limit: 16,
          },
        });
        this.load_more = false;
        data.forEach((item) => this.connections.push(item));
      } catch (e) {
        this.load_more = false;
      }
    },
    removeConfirm(user, i) {
      this.$refs.confirm
        .open(
          'Disconnect!',
          `Are you sure to remove ${user.name} from your connection list?`,
          { color: 'red' }
        )
        .then((res) => {
          if (res) {
            this.removeConnection(user, i);
          }
          return false;
        });
    },
    // remove connection
    async removeConnection(user, i) {
      this.index = i;
      this.connecting = true;
      try {
        await this.$axios.$delete(`api/connection/${user.id}`);
        this.connecting = false;
        user.connectionStatus = 'notConnected';
        this.$set(this.connections, i, user);

        const updateUser = JSON.parse(JSON.stringify(this.$auth.user));
        updateUser.connectedUsers = updateUser.connectedUsers.filter((id) => {
          return Number(id) !== Number(user.id);
        });
        this.$auth.setUser(updateUser);

        this.connections = this.connections.filter((item) => {
          return item.id !== user.id;
        });
        this.$emit('removeConnectionCount');
        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Connection successfully removed'
        );
      } catch (e) {}
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
    position: sticky !important;
    top: 6.5rem !important;
  }
}
</style>
