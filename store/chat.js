import Vue from 'vue';

const USER_SELECTED = 'USER_SELECTED';
const USER_UPDATED = 'USER_UPDATED';
const CHATBOX_CLOSED = 'CHATBOX_CLOSED';
const USER_SELECTED_IN_MOBILE = 'USER_SELECTED_IN_MOBILE';

const state = () => ({
  singleChatUsers: [],
  selectedUser: null,
});

const mutations = {
  [USER_SELECTED](state, payload) {
    if (!state.singleChatUsers.includes(payload)) {
      state.singleChatUsers.push(payload);
    }
  },
  [CHATBOX_CLOSED](state, index) {
    state.singleChatUsers.splice(index, 1);
  },
  [USER_UPDATED](state, payload) {
    Vue.set(state.singleChatUsers, payload.index, payload.user);
  },
  [USER_SELECTED_IN_MOBILE](state, payload) {
    state.selectedUser = payload;
  },
};

export default {
  state,
  mutations,
};
