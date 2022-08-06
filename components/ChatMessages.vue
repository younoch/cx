<template>
  <v-card
    outlined
    class="mx-1 messages rounded-t-lg"
    width="300"
    :loading="processing"
  >
    <!-- auth user name and image -->
    <client-only>
      <v-card-title v-if="loggedIn" class="chat-box pa-0 flex-nowrap">
        <v-list-item class="py-0 pr-0">
          <v-badge
            v-if="isOnline"
            bordered
            bottom
            color="success"
            dot
            offset-x="10"
            offset-y="10"
            class="mr-2 my-0 active-badge"
          >
            <v-avatar size="34" color="purple" class="justify-center">
              <v-img :src="user && user.image? user.image : $store.state.defaultProfileImage"  :alt="user.name"/>
            </v-avatar>
          </v-badge>
          <v-list-item-avatar
            v-else
            size="34"
            class="justify-center mr-2"
            color="purple"
          >
            <v-img  :src="user && user.image? user.image : $store.state.defaultProfileImage" :alt="user.name" />
          </v-list-item-avatar>

          <v-list-item-content class="py-0">
            <v-list-item-title class="mb-0">
              <span class="heading--text font-14">Messaging</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-spacer />
        <v-btn icon @click.stop="selectedUser(user)">
          <v-icon>{{ mdiSquareEditOutline }}</v-icon>
        </v-btn>
        <v-btn icon @click="openPanel = !openPanel">
          <v-icon>{{ openPanel ? mdiChevronDown : mdiChevronUp }}</v-icon>
        </v-btn>
      </v-card-title>
    </client-only>
    <v-divider />

    <!-- Chat users list inner -->
    <v-card-text v-if="openPanel" class="panel-body custom-scrollbar px-2 py-1">
      <v-text-field
        v-model.trim="query"
        label="Search messages"
        flat
        solo
        :prepend-inner-icon="mdiMagnify"
        background-color="greyLight"
        class="mt-1 chat-message__search messaging-search-input"
        height="40"
        hide-details
        @keyup="searchMessage"
      />
      <v-list>
        <template v-if="!processing">
          <!-- chat users list -->
          <template v-if="chatUsers.length">
            <div v-for="(chatUser, index) in chatUsers" :key="index">
              <v-list-item
                v-if="chatUser.user && chatUser.user.id !== user.id"
                class="py-0 pr-0 connects-user-item"
                @click.stop="selectedUser(chatUser)"
              >
                <v-badge
                  v-if="isUserOnline(chatUser.user.id)"
                  bordered
                  bottom
                  color="success"
                  dot
                  offset-x="10"
                  offset-y="10"
                  class="mr-2 my-2 active-badge"
                >
                  <v-avatar size="46"  class="justify-center">
                    <v-img
                      :src="chatUser && chatUser.user && chatUser.user.image? chatUser.user.image : $store.state.defaultProfileImage"
                      :alt="chatUser.user.name"
                    />
                  </v-avatar>
                </v-badge>
                <v-list-item-avatar
                  v-else
                  size="46"
                  class="justify-center mr-2"
                  color="purple"
                >
                  <v-img
                    :src="chatUser.user && chatUser.user.image? chatUser.user.image : $store.state.defaultProfileImage"
                    :alt="chatUser.user.name"
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    class="d-flex body-2 mt-1 justify-space-between"
                    :class="chatUser.unseen > 0 ? 'font-weight-bold' : ''"
                  >
                    {{ subStrText(chatUser.user.name, 15) }}
                    <span class="last-chat-date pr-2">
                      {{ chatUser.message.created_at | pureDateFormat }}
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle
                    class="text-wrap d-flex justify-space-between mr-9"
                  >
                    <template v-if="chatUser.message.type === 'text'">
                      <div
                        class="
                          mb-0
                          last
                          chat__message-last
                          caption
                          font-weight-regular
                        "
                        :class="chatUser.unseen > 0 ? 'font-weight-bold' : ''"
                        v-html="subStrText(chatUser.message.message, 20)"
                      ></div>
                    </template>
                    <template v-else-if="chatUser.message.type === 'link'">
                      <a :href="chatUser.message.message" target="blank">
                        {{ subStrText(chatUser.message.message, 45) }}
                      </a>
                    </template>
                    <template v-else-if="chatUser.message.type === 'file'">
                      <span
                        :class="chatUser.unseen > 0 ? 'font-weight-bold' : ''"
                      >
                        {{
                          `${
                            chatUser.message.sender_id === user.id
                              ? 'You'
                              : chatUser.user.name
                          } sent an attachment`
                        }}
                      </span>
                    </template>
                  </v-list-item-subtitle>
                  <span
                    v-if="chatUser.unseen > 0"
                    class="unseen-message-count"
                    >{{ findUnseenRoot(chatUser.unseen) }}</span
                  >
                </v-list-item-content>
              </v-list-item>
            </div>
          </template>
          <template v-else> No messages yet! </template>
        </template>
        <template v-else>
          <v-skeleton-loader type="list-item-avatar-two-line" />
          <v-skeleton-loader type="list-item-avatar-two-line" />
          <v-skeleton-loader type="list-item-avatar-two-line" />
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  mdiChevronDown,
  mdiChevronUp,
  mdiPencilBoxOutline,
  mdiMagnify,
  mdiDotsVertical,
  mdiMessageBulleted,
  mdiDelete,
  mdiAttachment,
  mdiSquareEditOutline,
} from '@mdi/js';
import * as debounce from 'lodash.debounce';
import { mapState } from 'vuex';

export default {
  name: 'ChatMessages',
  data() {
    return {
      query: '',
      processing: false,
      openPanel: false,
      keyword: '',
      onlineUserIds: [],
      mdiChevronDown,
      mdiChevronUp,
      mdiPencilBoxOutline,
      mdiMagnify,
      mdiMessageBulleted,
      mdiDotsVertical,
      mdiDelete,
      mdiAttachment,
      mdiSquareEditOutline,
    };
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    ...mapState('online', ['chatUsers', 'onlineUsers', 'users']),
    isOnline() {
      return !!this.users.find((_) => _.id === this.user.id);
    },
  },
  watch: {
    chatUsers() {
      if (this.chatUsers[0]?.unseen > 0 && this.$route.name !== 'messaging') {
        this.$store.commit('chat/USER_SELECTED', this.chatUsers[0]?.user);
      }
    },
  },
  async mounted() {
    await this.getChatUsers();
  },
  methods: {
    async getChatUsers() {
      this.processing = true;
      if (this.loggedIn) {
        try {
          await this.$store.dispatch('online/getChatUsers');
          this.processing = false;
        } catch (e) {
          this.processing = false;
        }
      }
    },
    findUnseenRoot(unseenMessages) {
      return Math.ceil(Math.sqrt(unseenMessages));
    },
    isEmpty(obj) {
      return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    },
    // helper to truncate text
    subStrText(str, limit = 20) {
      return str && str.length > limit ? str.substr(0, limit) + '...' : str;
    },
    isUserOnline(userId) {
      return !!this.users.find((_) => _.id === userId);
    },
    searchMessage: debounce(async function () {
      if (this.query?.length > 0) {
        this.processing = true;
        try {
          await this.$store.dispatch('online/searchMessages', this.query);
          this.processing = false;
        } catch (e) {
          this.processing = false;
        }
      } else {
        await this.getChatUsers();
      }
    }, 500),
    // user selected from search
    async selectedUser(user) {
      // join in chat room
      await this.$store.dispatch('online/joinChatRoom', {
        userId: user.user?.id,
      });
      this.$store.commit('chat/USER_SELECTED', user?.user);
      this.$store.commit(
        'online/decreaseMessageCounter',
        Math.ceil(Math.sqrt(user?.unseen))
      );
    },
  },
};
</script>
