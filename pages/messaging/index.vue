<template>
  <div class="messaging">
    <v-container>
      <v-row>
        <!-- connections panel -->
        <v-col cols="12" md="3">
          <v-card class="rounded-lg" outlined>
            <!-- panel header -->
            <v-toolbar
              class="messaging-topbar justify-space-between"
              flat
              height="40"
            >
              <span>Messaging</span>
              <v-spacer />
              <v-btn
                icon
                :color="isSearchNewChatUser ? 'error' : ''"
                @click="isSearchNewChatUser = !isSearchNewChatUser"
              >
                <v-icon>
                  {{ isSearchNewChatUser ? mdiClose : mdiSquareEditOutline }}
                </v-icon>
              </v-btn>
            </v-toolbar>
            <v-divider />

            <!-- Search new connections to send message -->
            <template v-if="isSearchNewChatUser">
              <v-text-field
                v-model.trim="query"
                label="Search Connections"
                flat
                solo
                :prepend-inner-icon="mdiMagnify"
                background-color="greyLight"
                class="ma-3 chat-message__search messaging-search-input"
                hide-details
                @keyup="searchUsers()"
              />

              <v-list
                class="overflow-auto custom-scrollbar"
                :class="
                  breakpoint.sm || breakpoint.xs
                    ? 'message__body-vw-height'
                    : ''
                "
              >
                <!-- connections list search item -->
                <template v-if="!searching">
                  <div
                    v-for="(singleUser, index) in filteredUsers.data"
                    :key="'message_' + singleUser.id"
                  >
                    <v-list-item
                      class="py-1 pr-0"
                      :class="activeClass === index ? 'chat-user__active' : ''"
                      @click="selectUserToChat(singleUser, index)"
                    >
                      <!-- active online user avater -->
                      <v-badge
                        v-if="isOnline(singleUser.id)"
                        bordered
                        bottom
                        color="success"
                        dot
                        offset-x="10"
                        offset-y="10"
                        class="mr-2 my-2 active-badge"
                      >
                        <v-avatar
                          size="38"
                          color="purple"
                          class="justify-center"
                        >
                          <v-img
                            :src="singleUser && singleUser.image? singleUser.image : $store.state.defaultProfileImage"
                          />
                        </v-avatar>
                      </v-badge>

                      <!-- Inactive online avater -->
                      <v-list-item-avatar
                        v-else
                        size="38"
                        class="justify-center mr-2"
                        color="purple"
                      >
                        <v-img
                         :src="singleUser && singleUser.image? singleUser.image : $store.state.defaultProfileImage"
                        />
                      </v-list-item-avatar>

                      <v-list-item-content class="py-0">
                        <!-- user name -->
                        <v-list-item-title class="mb-0">
                          <nuxt-link :to="`/${singleUser.username}`">
                            <span class="heading--text font-14 link-hover">{{
                              subStrText(singleUser.name, 15)
                            }}</span>
                          </nuxt-link>
                        </v-list-item-title>
                        <!-- online status or tagline -->
                        <v-list-item-subtitle
                          class="font-13 font-weight-regular"
                        >
                          {{
                            isOnline(singleUser.id)
                              ? 'Active now'
                              : subStrText(singleUser.tagline, 15)
                          }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider />
                  </div>
                </template>
                <template v-else>
                  <div v-if="query.length > 0" class="text-center">
                    <span>Searching...</span>
                  </div>
                </template>
              </v-list>
            </template>

            <!-- previous chat connection list -->
            <template v-else>
              <v-text-field
                v-model.trim="query"
                label="Search Message"
                flat
                solo
                :prepend-inner-icon="mdiMagnify"
                background-color="greyLight"
                class="ma-3 messaging-search-input"
                hide-details
                @keyup="searchMessage"
              />

              <v-list
                class="overflow-auto custom-scrollbar"
                :style="{
                  height:
                    breakpoint.sm || breakpoint.xs
                      ? '100%'
                      : 'calc(80vh - 80px)',
                }"
              >
                <template v-if="!userProcessing">
                  <!-- previous connection item -->
                  <div
                    v-for="(chatSingleUser, index) in messagingChatUsers"
                    :key="chatSingleUser.user.id"
                  >
                    <v-list-item
                      v-if="
                        chatSingleUser.user &&
                        chatSingleUser.user.id !== user.id
                      "
                      class="
                        py-0
                        pr-0
                        pl-sm-2 pl-lg-4
                        connects-user-item
                        chat-user__left-border
                      "
                      :class="activeClass === index ? 'chat-user__active' : ''"
                      @click="selectUserToChat(chatSingleUser.user, index)"
                    >
                      <!-- active online user avater -->
                      <v-badge
                        v-if="isOnline(chatSingleUser.user.id)"
                        bordered
                        bottom
                        color="success"
                        dot
                        offset-x="10"
                        offset-y="10"
                        class="mr-2 my-2 active-badge"
                      >
                        <v-avatar
                          size="45"
                          color="purple"
                          class="justify-center"
                        >
                          <v-img
                            :src="chatSingleUser && chatSingleUser.user && chatSingleUser.user.image? chatSingleUser.user.image : $store.state.defaultProfileImage"
                          />
                        </v-avatar>
                      </v-badge>
                      <v-list-item-avatar
                        v-else
                        size="43"
                        class="justify-center mr-2"
                        color="purple"
                      >
                        <v-img
                          :src="chatSingleUser && chatSingleUser.user && chatSingleUser.user.image? chatSingleUser.user.image : $store.state.defaultProfileImage"
                        />
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title
                          class="d-flex body-2 mb-1 justify-space-between"
                          :class="
                            chatSingleUser.unseen > 0 ? 'font-weight-bold' : ''
                          "
                        >
                          {{ subStrText(chatSingleUser.user.name, 13) }}
                          <span class="last-chat-date pr-2">
                            {{
                              chatSingleUser.message.created_at | pureDateFormat
                            }}
                          </span>
                        </v-list-item-title>
                        <!-- last message -->
                        <v-list-item-subtitle
                          class="text-wrap d-flex justify-space-between mr-11"
                        >
                          <!-- text message -->
                          <template
                            v-if="chatSingleUser.message.type === 'text'"
                          >
                            <div
                              class="mb-0 last chat__message-last"
                              :class="
                                chatSingleUser.unseen > 0
                                  ? 'font-weight-bold'
                                  : ''
                              "
                              v-html="
                                subStrText(
                                  chatSingleUser.message.message,
                                  breakpoint.mdOnly ? 12 : 25
                                )
                              "
                            ></div>
                          </template>

                          <!-- link message -->
                          <template
                            v-else-if="chatSingleUser.message.type === 'link'"
                          >
                            <a
                              :href="chatSingleUser.message.message"
                              target="blank"
                            >
                              {{
                                subStrText(chatSingleUser.message.message, 50)
                              }}
                            </a>
                          </template>
                          <!-- file type chat status -->
                          <template
                            v-else-if="chatSingleUser.message.type === 'file'"
                          >
                            <span
                              :class="
                                chatSingleUser.unseen > 0
                                  ? 'font-weight-bold'
                                  : ''
                              "
                            >
                              {{
                                `${
                                  chatSingleUser.message.sender_id === user.id
                                    ? 'You'
                                    : subStrText(chatSingleUser.user.name, 10)
                                } sent an attachment`
                              }}
                            </span>
                          </template>
                        </v-list-item-subtitle>
                        <!-- messge counting issue -->

                        <span
                          v-if="
                            chatSingleUser.unseen > 0 &&
                            selectChatUser !== chatSingleUser.user.id
                          "
                          class="unseen-message-count"
                          >{{ findUnseenRoot(chatSingleUser.unseen) }}</span
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                </template>
                <!-- skeloton -->
                <template v-else>
                  <v-skeleton-loader type="list-item-avatar-two-line" />
                  <v-skeleton-loader type="list-item-avatar-two-line" />
                  <v-skeleton-loader type="list-item-avatar-two-line" />
                  <v-skeleton-loader type="list-item-avatar-two-line" />
                  <v-skeleton-loader type="list-item-avatar-two-line" />
                  <v-skeleton-loader type="list-item-avatar-two-line" />
                  <v-skeleton-loader type="list-item-avatar-two-line" />
                </template>
              </v-list>
            </template>
          </v-card>
        </v-col>
        <v-col
          v-if="messagingChatUsers.length"
          cols="12"
          md="6"
          :class="[
            breakpoint.smAndDown
              ? 'messaging__body-inner-sm'
              : 'mobile-chat-full',
            isShowSmChat ? 'visible' : '',
          ]"
          class="px-md-0 px-lg-3"
        >
          <v-card
            class="rounded-lg"
            :class="[
              breakpoint.sm || breakpoint.xs ? 'messaging__body-sm' : '',
            ]"
            outlined
          >
            <div class="flex-grow-1">
              <v-toolbar
                class="messaging__body-header flex-grow-0"
                height="50"
                :class="isShowSmChat ? 'remove-p-sm' : ''"
                flat
              >
                <div class="d-flex align-center">
                  <v-btn
                    v-if="(breakpoint.sm || breakpoint.xs) && isShowSmChat"
                    icon
                    @click="isShowSmChat = false"
                    ><v-icon>{{ mdiArrowLeft }}</v-icon></v-btn
                  >
                  <div>
                    <template v-if="!processing">
                      <nuxt-link :to="`/${chatUser.username}`">
                        <h5
                          class="
                            font-weight-medium font-14
                            user__name
                            heading--text
                            link-hover
                          "
                        >
                          {{ subStrText(chatUser.name, 25) }}
                        </h5>
                        <div
                          class="
                            font-13
                            text--text
                            mb-0
                            font-weight-regular
                            d-flex
                            align-center
                          "
                        >
                          <span
                            v-if="isOnline(chatUser.id)"
                            class="active-icon"
                          ></span>
                          {{
                            isOnline(chatUser.id)
                              ? 'Active now'
                              : subStrText(chatUser.tagline, 25)
                          }}
                        </div>
                      </nuxt-link>
                    </template>
                    <template v-else>
                      <v-skeleton-loader
                        class="messaging-skeleton"
                        type="list-item-avatar"
                      />
                    </template>
                  </div>
                </div>
              </v-toolbar>
              <!-- Message body -->
              <v-card flat>
                <v-card-text
                  ref="messagingInner"
                  class="overflow-auto custom-scrollbar px-6 flex-grow-1"
                  :class="
                    breakpoint.sm || breakpoint.xs
                      ? 'messaging__body-sm-height'
                      : 'message__body-vw-height'
                  "
                >
                  <v-list class="d-flex flex-column py-0">
                    <template v-if="!processing">
                      <v-list class="py-0">
                        <v-list-item class="px-0">
                          <template v-if="!processing">
                            <v-badge
                              bordered
                              bottom
                              color="success"
                              dot
                              offset-x="15"
                              offset-y="16"
                              class="mr-3 active-badge-xl"
                            >
                              <v-avatar size="60" >
                                  <v-img :src="chatUser && chatUser.image? chatUser.image : $store.state.defaultProfileImage"  />
                              </v-avatar>
                            </v-badge>
                          </template>
                        </v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="text-h6">
                            {{ subStrText(chatUser.name) }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ subStrText(chatUser.tagline) }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <template
                          v-if="singleChatHistory[connectionId] !== undefined"
                        >
                          <div
                            v-for="(messages, index) in singleChatHistory[
                              connectionId
                            ].chatHistory"
                            :key="index"
                          >
                            <div class="text-center line-after mt-4">
                              <span class="body-2">
                                {{ index | formattedLongMonthDayYear }}
                              </span>
                            </div>
                            <chat-message-item
                              v-for="(message, i) in messages"
                              :key="i"
                              :sender="
                                message.sender_id === user.id ? user : chatUser
                              "
                              :message="message"
                              :last-message="index === 0"
                              @delete-message="
                                deleteMessage($event, i, index, connectionId)
                              "
                            />
                          </div>
                        </template>
                      </v-list>
                    </template>
                    <template v-else>
                      <div v-if="processing" class="text-center mt-5">
                        Loading...
                      </div>
                      <div v-else class="text-center mt-5">
                        No message found!
                      </div>
                    </template>
                  </v-list>
                </v-card-text>
              </v-card>
            </div>

            <!-- messaging input inner -->
            <v-card
              class="messaging-input-inner flex-md-grow-0"
              :class="breakpoint.sm || breakpoint.xs ? 'message__input-sm' : ''"
              flat
            >
              <!-- Showing selected file & image -->
              <template v-if="messageFile">
                <v-list
                  class="py-0 selected-file-display messaging-select-file"
                >
                  <v-list-item>
                    <v-list-item-avatar width="75" tile>
                      <v-img
                        v-if="messageFile.type.match('image.*')"
                        outline
                        :src="showFile"
                      />
                      <span
                        v-else
                        class="message__file-ext gray"
                        :class="
                          messageFile.name.slice(-3) === 'pdf' ? 'file-pdf' : ''
                        "
                      >
                        {{ messageFile.name.slice(-4) }}
                      </span>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ messageFile.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ Math.round(messageFile.size / 1024) / 1000 }} MB
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-icon @click="deleteSelectedFile">
                      <v-btn color="error" icon>
                        <v-icon color="error">
                          {{ mdiClose }}
                        </v-icon>
                      </v-btn>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </template>

              <!-- text area or input inner -->
              <v-card-text
                class="chat-input-inner flex-md-wrap justify-md-space-between"
              >
                <textarea
                  v-if="enterChat"
                  id="messageBox"
                  ref="formInput"
                  :value="messageText"
                  class="chat-input"
                  placeholder="Write a message..."
                  @input="messageText = $event.target.value"
                  @paste="onPaste"
                  @click="setEmojiPosition"
                  @change="setEmojiPosition"
                  @keydown.enter.exact.prevent
                  @keyup.enter.exact="sendMessage"
                ></textarea>

                <textarea
                  v-else
                  id="messageBox"
                  ref="formInput"
                  :value="messageText"
                  class="chat-input"
                  placeholder="Write a message..."
                  @input="messageText = $event.target.value"
                  @paste="onPaste"
                  @click="setEmojiPosition"
                  @change="setEmojiPosition"
                ></textarea>
              </v-card-text>
              <!-- bottom chat input inner -->
              <div
                class="
                  chat-attachments
                  d-flex
                  justify-space-between
                  px-2
                  py-1
                  grey
                  lighten-4
                "
              >
                <div class="chat-attachment-inner d-flex">
                  <v-file-input
                    v-model="messageFile"
                    hide-input
                    class="mt-0 pt-0"
                    accept="image/*"
                    :prepend-icon="mdiImageOutline"
                    @change="focusFormInput"
                  />
                  <v-file-input
                    v-model="messageFile"
                    hide-input
                    class="mt-0 pt-0"
                    accept=".pdf, .xls, .xlsx, .doc, .docx, .ppt, .pptx"
                    :prepend-icon="mdiPaperclip"
                    @change="focusFormInput"
                  />
                  <v-menu
                    :max-width="300"
                    :z-index="999"
                    :allow-overflow="true"
                    :close-on-click="true"
                    :close-on-content-click="false"
                    top
                    offset-y
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>{{ mdiEmoticonExcitedOutline }}</v-icon>
                      </v-btn>
                    </template>
                    <picker
                      set="google"
                      :native="false"
                      title="Pick your emoji.."
                      @select="addEmoji"
                    />
                  </v-menu>
                </div>

                <div class="chat-attachment-actions d-flex align-center">
                  <p v-if="enterChat" class="mb-0 caption grey--text">
                    {{ sending ? 'Sending' : 'Press Enter to Send' }}
                  </p>
                  <v-btn
                    v-else
                    :disabled="messageTriming"
                    rounded
                    color="primary"
                    depressed
                    class="text-capitalize"
                    small
                    @click.stop="sendMessage"
                  >
                    {{ sending ? 'Sending' : 'Send' }}
                  </v-btn>

                  <v-menu offset-y top>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        class="d-sm-block d-none"
                        v-on="on"
                      >
                        <v-icon>{{ mdiDotsHorizontal }}</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item>
                        <v-radio-group v-model="enterChat">
                          <v-radio label="Press Enter to Send" :value="true" />
                          <v-radio label="Click Send" :value="false" />
                        </v-radio-group>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </v-card>
          </v-card>
        </v-col>

        <v-col v-else cols="12" md="6">
          <v-card class="rounded-lg no-messages" outlined>
            <v-card-text>No messages yet!</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <ad-card :footer="true" class="sticky-top">
            <adsbygoogle ad-slot="6757125591" ad-format="auto" />
          </ad-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {
  mdiMagnify,
  mdiDotsHorizontal,
  mdiPaperclip,
  mdiImageOutline,
  mdiEmoticonExcitedOutline,
  mdiClose,
  mdiSquareEditOutline,
  mdiArrowLeft,
} from '@mdi/js';
import debounce from 'lodash.debounce';
import { format, parseISO } from 'date-fns';
import groupBy from 'lodash.groupby';
import { mapState } from 'vuex';
export default {
  name: 'MessagingPage',
  filters: {
    isValidURL(str) {
      const a = document.createElement('a');
      a.href = str;
      return a.host && a.host !== window.location.host ? 'link' : 'text';
    },
  },
  data: () => ({
    isHydrated: false,
    chatUser: null,
    messageText: '',
    messageFile: null,
    userFirst: null,
    userSecond: null,
    connectionId: null,
    enterChat: false,
    isShowEmoji: false,
    sending: false,
    userProcessing: true,
    processing: true,
    searching: true,
    isSearchNewChatUser: false,
    filteredUsers: { data: [], more: [] },
    query: '',
    activeClass: 0,
    isShowSmChat: false,
    mdiMagnify,
    mdiDotsHorizontal,
    mdiPaperclip,
    mdiImageOutline,
    mdiEmoticonExcitedOutline,
    mdiClose,
    mdiSquareEditOutline,
    mdiArrowLeft,
    offsetTop: 0,
    fab: false,
    emojiPosition: 0,
    selectChatUser: 0,
  }),
  head: {
    title: 'Messaging',
  },
  computed: {
    messageTriming() {
      if (this.messageText?.trim().length > 0 || this.messageFile) {
        return false;
      } else {
        return true;
      }
    },
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    ...mapState('online', [
      'messagingChatUsers',
      'singleChatHistory',
      'onlineUsers',
      'users',
      'messageCount',
    ]),
    ...mapState('chat', ['selectedUser']),
    showFile() {
      if (this.messageFile) {
        const fileSrc = URL.createObjectURL(this.messageFile);
        return fileSrc;
      }
      return null;
    },
    breakpoint() {
      return this.isHydrated
        ? this.$vuetify.breakpoint
        : { smAndDown: false, xsOnly: false };
    },
  },

  async mounted() {
    // make total number of messages count to ZERO when the messeging section loads up.
    this.$store.commit('online/updateMessageCounter');

    this.isHydrated = true;
    // focus input
    this.focusFormInput();
    await this.getChatUsers();
    if (this.selectedUser) {
      await this.selectUserToChat(this.selectedUser, 0);
    }
    document.addEventListener('scroll', this.handleScroll);
  },

  beforeDestroy() {
    document.removeEventListener('scroll', this.handleScroll);
  },

  updated() {
    this.$nextTick(() => this.scrollToEnd());
    this.$store.dispatch('online/unseenMessageCount', {
      user: this.chatUser,
    });
    if (this.messageCount > 0) {
      this.$store.commit('online/updateMessageCounter');
    }
  },

  methods: {
    findUnseenRoot(unseenMessages) {
      return Math.ceil(Math.sqrt(unseenMessages));
    },
    // helper to truncate text
    subStrText(str, limit = 20) {
      return str && str.length > limit ? str.substr(0, limit) + '...' : str;
    },
    async getChatUsers() {
      if (this.loggedIn) {
        await this.$store.dispatch('online/getChatUsers');
        if (this.messagingChatUsers.length > 0 && this.messagingChatUsers) {
          this.scrollToEnd();
          this.userProcessing = false;
          if (!this.$vuetify.breakpoint.smAndDown) {
            this.selectUserToChat(this.messagingChatUsers[0].user, 0);
          }
        } else {
          this.userProcessing = false;
        }
      }
    },
    isOnline(userId) {
      return !!this.users.find((_) => _.id === userId);
    },
    // delete message
    async deleteMessage(item, idx, index, connectionId) {
      this.deleting = true;
      try {
        const { message } = await this.$axios.$delete(`api/message/${item.id}`);
        await this.$store.commit('online/DELETE_MESSAGE', {
          idx,
          index,
          connectionId,
        });
        this.deleting = false;
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.deleting = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
    // focus input
    focusFormInput() {
      this.$refs.formInput && this.$refs.formInput.focus();
    },
    async sendMessage() {
      if (this.messageText || this.messageFile) {
        this.sending = true;
        try {
          let type = this.$options.filters.isValidURL(this.messageText);
          const formData = new FormData();

          if (this.messageFile) {
            type = 'file';
          }

          if (this.messageText) {
            formData.append('message', this.messageText);
          }

          formData.append('type', type);
          formData.append('attachment', this.messageFile);

          const { connectionId, data } = await this.$axios.$post(
            `api/message/${this.chatUser.id}`,
            formData
          );

          await this.$store.commit('online/PUSH_USER_MESSAGE', {
            connectionId,
            userId: this.chatUser.id,
            recipientId: data.recipient_id,
            message: data,
          });

          this.messageText = null;
          this.messageFile = null;
          this.sending = false;
        } catch (err) {
          this.sending = false;
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },

    async selectUserToChat(chatUser, index) {
      this.chatUser = chatUser;
      this.activeClass = index;
      this.selectChatUser = chatUser.id;

      if (chatUser) {
        if (this.$vuetify.breakpoint.smAndDown) {
          this.isShowSmChat = true;
        }

        this.messageText = '';
        this.messageFile = null;

        await this.getMessages();
        // join in chat room
        await this.$store.dispatch('online/joinChatRoom', {
          userId: chatUser.id,
        });

        this.$store.commit('online/decreaseMessageCounter', null);
        await this.$store.dispatch('online/unseenMessageCount', {
          user: chatUser,
        });
      }
    },
    // get message
    async getMessages() {
      this.processing = true;
      try {
        const { items, connectionId } = await this.$axios.$get(
          `api/message/${this.chatUser.id}`,
          {
            params: {
              limit: 100,
            },
          }
        );

        this.connectionId = connectionId;
        const allMessages = items.reverse().map((e) => {
          e.date = format(parseISO(e.created_at), 'yyyy-MM-dd');
          return e;
        });
        const messages = groupBy(allMessages, 'date');
        await this.$store.commit('online/GET_CONNECTION_MESSAGES', {
          connectionId,
          userId: this.chatUser.id,
          user: this.chatUser,
          messages,
        });
        this.processing = false;
      } catch (e) {
        this.processing = false;
      }
    },
    seenMessage() {
      this.$store.dispatch('online/unseenMessageCount', {
        user: this.chatUser,
      });
    },
    searchUsers: debounce(async function () {
      this.searching = true;
      try {
        const response = await this.$axios.$get(
          `api/user-search?query=${this.query}`
        );
        this.filteredUsers = response;
        this.searching = false;
      } catch (err) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    }, 500),
    async searchMessage() {
      if (this.query?.length > 0) {
        this.searching = true;
        await this.$store
          .dispatch('online/searchMessagesToMessaging', this.query)
          .then((res) => {
            this.searching = false;
          })
          .catch();
      } else {
        await this.getChatUsers();
      }
    },
    deleteSelectedFile() {
      this.messageFile = null;
    },
    // It's will be added in future v2
    addEmoji(e) {
      if (!e) {
        return false;
      }
      if (!this.messageText) {
        this.messageText = e.native;
      } else if (this.emojiPosition) {
        // get cursor position
        const index = this.emojiPosition || this.messageText.length;
        this.messageText = `${this.messageText.slice(0, index)}${
          e.native
        }${this.messageText.slice(index)}`;
      } else {
        this.messageText = e.native + '' + this.messageText;
      }
      this.emojiPosition += e.native.length;
      this.focusFormInput();
    },
    setEmojiPosition() {
      this.emojiPosition = this.$refs.formInput.selectionStart;
    },

    onPaste(pasteEvent, callback) {
      if (pasteEvent.clipboardData === false) {
        if (typeof callback === 'function') {
          callback(undefined);
        }
      }

      const items = pasteEvent.clipboardData.items;

      if (items === undefined) {
        if (typeof callback === 'function') {
          callback(undefined);
        }
      }
      for (let i = 0; i < items.length; i++) {
        if (!items[i].type.includes('image')) continue;
        const blob = items[i].getAsFile();
        this.messageFile = blob;
      }
    },
    scrollToEnd() {
      const content = this.$refs.messagingInner;
      if (content) {
        content.scrollTop = content.scrollHeight;
      }
    },
  },
};
</script>
