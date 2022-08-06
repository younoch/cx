<template>
  <v-card
    outlined
    width="322"
    class="mx-1 single-panel rounded-t-lg"
    :loading="processing"
    :class="breakpoint.smAndDown ? 'absolute' : ''"
  >
    <!-- searching connections to message pannel header  -->
    <v-card-title class="chat-box pa-1 flex-nowrap">
      <v-icon>{{ mdiCommentEditOutline }}</v-icon>
      <span class="ml-1">Write Message</span>
      <v-spacer />
      <v-btn icon @click="reveal = !reveal">
        <v-icon>{{ reveal ? mdiChevronDown : mdiChevronUp }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="close">
        <v-icon>
          {{ mdiClose }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-divider />
    <!-- searching connections to message pannel body  -->
    <v-card-text v-if="reveal" class="panel-body-search px-2 py-1">
      <!-- search field -->
      <v-text-field
        v-model.trim="query"
        label="Search Connections"
        flat
        solo
        :prepend-inner-icon="mdiMagnify"
        background-color="grey lighten-3"
        class="mt-1 chat-message__search messaging-search-input"
        height="40"
        hide-details
        @focus="filterPanel = true"
        @keyup="searchUsers"
      />

      <v-list
        v-if="filterPanel"
        max-height="250"
        class="overflow-auto custom-scrollbar"
      >
        <template v-if="!processing">
          <template v-if="filteredUsers.data.length">
            <!-- Search connections users -->
            <v-list-item-group>
              <div
                v-for="singleUser in filteredUsers.data"
                :key="'connection_' + singleUser.id"
              >
                <v-list-item
                  class="py-1 pr-0"
                  @click.stop="userSelected(singleUser)"
                >
                  <!-- active online user tag profile -->
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
                    <v-avatar size="38" color="purple" class="justify-center">
                      <v-img  :src="singleUser && singleUser.image? singleUser.image : $store.state.defaultProfileImage" />
                    </v-avatar>
                  </v-badge>
                  <!-- inactive online user tag profile -->
                  <v-list-item-avatar
                    v-else
                    size="38"
                    class="justify-center mr-2"
                    color="purple"
                  >
                    <v-img  :src="singleUser && singleUser.image? singleUser.image : $store.state.defaultProfileImage" />
                  </v-list-item-avatar>

                  <v-list-item-content class="py-0">
                    <!-- user name -->
                    <nuxt-link :to="`/${singleUser.username}`">
                      <v-list-item-title class="mb-0">
                        <span class="heading--text font-14 link-hover">{{
                          subStrText(singleUser.name, 18)
                        }}</span>
                      </v-list-item-title>
                    </nuxt-link>
                    <!-- online status or tagline -->
                    <v-list-item-subtitle
                      class="font-13 text--text font-weight-regular"
                    >
                      {{
                        isOnline(singleUser.id)
                          ? 'Active now'
                          : subStrText(singleUser.tagline, 20)
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider />
              </div>
            </v-list-item-group>
          </template>
          <template v-else> No users found </template>
        </template>
        <!-- skeleton -->
        <template v-else>
          <v-skeleton-loader type="list-item-avatar-two-line" />
          <v-skeleton-loader type="list-item-avatar-two-line" />
          <v-skeleton-loader type="list-item-avatar-two-line" />
        </template>
      </v-list>
    </v-card-text>

    <!-- single chat pannel -->
    <v-expand-transition>
      <v-card
        v-if="chatUser"
        class="
          transition-fast-in-fast-out
          d-flex
          flex-column
          v-card--reveal
          absolute
          rounded-t-lg
        "
        :loading="processing"
      >
        <!-- single chating user header -->
        <v-card-title class="chat-box pa-0 flex-nowrap">
          <v-list-item class="py-0 px-2">
            <!-- active online user avater -->
            <v-badge
              v-if="isOnline(chatUser.id)"
              bordered
              bottom
              color="success"
              dot
              offset-x="10"
              offset-y="10"
              class="mr-2 my-0 active-badge"
            >
              <v-avatar size="38" color="purple" class="justify-center">
                <v-img
                  :src="chatUser && chatUser.image? chatUser.image : $store.state.defaultProfileImage"
                />
              </v-avatar>
            </v-badge>
            <!-- Inactive online user avater -->
            <v-list-item-avatar
              v-else
              size="38"
              class="justify-center mr-2"
              color="purple"
            >
              <v-img
              :src="chatUser && chatUser.image? chatUser.image : $store.state.defaultProfileImage" />
            </v-list-item-avatar>

            <v-list-item-content class="py-0">
              <nuxt-link :to="`/${chatUser.username}`">
                <v-list-item-title class="mb-0">
                  <span class="heading--text font-14 link-hover">{{
                    subStrText(chatUser.name, 18)
                  }}</span>
                </v-list-item-title>
              </nuxt-link>

              <v-list-item-subtitle
                class="font-13 text--text font-weight-regular"
              >
                {{
                  isOnline(chatUser.id)
                    ? 'Active now'
                    : subStrText(chatUser.tagline, 25)
                }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-spacer />
          <v-btn icon @click="reveal = !reveal">
            <v-icon>{{ reveal ? mdiChevronDown : mdiChevronUp }}</v-icon>
          </v-btn>
          <v-btn icon @click.stop="close">
            <v-icon>
              {{ mdiClose }}
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <!-- messaging body -->
        <template v-if="reveal">
          <v-card-text
            ref="messagesContainer"
            class="panel-body-messages custom-scrollbar px-2 py-1"
          >
            <template v-if="!processing">
              <v-list
                v-if="singleChatHistory[connectionId] !== undefined"
                class="d-flex flex-column py-0"
              >
                <div
                  v-for="(messages, index) in singleChatHistory[connectionId]
                    .chatHistory"
                  :key="index"
                >
                  <!-- showing week date -->
                  <div class="line-after">
                    <span class="chat-date">{{
                      index | formattedLongMonthDayYear
                    }}</span>
                  </div>

                  <!-- showing message item -->
                  <chat-message-item
                    v-for="(message, idx) in messages"
                    :key="idx"
                    :sender="message.sender_id === user.id ? user : chatUser"
                    :message="message"
                    :last-message="index === 0"
                    @delete-message="
                      deleteMessage($event, idx, index, connectionId)
                    "
                  />
                </div>
              </v-list>
              <template v-else>
                <div class="text-center">No message yet!</div>
              </template>
            </template>
            <!-- skeleton -->
            <template v-else>
              <v-skeleton-loader type="list-item-avatar-two-line" />
              <v-skeleton-loader type="list-item-avatar-two-line" />
              <v-skeleton-loader type="list-item-avatar-two-line" />
            </template>
          </v-card-text>

          <!-- display selected file -->
          <template v-if="messageFile">
            <v-list class="py-0 selected-file-display">
              <v-list-item>
                <v-list-item-avatar tile>
                  <v-img
                    v-if="messageFile.type.match('image.*')"
                    :src="showFile"
                  />
                  <span
                    v-else
                    class="message__file-ext gray"
                    :class="
                      messageFile.name.slice(-3) === 'pdf' ? 'file-pdf' : ''
                    "
                    >{{ messageFile.name.slice(-4) }}</span
                  >
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
                    <v-icon color="grey">
                      {{ mdiClose }}
                    </v-icon>
                  </v-btn>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </template>

          <v-card-text class="chat-input-inner flex-wrap justify-space-between">
            <textarea
              v-if="enterChat"
              ref="formInput"
              v-model="messageText"
              class="chat-input"
              placeholder="Write a message..."
              @click="setEmojiPosition"
              @change="setEmojiPosition"
              @paste="onPaste"
              @keydown.enter.exact.prevent
              @keyup.enter.exact="sendMessage"
            ></textarea>
            <textarea
              v-else
              ref="formInput"
              v-model="messageText"
              class="chat-input"
              placeholder="Write a message..."
              @paste="onPaste"
              @click="setEmojiPosition"
              @change="setEmojiPosition"
            ></textarea>
          </v-card-text>
          <!-- Bottom chat actions -->
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
                depressed
                class="text-capitalize"
                small
                @click.stop="sendMessage"
              >
                {{ sending ? 'Sending' : 'Send' }}
              </v-btn>

              <v-menu offset-y top>
                <template #activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
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
        </template>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>

<script>
import {
  mdiChevronDown,
  mdiChevronUp,
  mdiPencilBoxOutline,
  mdiMagnify,
  mdiClose,
  mdiCommentEditOutline,
  mdiSend,
  mdiFileDocument,
  mdiDotsVertical,
  mdiDelete,
  mdiPaperclip,
  mdiImage,
  mdiImageOutline,
  mdiEmoticonExcitedOutline,
  mdiDotsHorizontal,
} from '@mdi/js';
import debounce from 'lodash.debounce';
import { format, parseISO } from 'date-fns';
import groupBy from 'lodash.groupby';
import { mapState } from 'vuex';

export default {
  name: 'SingleChatWindow',
  filters: {
    isValidURL(str) {
      const a = document.createElement('a');
      a.href = str;
      return a.host && a.host !== window.location.host ? 'link' : 'text';
    },
  },
  props: {
    chatIndex: {
      type: Number,
      required: true,
      default: -1,
    },
    chatUser: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  data() {
    return {
      isHydrated: false,
      processing: false,
      sending: false,
      deleting: false,
      filteredUsers: { data: [], more: [] },
      enterChat: false,
      messageText: null,
      messageFile: null,
      query: '',
      filterPanel: false,
      reveal: true,
      keyword: '',
      isShowEmoji: false,
      userFirst: null,
      userSecond: null,
      connectionId: null,
      mdiChevronDown,
      mdiChevronUp,
      mdiPencilBoxOutline,
      mdiMagnify,
      mdiClose,
      mdiCommentEditOutline,
      mdiSend,
      mdiFileDocument,
      mdiDotsVertical,
      mdiDelete,
      mdiPaperclip,
      mdiImage,
      mdiImageOutline,
      mdiEmoticonExcitedOutline,
      mdiDotsHorizontal,
    };
  },
  computed: {
    ...mapState('online', ['singleChatHistory', 'users']),
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    breakpoint() {
      return this.isHydrated
        ? this.$vuetify.breakpoint
        : { smAndDown: false, xsOnly: false };
    },
    messageTriming() {
      if (this.messageText?.trim().length > 0 || this.messageFile) {
        return false;
      } else {
        return true;
      }
    },
    showFile() {
      if (this.messageFile) {
        const fileSrc = URL.createObjectURL(this.messageFile);
        return fileSrc;
      }
      return null;
    },
  },

  watch: {
    chatUser: {
      async handler() {
        await this.getMessages();
      },
      deep: true,
    },
    messageText() {
      this.$store.dispatch('online/unseenMessageCount', {
        user: this.chatUser,
      });
      this.$store.commit('online/updateMessageCounter');
    },
  },
  async mounted() {
    this.isHydrated = true;
    // focus input
    this.focusFormInput();

    if (this.chatUser) {
      await this.getMessages();

      await this.$store.dispatch('online/unseenMessageCount', {
        user: this.chatUser,
      });
    }
  },
  updated() {
    this.$nextTick(() => this.scrollToEnd());
  },

  methods: {
    // helper to truncate text
    subStrText(str, limit = 20) {
      return str && str.length > limit ? str.substr(0, limit) + '...' : str;
    },
    scrollToEnd() {
      const content = this.$refs.messagesContainer;
      if (content) {
        content.scrollTop = content.scrollHeight;
      }
    },
    isOnline(userId) {
      return !!this.users.find((_) => _.id === userId);
    },
    // close window
    close() {
      this.$store.commit('chat/CHATBOX_CLOSED', this.chatIndex);
    },
    // user selected from search
    userSelected(user) {
      this.$store.commit('chat/USER_UPDATED', { index: this.chatIndex, user });
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
    // add placeholder
    addPlaceholder() {
      this.$refs.formPlaceholder.classList.remove('hidden');
    },
    // clear placeholder
    clearPlaceholder() {
      this.$refs.formPlaceholder.classList.add('hidden');
    },
    // listen input
    listenInput(event) {
      const text = event.target.innerHTML;
      if (text && text !== '\n') {
        this.clearPlaceholder();
      } else {
        this.addPlaceholder();
      }

      // get text
      this.messageText = text;
    },
    // enter new line
    enterLine(event) {
      document.execCommand('insertLineBreak');
      event.preventDefault();
    },
    searchUsers: debounce(async function () {
      this.processing = true;
      try {
        const response = await this.$axios.$get(
          `api/user-search?query=${this.query}`
        );
        this.filteredUsers = response;
        this.processing = false;
      } catch (err) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    }, 500),
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
    // get message
    async getMessages() {
      this.processing = true;
      try {
        const { items, connectionId } = await this.$axios.$get(
          `api/message/${this.chatUser.id}`,
          {
            params: {
              limit: 20,
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
      } else {
        // get cursor position
        const index = this.emojiPosition || this.messageText.length;
        this.messageText = `${this.messageText.slice(0, index)}${
          e.native
        }${this.messageText.slice(index)}`;
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
  },
};
</script>
