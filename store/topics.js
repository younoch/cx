// Mutations constant
const PUSH_TOPIC_LIST = 'PUSH_TOPIC_LIST';
const TOPICS_PAGINATION = 'TOPICS_PAGINATION';

const state = () => ({
  topics: [],
  topicsLength: 5,
});

const mutations = {
 [PUSH_TOPIC_LIST](state, payload) {
     state.topics = payload;
 },
 [TOPICS_PAGINATION](state) {
   const upcomingTotal = state.topicsLength + 5;

   state.topicsLength = state.topics.length === state.topicsLength ? 5
   : upcomingTotal >= state.topics.length ? state.topics.length 
   : state.topicsLength + 5;
 }
};

const actions = {
  async getTopicList({commit}) {
    try {
      const { data } = await this.$axios.$get('api/get-topicList');
      commit(PUSH_TOPIC_LIST, data)
    } catch (e) {}
  },
};

export default {
  state,
  mutations,
  actions,
};
