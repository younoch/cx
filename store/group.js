import Vue from 'vue';

const UPDATED_TAXONOMY_LIST = 'UPDATED_TAXONOMY_LIST';
const SET_LOADING = 'SET_LOADING';
const CLOSE_POPUP = 'CLOSE_POPUP';

const state = () => ({
  groups: [],
  loading: false,
});

const mutations = {
  [SET_LOADING](state, payload) {
    state.loading = payload;
  },
  [UPDATED_TAXONOMY_LIST](state, payload) {
    // get hidden courses ids
    const hiddenCourses = this.$cookies.get('hidden-courses');
    payload.forEach((item) => {
      if (hiddenCourses) {
        item.show = !hiddenCourses.includes(item.course_id);
      } else {
        item.show = true;
      }
    });
    state.groups = payload;
  },
  [CLOSE_POPUP](state, payload) {
    const index = state.groups.findIndex((item) => item.id === payload.id);
    payload.show = false;
    // set in cookie
    let hiddenCourses = this.$cookies.get('hidden-courses');
    if (hiddenCourses) {
      if (!hiddenCourses.includes(payload.course_id)) {
        hiddenCourses.push(payload.course_id);
      }
    } else {
      hiddenCourses = [payload.course_id];
    }
    this.$cookies.set('hidden-courses', hiddenCourses, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    Vue.set(state.groups, index, payload);
  },
};

const actions = {
  async getListGroups({ commit }) {
    commit(SET_LOADING, true);
    try {
      const { data } = await this.$axios.$get('api/get-groupList');
      commit(SET_LOADING, false);
      commit(UPDATED_TAXONOMY_LIST, data);
    } catch (e) {}
  },
  async markAsClose({ commit }, payload) {
    try {
      await this.$axios.$get(
        `api/training/course-mark-as-close/${payload.course_id}`
      );
      commit(CLOSE_POPUP, payload);
    } catch (e) {}
  },
};

export default {
  state,
  mutations,
  actions,
};
