<template>
  <div>
    <v-card elevation="0" class="mx-auto rounded-lg border-1" text>
      <div class="pa-4 text-h6 opacity-07">Manage invitations</div>
      <v-card id="lateral" elevation="0" text>
        <v-tabs v-model="tabs">
          <v-tab
            href="#received"
            class="
              ml-2
              pa-1
              font-weight-regular
              text-capitalize
              letter-spacing-04
              height-50
            "
            @click="invitationCount('received')"
          >
            Received</v-tab
          >
          <v-tab
            href="#sent"
            class="
              font-weight-regular
              pa-1
              text-capitalize
              letter-spacing
              height-50
            "
            @click="invitationCount('sent')"
            >Sent</v-tab
          >
          <v-tabs-slider class="ml-2 width-72" color="primary"></v-tabs-slider>
        </v-tabs>

        <v-divider
          class="absulate"
          :style="{ border: '1px solid #eee' }"
        ></v-divider>
        <v-btn
          elevation="0"
          rounded
          color="primary"
          class="ma-2 ml-4 py-1 px-4 text-capitalize font-13"
          height="25"
          text
          dark
        >
          {{ tabStatusWithCount }}
        </v-btn>
        <v-divider light class="absulate"></v-divider>
        <v-card-text>
          <v-tabs-items v-model="tabs">
            <v-tab-item :key="'received'" :value="'received'">
              <template v-if="members.length > 0">
                <v-card
                  v-for="(user, i) in members"
                  :key="i"
                  text
                  class="justify-start cr-card d-flex px-3"
                >
                  <div class="cr-card-user-img">
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
                  <div class="cr-card-info">
                    <div class="d-flex justify-space-between align-center">
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
                      <div class="cr-card-action">
                        <v-btn
                          class="
                            text-capitalize text-subtitle-1
                            ma-1
                            border-1
                            height-32
                          "
                          width="130"
                          depressed
                          outlined
                          rounded
                          text
                          :loading="ignoring && i === index"
                          @click="updateConnection(user, i, 'ignore')"
                          >Ignore</v-btn
                        >
                        <v-btn
                          class="text-capitalize text-subtitle-1 height-32"
                          width="130"
                          outlined
                          rounded
                          color="primary"
                          :loading="connecting && i === index"
                          @click="updateConnection(user, i, 'connect')"
                          >Accept</v-btn
                        >
                      </div>
                    </div>
                    <div class="px-3 mt-3 cr-card-message">
                      <div v-if="user.note" class="cr-card-message-info">
                        <p
                          v-if="user.note"
                          class="pb-0 mb-0 subtitle-1 text--text line-height-20"
                        >
                          {{ user.note }}
                        </p>
                        <!-- please do not delete. it's next features <v-btn
                          color="grayLight"
                          class="text-capitalize rounded-pill pa-4 font-14 text--text"
                          elevation="0"
                          small
                          @click="selectUser(user, i, 'connect')"
                          >Reply to {{ user.first_name }}</v-btn
                        > -->
                      </div>
                      <span v-else class="text-center">No Message</span>
                    </div>
                  </div>
                  <v-divider></v-divider>
                </v-card>
              </template>
              <template v-else>
                <v-card
                  height="200"
                  text
                  class="d-flex align-center justify-center"
                >
                  <p class="text-h4 title--text opacity-08">
                    No new invitations
                  </p>
                </v-card>
              </template>
            </v-tab-item>

            <v-tab-item :key="'sent'" :value="'sent'">
              <!-- Imported contact Start -->

              <template v-for="(member, mIndex) in pendingMembers">
                <div :key="mIndex + '-member'">
                  <v-list-item class="px-1">
                    <v-list-item-avatar
                      class="basis rounded-pill d-inline-block"
                      tile
                      size="55"
                      color="primary"
                      ><img :src="member.image"
                    /></v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title class="font-weight-medium">
                        <n-link :to="`/${member.username}`">
                          {{ member.name }}
                        </n-link>
                      </v-list-item-title>

                      <v-list-item-subtitle>
                        {{ member.tagline }}
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn
                        rounded
                        depressed
                        text
                        class="
                          py-1
                          px-3
                          text-capitalize
                          font-14
                          height-31
                          opacity-07
                          greyLight
                        "
                        @click="
                          (withDialog = !withDialog),
                            (selectWithDrawData = member)
                        "
                      >
                        Withdraw
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider v-if="mIndex !== pendingMembers.length - 1" />
                </div>
              </template>

              <!-- Imported contact End -->
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-card>
    <withdraw-dialog
      :show="withDialog"
      :data-object="selectWithDrawData"
      @withdrawSuccess="withdrawSuccess"
      @closeWithdraw="withDialog = false"
    />
  </div>
</template>
<script>
export default {
  name: 'ManageInvitation',
  filters: {
    isValidURL(str) {
      const a = document.createElement('a');
      a.href = str;
      return a.host && a.host !== window.location.host ? 'link' : 'text';
    },
  },
  data: () => ({
    fab: false,
    hidden: false,
    tabs: null,
    members: [],
    pendingMembers: [],
    status: 'received',
    ignoring: false,
    connecting: false,
    loading: false,
    following: false,
    index: -1,
    current_page: 1,
    last_page: 0,
    load_more: false,
    withDialog: false,
    selectWithDrawData: {},
  }),
  computed: {
    tabStatusWithCount() {
      if (this.status === 'received') {
        return `All (${this.members.length})`;
      } else {
        return `People (${this.pendingMembers.length})`;
      }
    },
    loggedIn() {
      return this.$auth.loggedIn;
    },
    authUser() {
      return this.$auth.user;
    },
  },

  mounted() {
    this.getPendingMembers();
    this.getRequestByMeMembers();
    this.status = 'received';
  },

  methods: {
    // get members
    async getRequestByMeMembers() {
      this.loading = true;
      try {
        const { data } = await this.$axios.$get(
          `api/connection/request/type/pending`,
          {
            params: { page: 1, limit: 500 },
          }
        );
        this.pendingMembers = data;
      } catch (e) {}
    },

    showModal() {
      this.$refs.modalButton.click();
    },

    invitationCount(item) {
      if (item === 'received') {
        this.status = 'received';
      } else {
        this.status = 'people';
      }
    },
    // get members
    async getPendingMembers() {
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

    // select user to open chatbox
    async selectUser(user, i, action) {
      try {
        await this.updateConnection(user, i, action);
        await this.$store.commit('chat/USER_SELECTED', user);
      } catch (err) {}
    },

    // update connection, connect or ignore
    async updateConnection(user, i, action) {
      let noteMessage;

      this.index = i;
      if (action === 'connect') {
        this.connecting = true;
      } else {
        this.ignoring = true;
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
        let notifyMessage = '';

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

          notifyMessage = 'Connect successfully accepted';
          this.$emit('addConnectionCount');
        } else {
          user.connected = false;
          this.ignoring = false;
          await this.getPendingMembers();
          notifyMessage = 'Connect successfully ignored';
        }
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', notifyMessage);
      } catch (e) {
        this.connecting = false;
        this.ignoring = false;
      }
    },
    disappearConnectionRequest(index) {
      if (index > -1) {
        this.members.splice(index, 1);
      }
    },

    withdrawSuccess(userId) {
      this.pendingMembers = this.pendingMembers.filter((item) => {
        return Number(item.id) !== Number(userId);
      });
      this.withDialog = false;
    },
  },
};
</script>
