/* eslint-disable no-prototype-builtins */
import { format, parseISO } from 'date-fns';
import Vue from 'vue';
// Mutations constant
const JOIN_ONLINE = 'JOIN_ONLINE';
const LEAVE_ONLINE = 'LEAVE_ONLINE';
const ONLINE_USERS = 'ONLINE_USERS';
const PUSH_FRIEND_MESSAGE = 'PUSH_FRIEND_MESSAGE';
const PUSH_CHAT_USERS = 'PUSH_CHAT_USERS';
const PUSH_MESSAGING_CHAT_USERS = 'PUSH_MESSAGING_CHAT_USERS';
const GET_CONNECTION_MESSAGES = 'GET_CONNECTION_MESSAGES';
const PUSH_USER_MESSAGE = 'PUSH_USER_MESSAGE';
const PUSH_UNREAD_MESSAGE = 'PUSH_UNREAD_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';
const INITIAL_ONLINE_USERS = 'INITIAL_ONLINE_USERS';
const ONLINE_USERS_UPDATED = 'ONLINE_USERS_UPDATED';
const ONLINE_USERS_LEAVED = 'ONLINE_USERS_LEAVED';

const state = () => ({
  onlineUsers: [],
  singleChatHistory: {},
  chatUsers: [],
  messagingChatUsers: [],
  loading: false,
  users: [],
  messageCount: 0,
});

const mutations = {
  [INITIAL_ONLINE_USERS](state, payload) {
    state.users = payload;
  },
  [ONLINE_USERS_UPDATED](state, payload) {
    if (!state.users.includes(payload)) {
      state.users.push(payload);
    }
  },
  [ONLINE_USERS_LEAVED](state, payload) {
    const index = state.users.findIndex((user) => user.id === payload.id);
    state.users.splice(index, 1);
  },
  [ONLINE_USERS](state, payload) {
    state.onlineUsers = payload;
  },
  [JOIN_ONLINE](state, payload) {
    if (!state.onlineUsers.includes(payload)) {
      state.onlineUsers.push(payload);
    }
  },
  [LEAVE_ONLINE](state, payload) {
    const leftUserIndex = state.onlineUsers.indexOf(payload);
    state.onlineUsers.splice(leftUserIndex, 1);
  },
  [PUSH_CHAT_USERS](state, payload) {
    state.chatUsers = payload;
  },
  [PUSH_MESSAGING_CHAT_USERS](state, payload) {
    state.messagingChatUsers = payload;
  },
  [GET_CONNECTION_MESSAGES](state, payload) {
    const { connectionId } = payload;
    if (state.singleChatHistory[connectionId] !== undefined) {
      state.singleChatHistory[connectionId] = {
        chatHistory: payload.messages,
        user: payload.user,
        unreadCount: 0,
      };
    } else {
      Vue.set(state.singleChatHistory, connectionId, {
        chatHistory: payload.messages,
        user: payload.user,
        unreadCount: 0,
      });
    }
  },
  // To push new connection messages
  [PUSH_FRIEND_MESSAGE](state, payload) {

    const index = state.chatUsers.findIndex(
      (chatUser) => chatUser.senderId === payload.sender_id
    );

    if (index > -1) {
      const chatUser = state.chatUsers[index];
      state.chatUsers.splice(index, 1);
      if (!state.chatUsers.includes(chatUser)) {
        state.chatUsers.unshift(chatUser);
      }
    }
    
    const { connectionId } = payload;

    const date = format(parseISO(payload.created_at), 'yyyy-MM-dd');
    if (state.singleChatHistory[connectionId] !== undefined) {
      if (
        state.singleChatHistory[connectionId].chatHistory[date] !== undefined
      ) {
        if (!state.singleChatHistory[connectionId].chatHistory[date].includes(payload)) {
          state.singleChatHistory[connectionId].chatHistory[date].push(payload);
          if (state.messageCount < 0) {
            state.messageCount = 0;
            state.messageCount += 1;
          } else {
            state.messageCount += 1;
          }
        }
      } else {
        state.singleChatHistory[connectionId].chatHistory[date] = [payload];
      }
    } else {
      const unseen = 0;
      let senderUser;
      state.users.forEach((user) => {
        if (user.id === payload.sender_id) {
          senderUser = user;
        }
      });
      const newMsg = {
        connectionId,
        senderId: payload.sender_id,
        unseen,
        user: senderUser,
        payload,
      };

      if (index === -1) {
        state.chatUsers.unshift(newMsg);
      } else {
        state.chatUsers[index].message = payload;
      }
    }
    state.chatUsers.forEach((chatUser) => {
      if (chatUser.senderId === payload.sender_id) {
        chatUser.message = payload;
        chatUser.unseen++;
      }
    });
  },
  // Push user messages to sender
  [PUSH_USER_MESSAGE](state, payload) {
    const { connectionId } = payload;
    const date = format(parseISO(payload.message.created_at), 'yyyy-MM-dd');
    if (state.singleChatHistory[connectionId] !== undefined) {
      if (
        state.singleChatHistory[connectionId].chatHistory[date] !== undefined
      ) {
          state.singleChatHistory[connectionId].chatHistory[date].push(
            payload.message
          );
      } else {
        state.singleChatHistory[connectionId].chatHistory[date] = [
          payload.message,
        ];
      }
    }

    // Re-arranging chatusers
    const index = state.chatUsers.findIndex(
      (chatUser) => chatUser.senderId === payload.recipientId
    );

    if (index > -1) {
      const chatUser = state.chatUsers[index];

      state.chatUsers.splice(index, 1);
      state.chatUsers.unshift(chatUser);
    }

    state.chatUsers.forEach((chatUser) => {
      if (chatUser.senderId === payload.recipientId) {
        chatUser.message = payload.message;
        chatUser.unseen = 0;
      }
    });
  },
  [PUSH_UNREAD_MESSAGE](state, user) {
    state.chatUsers.forEach((chatUser) => {
      if (chatUser.senderId === user?.id) {
        chatUser.unseen = 0;
      }
    });
  },
  [DELETE_MESSAGE](state, payload) {
    const { idx, index, connectionId } = payload;
    if (state.singleChatHistory[connectionId] !== undefined) {
      if (
        state.singleChatHistory[connectionId].chatHistory[index] !== undefined
      ) {
        state.singleChatHistory[connectionId].chatHistory[index].splice(idx, 1);
      }
    }
  },
  updateMessageCounter(state) {
    state.messageCount = 0;
  },
  decreaseMessageCounter(state, payload) {
    if (payload === null) {
      state.messageCount = 0;
    } else {
      state.messageCount -= Math.abs(payload) ;
    }
  }
};

const actions = {
  // check whose online
  async joinOnline({ commit }) {
    await this.$echo
      .join('online')
      .here((users) => commit(INITIAL_ONLINE_USERS, users))
      .joining((user) => commit(ONLINE_USERS_UPDATED, user))
      .leaving((user) => commit(ONLINE_USERS_LEAVED, user));
  },
  // join into channel after accept connection
  async joinChatRoom({ commit }, { userId }) {
    try {
      // check if connected
      const { data } = await this.$axios.$get('api/connection/id/' + userId);
      await this.$echo
        .join(`connection_${data}`)
        .here((users) => {
          commit(ONLINE_USERS, users);
        })
        .joining((user) => {
          commit(JOIN_ONLINE, user);
        })
        .leaving((user) => {
          commit(LEAVE_ONLINE, user);
        })
        .listen('NewMessage', ({ message }) => {
          commit(PUSH_FRIEND_MESSAGE, message);
        });
    } catch (e) {
      // commit(
      //   'APP_NETWORK_ERROR',
      //   'Sorry, unable to join in chat room, please try again later', {root: true,}
      // );
    }
  },
  // To get all chat users list
  async getChatUsers({ commit }) {
    const chatConnections = [];

    try {
      const { data } = await this.$axios.$get('api/message');
      data.forEach(({ user, message, unseen, connectionId }) => {
        chatConnections.push({
          connectionId,
          senderId: user.id,
          unseen,
          user,
          message,
        });
      });
    } catch (e) {}

    commit(PUSH_CHAT_USERS, chatConnections);
    commit(PUSH_MESSAGING_CHAT_USERS, chatConnections);
  },
  // Show chatUser conversations
  unseenMessageCount({ commit }, { user }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(`api/message/read/${user?.id}`)
        .then(() => {
          commit(PUSH_UNREAD_MESSAGE, user);
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  // Show chatUser conversations
  async searchMessages({ commit }, query) {
    try {
      const { data } = await this.$axios.$get(
        `api/message/search?query=${query}`
      );
      commit(PUSH_CHAT_USERS, data);
    } catch (e) {}
  },
  async searchMessagesToMessaging({ commit }, query) {
    try {
      const { data } = await this.$axios.$get(
        `api/message/search?query=${query}`
      );
      commit(PUSH_MESSAGING_CHAT_USERS, data);
    } catch (e) {}
  },

};

export default {
  state,
  mutations,
  actions,
};
