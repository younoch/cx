const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
const CRUD_SUCCESS = 'CRUD_SUCCESS';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
const CRUD_SUCCESS_DIALOG = 'CRUD_SUCCESS_DIALOG';
const CRUD_SUCCESS_NO_ACTION = 'CRUD_SUCCESS_NO_ACTION';
const APP_NETWORK_ERROR = 'APP_NETWORK_ERROR';
const APP_INFO = 'APP_INFO';
const APP_WARNING = 'APP_WARNING';
const GET_COMMON_SETTINGS = 'GET_COMMON_SETTINGS';

const state = () => ({
  snackbar: {
    show: false,
    message: null,
    color: null,
    timeout: 3000,
  },
  settings: {
    site_name: 'CXBrainstorm',
    footer_text: 'CXBrainstorm.',
    password_edit_enabled: true,
    logo: `/logo-light.svg`,
    small_logo: `/logo-small.png`,
    favicon: `/favicon.ico`,
  },
  collections: [],
  defaultProfileImage: "/deafult-pro-pic.png"
});

const mutations = {
  [GET_COMMON_SETTINGS](state, payload) {
    state.settings = payload;
    if (payload.favicon === 'null') {
      state.settings.favicon = `/favicon.ico`;
    }
    if (payload.logo === 'null') {
      state.settings.logo = `/logo-light.svg`;
    }
    if (payload.small_logo === 'null') {
      state.settings.small_logo = `/logo-small.png`;
    }
  },
  [CLOSE_SNACKBAR](state) {
    state.snackbar = {
      show: false,
      message: null,
      color: null,
      timeout: -1,
    };
  },
  [APP_NETWORK_ERROR](state, payload) {
    state.snackbar = {
      show: true,
      message: payload,
      color: 'error',
      timeout: -1,
    };
  },
  [LOGIN_SUCCESS](state, payload) {
    state.snackbar = {
      show: true,
      message: payload,
      color: 'success',
      timeout: 1000,
    };
  },
  [APP_NETWORK_ERROR](state, payload) {
    state.snackbar = {
      show: true,
      message: payload,
      color: 'error',
      timeout: -1,
    };
  },
  [APP_INFO](state, payload) {
    state.snackbar = {
      show: true,
      message: payload,
      color: 'info',
      timeout: 5000,
    };
  },
  [APP_NETWORK_ERROR](state, payload) {
    state.snackbar = {
      show: true,
      message: payload,
      color: 'error',
      timeout: -1,
    };
  },
  [APP_WARNING](state, payload) {
    state.snackbar = {
      show: true,
      message: payload,
      color: 'warning',
      timeout: 5000,
    };
  },
  [LOGOUT_SUCCESS](state, payload) {
    state.snackbar = {
      show: true,
      message: payload,
      color: 'success',
      timeout: 1000,
    };
  },
  [CRUD_SUCCESS](state, payload) {
    state.snackbar = {
      show: true,
      message: payload.message,
      color: 'success',
      timeout: 3000,
    };
    setTimeout(() => {
      this.$router.push(payload.path);
    }, 1500);
  },
  [CRUD_SUCCESS_DIALOG](state, payload) {
    state.snackbar = {
      show: true,
      message: payload,
      color: 'success',
      timeout: 3000,
    };
  },
  [CRUD_SUCCESS_NO_ACTION](state, payload) {
    state.snackbar = {
      show: true,
      message: payload,
      color: 'success',
      timeout: 3000,
    };
  },
};

const actions = {
  // get common settings
  async get_common_settings({ commit }) {
    try {
      const { data } = await this.$axios.$get(`api/common-settings`);
      commit(GET_COMMON_SETTINGS, data);
    } catch (e) {}
  },
  crud_success_dialog({ commit }, payload) {
    commit(CRUD_SUCCESS_DIALOG, payload);
    setTimeout(() => {
      commit(CLOSE_SNACKBAR);
    }, 3000);
  },
  login_success({ commit }, payload) {
    commit(LOGIN_SUCCESS, payload);
    setTimeout(() => {
      commit(CLOSE_SNACKBAR);
    }, 1000);
    setTimeout(() => {
      this.$router.replace('/');
    }, 1500);
  },
  logout_success({ commit }, payload) {
    commit(LOGOUT_SUCCESS, payload);
    setTimeout(() => {
      commit(CLOSE_SNACKBAR);
    }, 1000);
    setTimeout(() => {
      this.$router.replace('/auth/login');
    }, 1500);
  },
  crud_success({ commit }, payload) {
    commit(CRUD_SUCCESS, payload);
    setTimeout(() => {
      commit(CLOSE_SNACKBAR);
    }, 3000);
  },
};

export default {
  state,
  mutations,
  actions,
};
