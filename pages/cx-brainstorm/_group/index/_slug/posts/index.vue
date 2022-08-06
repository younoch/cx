<script>
export default {
  name: 'BrainstormPost',
  props: {
    sharedGroups: {
      type: Array,
      default: () => [],
    },
    sort: {
      type: String,
      default: 'latest',
    },
  },
  data() {
    return {
      loading: false,
      page: 1,
      lastPage: null,
      posts: [],
    };
  },
  async mounted() {
    await this.getPosts();
  },
  methods: {
    // get posts
    async getPosts() {
      this.loading = true;
      try {
        const { data, meta } = await this.$axios.$get('api/get-posts', {
          params: {
            page: this.page,
            group: this.$route.params.group,
            subgroup: this.$route.params.slug,
            sharedGroups: this.sharedGroups,
            sort: this.sort,
          },
        });
        this.loading = false;
        this.posts = data;
        this.lastPage = meta.last_page;
      } catch (e) {
        this.loading = false;
      }
    },
    // delete post
    async deletePost(postId) {
      try {
        const { message } = await this.$axios.$delete(
          `api/user/post/delete/${postId}`
        );
        await this.getPosts();
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
    // add comment
    addComment({ index, event }) {
      if (event.commentIndex === null) {
        this.posts[index].comments.push(event.comment);
        this.posts[index].comments_count++;
      } else {
        this.posts[index].comments[event.commentIndex].sub_comments.push(
          event.comment
        );
      }
    },
    // update comment data
    updateComment(index, event) {
      if (event.parentIndex === null) {
        this.posts[index].comments[event.index] = event.comment;
      } else {
        this.posts[index].comments[event.parentIndex].sub_comments[
          event.index
        ] = event.comment;
      }
    },
    // delete comment data
    deleteComment(index, event) {
      if (event.parentIndex === null) {
        this.posts[index].comments.splice(event.index, 1);
      } else {
        this.posts[index].comments[event.parentIndex].sub_comments.splice(
          event.index,
          1
        );
      }
    },
    // update post reaction
    updateReaction({ post, i, event }) {
      const index = post.like.findIndex((_) => _.user_id === event.user_id);
      if (index > -1) {
        post.like.splice(index, 1, {
          post_id: event.postId,
          reaction: event.reaction,
          user_id: event.user_id,
        });
      } else {
        post.likes++;
        post.like.push({
          post_id: event.postId,
          reaction: event.reaction,
          user_id: event.user_id,
        });
      }

      this.$set(this.posts, i, post);
    },
    // delete post reaction
    deleteReaction({ post, i, event }) {
      const index = post.like.findIndex((_) => _.user_id === event.user_id);
      if (index > -1) {
        post.likes--;
        post.like.splice(index, 1);
      }

      this.$set(this.posts, i, post);
    },
  },
};
</script>

<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      type="list-item-avatar,card"
      elevation="1"
    />
    <v-fade-transition v-else group>
      <div v-for="(post, i) in posts" :key="`${i}-feed-post`">
        <FeedPostCard
          class="width-full"
          :post="post"
          :index="i"
          @delete-reaction="deleteReaction"
          @update-reaction="updateReaction"
          @add-comment="addComment"
          @update-comment="updateComment"
          @delete-comment="deleteComment"
        />
      </div>
    </v-fade-transition>
  </div>
</template>
