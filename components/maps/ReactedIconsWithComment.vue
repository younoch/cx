<template>
  <div class="user-reacted-icons">
    <div v-for="(reaction, i) in reactions" :key="i" class="icon">
      <v-img :src="`/reactions/${reaction.type}.png`" width="12" height="12" />
    </div>

    <div v-if="answer.reactions_count > 0">
      &nbsp;{{ answer.reactions_count }}
    </div>
    <div v-if="answer.comments_count > 0 && answer.reactions_count > 0">
      &nbsp;|&nbsp;
    </div>
    <div v-if="answer.comments_count > 0">
      {{ answer.comments_count }} comments
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReactedIconsWithComment',
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
