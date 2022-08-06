import Vue from 'vue';

// Mutations constant
const PUSH_MAP = 'PUSH_MAP';
const RATE_MAP = 'RATE_MAP';
const RATE_MAP_COUNTS = 'RATE_MAP_COUNTS';
const FOLLOW_MAP = 'FOLLOW_MAP';
const ADD_STEP = 'ADD_STEP';
const UPDATE_STEP = 'UPDATE_STEP';
const DELETE_STEP = 'DELETE_STEP';
const ADD_ANSWER = 'ADD_ANSWER';
const UPDATE_ANSWER = 'UPDATE_ANSWER';
const DELETE_ANSWER = 'DELETE_ANSWER';
const UPDATE_STEP_ORDER = 'UPDATE_STEP_ORDER';
const ADD_REACTION = 'ADD_REACTION';
const UPDATE_REACTION = 'UPDATE_REACTION';
const DELETE_REACTION = 'DELETE_REACTION';
const ADD_COMMENT = 'ADD_COMMENT';
const ADD_COMMENT_REACT = 'ADD_COMMENT_REACT';
const UPDATED_STEPS = 'UPDATED_STEPS';
const UPDATED_ANSWERS = 'UPDATED_ANSWERS';
const UPDATED_COMMENTS = 'UPDATED_COMMENTS';
const SET_ACTIVE_ANSWER = 'SET_ACTIVE_ANSWER';
const PUSH_COPY_MAP = 'PUSH_COPY_MAP';

const state = () => ({
  map: null,
  steps: [],
  activeAnswer: null,
});

const mutations = {
  [UPDATED_STEPS](state, payload) {
    state.steps = payload;
  },
  [UPDATED_ANSWERS](state, payload) {
    Vue.set(state.steps[payload.stepIndex], 'answers', payload.answers);
  },
  [UPDATED_COMMENTS](state, payload) {
    const { stepIndex, postId, postIndex, count } = payload;
    const answer = state.steps[stepIndex].answers.find((_) => _.id === postId);
    if (answer) {
      answer.comments_count = answer.comments_count + count;

      Vue.set(state.steps[stepIndex].answers, postIndex, answer);
    }
  },
  [RATE_MAP](state, payload) {
    state.map.rating = payload;
  },
  [RATE_MAP_COUNTS](state, payload) {
    state.map.ratings_count = payload;
    console.log(payload)
  },
  [FOLLOW_MAP](state, payload) {
    state.map.isFollowing = payload;
  },
  [PUSH_MAP](state, payload) {
    state.map = payload;
    if (payload && payload.steps) {
      state.steps = payload.steps;
    }
  },
  [UPDATE_STEP_ORDER](state, payload) {
    state.steps = payload;
  },
  [ADD_STEP](state, payload) {
    state.steps.push(payload);
  },
  [UPDATE_STEP](state, payload) {
    Vue.set(state.steps, payload.index, payload.step);
  },
  [DELETE_STEP](state, payload) {
    state.steps.splice(payload, 1);
  },
  [ADD_ANSWER](state, payload) {
    state.steps[payload.stepIndex].answers.push(payload.answer);
  },
  [UPDATE_ANSWER](state, payload) {
    Vue.set(
      state.steps[payload.stepIndex].answers,
      payload.answerIndex,
      payload.answer
    );
  },
  [DELETE_ANSWER](state, payload) {
    state.steps[payload.stepIndex].answers.splice(payload.answerIndex, 1);
  },
  [ADD_REACTION](state, payload) {
    state.steps[payload.stepIndex].answers[
      payload.answerIndex
    ].reaction_count.push(payload.reactData);
    state.steps[payload.stepIndex].answers[payload.answerIndex]
      .reactions_count++;

    Vue.set(
      state.steps[payload.stepIndex].answers[payload.answerIndex],
      'reaction',
      {
        answer_id: payload.reactData.answer_id,
        type: payload.reactData.type,
      }
    );
  },
  [UPDATE_REACTION](state, payload) {
    state.steps[payload.stepIndex].answers[
      payload.answerIndex
    ].reaction_count.splice(payload.oldReactIndex, 1, payload.reactData);

    Vue.set(
      state.steps[payload.stepIndex].answers[payload.answerIndex],
      'reaction',
      {
        answer_id: payload.reactData.answer_id,
        type: payload.reactData.type,
      }
    );
  },
  [DELETE_REACTION](state, payload) {
    state.steps[payload.stepIndex].answers[
      payload.answerIndex
    ].reaction_count.splice(payload.reactIndex, 1);
    state.steps[payload.stepIndex].answers[payload.answerIndex]
      .reactions_count--;

    Vue.set(
      state.steps[payload.stepIndex].answers[payload.answerIndex],
      'reaction',
      null
    );
  },
  [ADD_COMMENT](state, payload) {
    if (payload.commentIndex === null) {
      state.steps[payload.stepIndex].answers[payload.answerIndex].comments.push(
        payload.comment
      );

      Vue.set(
        state.steps[payload.stepIndex].answers[payload.answerIndex],
        'comments_count',
        +1
      );
    } else {
      state.steps[payload.stepIndex].answers[payload.answerIndex].comments[
        payload.commentIndex
      ].sub_feedbacks.push(payload.comment);
    }
  },
  [ADD_COMMENT_REACT](state, payload) {
    if (payload.parentIndex !== null) {
      const reply =
        state.steps[payload.stepIndex].answers[payload.answerIndex].comments[
          payload.parentIndex
        ].sub_feedbacks[payload.index];
      reply.isLiked = payload.deleted;
      if (payload.deleted) {
        reply.likes_count--;
      } else {
        reply.likes_count++;
      }

      Vue.set(
        state.steps[payload.stepIndex].answers[payload.answerIndex].comments[
          payload.parentIndex
        ].sub_feedbacks,
        payload.index,
        reply
      );
    } else {
      const comment =
        state.steps[payload.stepIndex].answers[payload.answerIndex].comments[
          payload.index
        ];
      comment.isLiked = payload.deleted;

      if (payload.deleted) {
        comment.likes_count--;
      } else {
        comment.likes_count++;
      }

      Vue.set(
        state.steps[payload.stepIndex].answers[payload.answerIndex].comments,
        payload.index,
        comment
      );
    }
  },
  [SET_ACTIVE_ANSWER](state, payload) {
    state.activeAnswer = payload;
  },
  [PUSH_COPY_MAP](state, payload) {
    if (state.map.id === payload.user_map_id) {
      state.steps.push(payload);
    }
  },
};

const actions = {
  async addStep({ commit, state }, newStep) {
    try {
      const { message, step } = await this.$axios.$post(
        `api/brainstorm/map/steps/add/${state.map.id}`,
        newStep
      );
      commit(ADD_STEP, step);
      commit('CRUD_SUCCESS_NO_ACTION', message, { root: true });
    } catch (err) {
      if (err.response.status === 422) {
        const errors = err.response.data.errors;
        for (const property in errors) {
          commit('APP_NETWORK_ERROR', errors[property][0], { root: true });
        }
      } else {
        commit('APP_NETWORK_ERROR', err.response && err.response.data.message, {
          root: true,
        });
      }
    }
  },
  async updateStep({ commit }, updateStep) {
    try {
      const { message, step } = await this.$axios.$post(
        `api/brainstorm/map/steps/rename/${updateStep.stepId}`,
        updateStep.newStep
      );
      const payload = { step, index: updateStep.index };
      commit(UPDATE_STEP, payload);
      commit('CRUD_SUCCESS_NO_ACTION', message, { root: true });
    } catch (err) {
      commit('APP_NETWORK_ERROR', err.response && err.response.data.message, {
        root: true,
      });
    }
  },
  async deleteStep({ commit, state }, { stepId, index }) {
    try {
      const { message } = await this.$axios.$delete(
        `api/brainstorm/map/steps/remove/${state.map.id}/${stepId}`
      );
      commit(DELETE_STEP, index);
      commit('CRUD_SUCCESS_NO_ACTION', message, { root: true });
    } catch (err) {
      commit('APP_NETWORK_ERROR', err.response && err.response.data.message, {
        root: true,
      });
    }
  },
  async updateStepsOrder({ commit }, { mapId, steps }) {
    try {
      const { message } = await this.$axios.$patch(
        `api/brainstorm/map/steps/reorder/${mapId}`,
        { steps }
      );
      commit(UPDATE_STEP_ORDER, steps);
      commit('CRUD_SUCCESS_NO_ACTION', message, { root: true });
    } catch (err) {
      commit('APP_NETWORK_ERROR', err.response && err.response.data.message, {
        root: true,
      });
    }
  },
  // answers
  async updateAnswersOrder({ commit }, { mapId, stepIndex, answers }) {
    try {
      const { message } = await this.$axios.$patch(
        `api/brainstorm/map/steps/answers/reorder/${mapId}`,
        answers
      );
      commit(UPDATED_ANSWERS, { stepIndex, answers });
      commit('CRUD_SUCCESS_NO_ACTION', message, { root: true });
    } catch (err) {
      commit('APP_NETWORK_ERROR', err.response && err.response.data.message, {
        root: true,
      });
    }
  },
  async addAnswer({ commit }, { newAnswer, stepIndex }) {
    try {
      const { message, answer } = await this.$axios.$post(
        `api/brainstorm/map/steps/answers/add`,
        newAnswer
      );

      commit(ADD_ANSWER, { answer, stepIndex });
      commit(SET_ACTIVE_ANSWER, answer);
      commit('CRUD_SUCCESS_NO_ACTION', message, { root: true });
    } catch (err) {
      commit('APP_NETWORK_ERROR', err.response && err.response.data.message, {
        root: true,
      });
    }
  },
  async updateAnswer(
    { commit },
    { answerId, editAnswer, stepIndex, answerIndex }
  ) {
    try {
      const { message, answer } = await this.$axios.$post(
        `api/brainstorm/map/steps/answers/update/${answerId}`,
        editAnswer
      );

      commit(UPDATE_ANSWER, { answer, stepIndex, answerIndex });
      commit(SET_ACTIVE_ANSWER, answer);
      commit('CRUD_SUCCESS_NO_ACTION', message, { root: true });
    } catch (err) {
      commit('APP_NETWORK_ERROR', err.response && err.response.data.message, {
        root: true,
      });
    }
  },
  async deleteAnswer({ commit }, { answerId, stepIndex, answerIndex }) {
    try {
      const { message } = await this.$axios.$delete(
        `api/brainstorm/map/steps/answers/remove/${answerId}`
      );

      commit(DELETE_ANSWER, { stepIndex, answerIndex });
      commit('CRUD_SUCCESS_NO_ACTION', message, { root: true });
    } catch (err) {
      commit('APP_NETWORK_ERROR', err.response && err.response.data.message, {
        root: true,
      });
    }
  },
};

export default {
  state,
  mutations,
  actions,
};
