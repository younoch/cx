<template>
  <div class="user-reacted-icons">
    <div
      v-for="(reaction, reactionInx) in reactions"
      :key="reactionInx"
      class="icon"
    >
      <v-img :src="`/reactions/${reaction.type}.png`" width="12" height="12" />
    </div>
    <div v-if="answer.reactions_count > 0">
      &nbsp;{{ answer.reactions_count }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserReactedIcons',
  props: {
    answer: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  computed: {
    reactions() {
      return this.answer.reaction_count.filter(
        (value, index, self) =>
          self.map((x) => x.type).indexOf(value.type) === index
      );
    },
  },
};
</script>
