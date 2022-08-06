<template>
  <div class="user-reacted-icons justify-space-between pr-1">
    <div class="d-flex">
      <div v-for="(reaction, i) in reactions" :key="i" class="icon">
        <v-img
          :src="`/reactions/${reaction.reaction}.png`"
          width="12"
          height="12"
        />
      </div>
      <div v-if="post.likes > 0">&nbsp;{{ post.likes }}</div>
    </div>
    <!-- <div v-if="post.comments_count > 0 && post.likes > 0">&nbsp;&nbsp;|&nbsp;</div> -->
    <v-btn
      v-if="post.comments_count > 0"
      plain
      primary
      class="text-lowercase px-1 font-weight-regular comment__show-btn"
      @click="showComments"
    >
      {{ post.comments_count }} comments
    </v-btn>
    <v-btn v-else disabled plain> </v-btn>
  </div>
</template>

<script>
export default {
  name: 'PostReactedIcons',
  props: {
    post: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  computed: {
    reactions() {
      return this.post.like.filter(
        (value, index, self) =>
          self.map((x) => x.reaction).indexOf(value.reaction) === index
      );
    },
  },

  methods: {
    showComments() {
      this.$emit('show-comments');
    },
  },
};
</script>
