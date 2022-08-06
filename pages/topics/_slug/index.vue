<template>
  <div>

    <v-skeleton-loader
      v-if="loading_post"
      type="list-item-avatar,card"
      elevation="1"
    />
   
    <v-fade-transition v-else group>
      <div v-for="(post, i) in posts" :key="'topic_' + post.id">
      
        <FeedPostCard
          class="width-full"
          :post="post"
          :index="i"
          :show-another-page="false"
          @delete-reaction="deleteReaction"
          @update-reaction="updateReaction"
          @comments-count-updated="commentsCountUpdated"
          @toggle-comment-box="toggleCommentBox"
          @post-delete="showConfirmDelete"
          @post-details-show="postDetailsShowEvent"
        />
      </div>
    </v-fade-transition>
   
    <Confirm ref="confirm" />
  </div>
</template>

<script>
export default {
  name: 'TopicPosts',
  props: {
    subgroup: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: String,
      default: null,
    },
    sort: {
      type: String,
      default: 'latest',
    },
    type: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      page: 1,
      lastPage: null,
      posts: [],
      loading_post: false,
      current_page: 1,
      last_page: 0,
    };
  },
  watch: {
    async sort() {
      await this.getPosts();
    },
    async type() {
      await this.getPosts();
    },
  },
  async mounted() {
    await this.getPosts();
    this.$vuetify.goTo(0);
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const bottom = document.documentElement.getBoundingClientRect().bottom;
      const height = document.documentElement.clientHeight;

      if (bottom < height + 200) {
        // let's add more data
        if (this.current_page < this.last_page) {
          if (!this.load_more) {
            this.current_page++;
            this.loadMore();
          }
        }
      }
    },
    async loadMore() {
      try {
        const { data } = await this.$axios.$get('api/get-posts', {
          params: {
            page: this.current_page,
            limit: 3,
            group: this.$route.params.slug,
            sharedGroups: this.subgroup,
            sort: this.sort ? this.sort : 'latest',
            type: this.type ? this.type : '',
          },
        });
        data.forEach((item) => this.posts.push(item));
      } catch (e) {}
    },
    async getPosts() {
      this.loading_post = true;
      try {
        const { data, meta } = await this.$axios.$get('api/get-posts', {
          params: {
            page: 1,
            group: this.$route.params.slug,
            sharedGroups: this.subgroup,
            sort: this.sort ? this.sort : 'latest',
            type: this.type ? this.type : '',
          },
        });
        this.loading_post = false;
        this.posts = data;
        this.last_page = meta.last_page;
      } catch (e) {}
    },

    showConfirmDelete(postId) {
      this.$refs.confirm
        .open('Delete', 'Are you sure?', { color: 'red' })
        .then((res) => {
          if (res) {
            this.deletePost(postId);
          }
          return false;
        });
    },

    async deletePost(postId) {
      try {
        const { message } = await this.$axios.$delete(
          `api/user/post/delete/${postId}`
        );
        this.posts = this.posts.filter((item) => {
          return Number(postId) !== Number(item.id);
        });
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
    // toggle comment box
    toggleCommentBox(event) {
      const { showComment, index } = event;
      const post = this.posts[index];
      post.showComment = showComment;
      this.$set(this.posts, index, post);
    },
    // update comments count
    commentsCountUpdated({ postId, postIndex, count }) {
      // find post
      const post = this.posts.find((_) => _.id === postId);
      if (post) {
        post.comments_count = post.comments_count + count;

        this.$set(this.posts, postIndex, post);
      }
    },
    updateReaction({ post, i, $event }) {
      const index = post.like.findIndex((_) => _.user_id === $event.user_id);
      if (index > -1) {
        post.like.splice(index, 1, {
          post_id: $event.postId,
          reaction: $event.reaction,
          user_id: $event.user_id,
        });
      } else {
        post.likes++;
        post.like.push({
          post_id: $event.postId,
          reaction: $event.reaction,
          user_id: $event.user_id,
        });
      }

      this.$set(this.posts, i, post);
    },
    deleteReaction({ post, i, $event }) {
      const index = post.like.findIndex((_) => _.user_id === $event.user_id);
      if (index > -1) {
        post.likes--;
        post.like.splice(index, 1);
      }

      this.$set(this.posts, i, post);
    },
    postDetailsShowEvent(url) {
      this.$router.push(`/topics/${this.$route.params.slug}/post/${url}`);
    },
  },
};
</script>
