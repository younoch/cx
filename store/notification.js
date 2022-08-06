import { format } from 'date-fns';

const SET_LOADING = 'SET_LOADING';
const POST_NOTIFICATIONS = 'POST_NOTIFICATIONS';
const PUSH_POST_NOTIFICATION = 'PUSH_POST_NOTIFICATION';
const MARK_POST_NOTIFICATION_READ = 'MARK_POST_NOTIFICATION_READ';
const REMOVE_POST_NOTIFICATION = 'REMOVE_POST_NOTIFICATION';
const UNREAD_NOTIFICATIONS_COUNT = 'UNREAD_NOTIFICATIONS_COUNT';
const SET_MAP_STAP = 'SET_MAP_STAP';

const state = () => ({
  notifications: [],
  loading: false,
  copyMapStap: {},
});

const getters = {
  unreadNotifications: ({ notifications }) =>
    notifications.filter((notification) => !notification.read_at),
  unreadCount: ({ notifications }) => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read_at
    );
    return unreadNotifications.length;
  },
};

const mutations = {
  [SET_LOADING](state, payload) {
    state.loading = payload;
  },
  [PUSH_POST_NOTIFICATION](state, payload) {
    state.notifications.splice(0, 0, payload);
  },
  [REMOVE_POST_NOTIFICATION](state, payload) {
    const notification = state.notifications.find(
      (notification) => notification.id === payload
    );
    state.notifications.splice(state.notifications.indexOf(notification), 1);
  },
  [MARK_POST_NOTIFICATION_READ](state, payload) {
    const notification = state.notifications.find(
      (notification) => notification.id === payload
    );
    state.notifications[state.notifications.indexOf(notification)].read_at =
      format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  },
  [POST_NOTIFICATIONS](state, payload) {
    state.notifications = payload;
  },
  [UNREAD_NOTIFICATIONS_COUNT](state, payload) {
    state.unread_count = payload;
  },
  [SET_MAP_STAP](state, payload) {
    state.copyMapStap = payload;
  },
};

const actions = {
  async joinToChannel({ commit, dispatch }, userId) {
    try {
      await this.$echo
        .private(`App.Models.User.${userId}`)
        .notification((notification) => {
          // check for connection accept
          if (
            notification &&
            notification.type === 'App\\Notifications\\ConnectionAccepted'
          ) {
            const user = notification.data.user;
            dispatch(
              'online/joinChatRoom',
              {
                userId: user.id,
              },
              { root: true }
            );
          }
          // for map stap change
          if (
            notification &&
            notification.type === 'App\\Notifications\\UserMapCopy'
          ) {
            commit(SET_MAP_STAP, notification.newStep);
          }
          commit(PUSH_POST_NOTIFICATION, notification);
        });
    } catch (e) {}
  },
  async getNotifications({ commit }) {
    commit(SET_LOADING, true);
    try {
      const { data } = await this.$axios.$get('api/notification');
      commit(POST_NOTIFICATIONS, data);
      // commit(UNREAD_NOTIFICATIONS_COUNT, data);

      commit(SET_LOADING, false);
    } catch (error) {}
  },
  // Go to the post page
  followNotification({ state, commit }, { id, data, type }) {
    commit(SET_LOADING, true);
    try {
      // don't mark as read of course
      if (type === 'App\\Notifications\\Training\\CourseAssigned') {
        this.$router.push('/courses/' + data.course.id);
      } else {
        // Mark as read
        this.$axios.$get(`api/notification/mark-as-read/${id}`);
        commit(MARK_POST_NOTIFICATION_READ, id);
        commit(SET_LOADING, false);

        this.$router.push(data.link);
      }
    } catch (err) {
      commit(SET_LOADING, false);
      // commit('APP_NETWORK_ERROR', err.response && err.response.data.message);
    }
  },
  markAsRead({ state, commit }, id) {
    try {
      return new Promise((resolve, reject) => {
        // Mark as read
        this.$axios.$get(`api/notification/mark-as-read/${id}`);
        commit(MARK_POST_NOTIFICATION_READ, id);
        resolve('/notification-link');
        // resolve(state.notifications.find((item) => item.id === id).link);
      });
    } catch (err) {
      commit(SET_LOADING, false);
      commit('APP_NETWORK_ERROR', err.response && err.response.data.message);
    }
  },
  async deleteNotification({ commit }, id) {
    commit(SET_LOADING, true);
    try {
      await this.$axios.$delete(`api/notification/delete/${id}`);
      commit(REMOVE_POST_NOTIFICATION, id);
      commit(SET_LOADING, false);
    } catch (err) {
      commit(SET_LOADING, false);
      commit('APP_NETWORK_ERROR', err.response && err.response.data.message);
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
