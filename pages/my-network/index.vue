<template>
  <v-row>
    <template v-if="loading">
      <v-col v-for="(n, i) in 8" :key="i" cols="12">
        <v-skeleton-loader elevation="2" type="card" />
      </v-col>
    </template>
    <template v-else>
      <v-col cols="12" class="my-network__container">
        <v-card
          v-if="members.length <= 0"
          elevation="0"
          outlined
          class="pr-6 rounded-lg d-flex align-center justify-lg-space-between"
        >
          <v-subheader class="body-1 text--grey text--darken-3 text--text">
            No pending invitations</v-subheader
          >
          <v-btn
            to="/my-network/manage-invitations"
            elevation="0"
            color="grayLight"
            class="py-0 my-3 ml-auto text-capitalize text--text manage-btn"
            >Manage</v-btn
          >
        </v-card>
        <!-- new connection request inner -->
        <v-card
          v-if="members.length > 0"
          flat
          outlined
          class="rounded-lg connection-requests"
        >
          <div class="px-5 py-2 header d-flex align-center">
            <v-row>
              <v-col cols="6">
                <h5 class="text--text subtitle-1">Invitations</h5>
              </v-col>
              <v-col cols="6" class="text-right">
                <nuxt-link
                  class="text--text"
                  to="/my-network/manage-invitations"
                >
                  Manage
                </nuxt-link>
              </v-col>
            </v-row>
          </div>
          <v-divider></v-divider>
          <!-- connection card item -->
          <template v-for="(user, i) in members">
            <v-card
              v-if="i <= showMoreInvatations"
              :key="i"
              flat
              class="justify-start cr-card d-flex px-3"
            >
              <div class="w-100 px-2">
                <div
                  class="d-flex flex-wrap justify-space-between align-center"
                >
                  <div class="d-flex align-center mb-2 mr-3">
                    <div class="cr-card-user-img mr-3">
                      <v-avatar size="70" color="blue">
                        <img
                          v-if="user.image"
                          :src="user.image"
                          :alt="user.first_name"
                        />
                        <span v-else class="white--text subtitle-1"
                          >{{ user.first_name.charAt(0) }}
                          {{ user.last_name.charAt(0) }}</span
                        >
                      </v-avatar>
                    </div>
                    <div class="cr-card-personal-info">
                      <n-link :to="`/${user.username}`">
                        <h5
                          class="
                            name
                            font-weight-medium
                            text--text
                            subtitle-1
                            pb-0
                            mb-0
                            line-height-16
                          "
                        >
                          {{ user.first_name }} {{ user.last_name }}
                        </h5>
                      </n-link>
                      <span v-if="user.tagline" class="caption pt-0">{{
                        user.tagline
                      }}</span>
                    </div>
                  </div>
                  <div
                    class="
                      cr-card-action
                      d-flex
                      align-center
                      justify-content-end
                      ms-auto
                    "
                  >
                    <v-btn
                      class="text-capitalize text-subtitle-1 ma-1 border-1 mr-2"
                      width="120"
                      depressed
                      outlined
                      rounded
                      height="32"
                      text
                      :loading="ignoring && i === index"
                      @click="updateConnection(user, i, 'ignore')"
                      >Ignore</v-btn
                    >
                    <v-btn
                      class="text-capitalize text-subtitle-1"
                      width="120"
                      height="32"
                      outlined
                      rounded
                      color="primary"
                      :loading="connecting && i === index"
                      @click="updateConnection(user, i, 'connect')"
                      >Accept</v-btn
                    >
                  </div>
                </div>
                <div v-if="user.note" class="px-3 mt-3 cr-card-message">
                  <div class="cr-card-message-info">
                    <p class="pb-0 mb-0 subtitle-1 text--text line-height-20">
                      {{ user.note }}
                    </p>
                    <!-- please do not delete. it's next features  <v-btn
                      class="
                        text-capitalize
                        rounded-pill
                        pa-4
                        font-14
                        text--text
                      "
                      color="grayLight"
                      elevation="0"
                      small
                      >Reply to {{ user.first_name }}</v-btn
                    > -->
                  </div>
                </div>
              </div>
              <v-divider></v-divider>
            </v-card>
          </template>

          <v-divider></v-divider>
          <template v-if="members.length > 3">
            <v-btn
              v-if="members.length > showMoreInvatations"
              text
              block
              class="text-capitalize primary--text"
              @click="showMoreInvatations += 3"
            >
              Show more
            </v-btn>

            <v-btn
              v-if="members.length < showMoreInvatations"
              text
              block
              class="text-capitalize primary--text"
              @click="showMoreInvatations = 2"
            >
              Less more
            </v-btn>
          </template>
          <!-- End: connection card item -->
        </v-card>
        <!-- end connection request card -->
      </v-col>
    </template>
    <Confirm ref="confirm" />
  </v-row>
</template>

<script>
import { mdiPlus } from '@mdi/js';
import { mapState } from 'vuex';
export default {
  name: 'MyNetworkHome',
  filters: {
    isValidURL(str) {
      const a = document.createElement('a');
      a.href = str;
      return a.host && a.host !== window.location.host ? 'link' : 'text';
    },
  },
  data: () => ({
    loading: false,
    members: [],
    following: false,
    index: -1,
    connecting: false,
    ignoring: false,
    current_page: 1,
    last_page: 0,
    load_more: false,
    mdiPlus,
    showMoreInvatations: 2,
  }),
  head: {
    title: 'My Network',
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    authUser() {
      return this.$auth.user;
    },
    ...mapState('online', [
      'messagingChatUsers',
      'singleChatHistory',
      'onlineUsers',
      'users',
    ]),
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
    // select user to open chatbox
    async selectUser(user, i, action) {
      try {
        await this.updateConnection(user, i, action);
        await this.$store.commit('chat/USER_SELECTED', user);
      } catch (err) {}
    },
    // get members
    async getMembers() {
      this.loading = true;
      try {
        const { data, meta } = await this.$axios.$get(
          'api/connection/request/type/requested',
          {
            params: { page: 1, limit: 500 },
          }
        );
        this.loading = false;
        this.members = data;
        this.last_page = meta.last_page;
      } catch (e) {}
    },

    // update connection, connect or ignore
    async updateConnection(user, i, action) {
      let noteMessage;
      let notifyMessage = '';

      this.index = i;
      if (action === 'connect') {
        this.connecting = true;
        notifyMessage = 'Connect successfully accepted';
      } else {
        this.ignoring = true;
        notifyMessage = 'Connect successfully ignored';
      }

      if (user.note) {
        const type = this.$options.filters.isValidURL(user.note);
        noteMessage = { type, message: user.note };
      } else {
        noteMessage = { type: null, message: null };
      }

      try {
        await this.$axios.$post(
          `api/connection/${user.id}/${action}`,
          noteMessage
        );
        if (action === 'connect') {
          this.connecting = false;
          user.connected = true;
          this.$set(this.members, i, user);

          const updateUser = JSON.parse(JSON.stringify(this.$auth.user));
          updateUser.connectedUsers.push(user.id);
          this.$auth.setUser(updateUser);

          await this.$store.dispatch('online/joinChatRoom', {
            userId: user.id,
          });
          this.disappearConnectionRequest(i);
          this.$emit('addConnectionCount');
          if (noteMessage.message != null) {
            setTimeout(() => {
              this.$router.push('/messaging');
            }, 800);
          }
        } else {
          user.connected = false;
          this.ignoring = false;
          await this.getMembers();
        }
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', notifyMessage);
      } catch (e) {
        this.connecting = false;
        this.ignoring = false;
      }
    },
    // load more
    async loadMore() {
      this.load_more = true;
      try {
        const { data } = await this.$axios.$get('api/connection/pending', {
          params: {
            page: this.current_page,
            limit: 500,
          },
        });
        this.load_more = false;
        data.forEach((item) => this.members.push(item));
      } catch (e) {}
    },
    disappearConnectionRequest(index) {
      if (index > -1) {
        this.members.splice(index, 1);
      }
    },
  },
};
</script>
