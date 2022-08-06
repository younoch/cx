// Mutations constant
const PUSH_COURSE_INFO = 'PUSH_COURSE_INFO';
const UPDATE_USER_POINT = 'UPDATE_USER_POINT';
const UPDATE_LESSON_STATUS = 'UPDATE_LESSON_STATUS';
const UPDATE_LESSON_BOOKMARK = 'UPDATE_LESSON_BOOKMARK';
const UPDATE_USER_LESSON_STATUS = 'UPDATE_USER_LESSON_STATUS';

const state = () => ({
  course: {},
  units: [],
  passPercentage: 0,
  totalPoints: 0,
  userTotalPoints: 0,
  relatedCourses: [],
  randomCourses: [],
  mostPopularCourses: [],
});

const getters = {
  userPoints(state) {
    return state.userTotalPoints;
  },
  userCompletedLessonsCount(state) {
    let total = 0;
    state.units.forEach(unit => {
      const count = unit.lessons.filter(lesson => {
        return lesson.userProgress.toLowerCase() === 'completed'
      }).length
      total += count
    });
    return total
  },
  totalLessonsCount(state) {
    const count = state.units.reduce((number, unit) => {
      return number + unit.lessons.length;
    }, 0);
    return count;
  },
  getTotalPersentageWithoutScore(state, getters) {
    if (state.course.totalPoints === 0) {
      return getters.totalLessonsCount
        ? Math.ceil(
          (getters.userCompletedLessonsCount / getters.totalLessonsCount) *
          state.passPercentage
        )
        : 0;
    } else {
      return 0;
    }
  },
};

const mutations = {
  [PUSH_COURSE_INFO](state, payload) {
    state.course = payload;
    state.units = payload.units;
    state.passPercentage = payload.passPercentage;
    state.totalPoints = payload.totalPoints;

    let total = 0;
    state.units.map((unit) => {
      unit.lessons.map((item) => {
        total += item.userScore ? item.userScore.score : 0;
        return item;
      });
      return unit;
    });
    state.userTotalPoints = total;
  },

  [UPDATE_USER_POINT](state, payload) {
    state.userTotalPoints = payload;
  },

  [UPDATE_LESSON_STATUS](state, payload) {
    state.units.map((unit) => {
      unit.lessons.map((item) => {
        if (Number(item.id) === Number(payload.course_lesson_id)) {
          item.userProgress = payload.status;
        }
        return item;
      });
      return unit;
    });
  },

  [UPDATE_LESSON_BOOKMARK](state, payload) {
    state.units[payload.unitIndex].lessons.map((item) => {
      if (Number(item.id) === Number(payload.lessonId)) {
        item.isBookmark = !item.isBookmark;
      }
      return item;
    });
  },

  [UPDATE_USER_LESSON_STATUS](state, payload) {
    state.units.map((unit) => {
      unit.lessons.map((item) => {
        if (Number(item.id) === Number(payload.lessonId)) {
          item.userProgress = payload.status;
        }
        return item;
      });
      return unit;
    });
  },
  SET_RELATED_COURSES(state, payload) {
    state.relatedCourses = payload;
  },
  SET_RANDOM_COURSES(state, payload) {
    state.randomCourses = payload;
  },
  SET_MOST_POPULAR_COURSES(state, payload) {
    state.mostPopularCourses = payload;
  },
};

const actions = {
  async getCourseInfo({ commit }, courseId) {
    try {
      const { course } = await this.$axios.$get(
        `api/training/course/${courseId}`
      );
      commit(PUSH_COURSE_INFO, course);
    } catch (e) { }
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
