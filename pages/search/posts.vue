<template>
  <div id="profile">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="3" class="d-none d-sm-inline-block">
          <div class="w-full sticky-top">
            <ad-card :footer="true" class="mt-2">
              <adsbygoogle ad-slot="6757125591" ad-format="auto" />
            </ad-card>
          </div>
        </v-col>

        <!-- create post section -->
        <v-col cols="12 mt-n2" md="6">
          <div class="mx-auto mt-4">
            <v-card class="rounded-b-0 rounded-t-lg">
              <div class="theme--dark">
                <v-subheader>
                  <h2 class="font-weight-black">Posts</h2>
                </v-subheader>
              </div>
            </v-card>
            <template v-if="loading_post">
              <v-skeleton-loader
                type="list-item-avatar-two-line, actions"
                class="rounded-0 mb-4"
              />
              <v-skeleton-loader
                type="list-item-avatar-two-line,card"
                class="rounded-0"
              />
            </template>
            <div v-for="(post, i) in posts" v-else :key="i">
              <FeedPostCard
                class="rounded-t-0"
                :post="post"
                :index="i"
                @delete-reaction="deleteReaction"
                @update-reaction="updateReaction"
                @comments-count-updated="commentsCountUpdated"
                @toggle-comment-box="toggleCommentBox(post, i)"
                @post-delete="showConfirmDelete"
              />
            </div>

            <!-- <v-divider class="mt-2"></v-divider> -->
            <v-card
              v-if="hasPage && posts.length > 3"
              flat
              @click.prevent="seeMorePosts"
            >
              <h2
                text-color="grey lighten-3"
                class="
                  subtitle-1
                  pt-3
                  text-center
                  font-weight-bold
                  pb-2
                  cursor-pointer
                "
              >
                See more
              </h2>
            </v-card>
          </div>
        </v-col>

        <v-col cols="12" md="3">
          <!-- START MOST POPULAR POSTS -->
          <div class="w-full sticky-top z-index-5 background mt-2">
            <!-- START MOST POPULAR POSTS -->
            <ad-card :footer="true" class="mt-2">
              <adsbygoogle ad-slot="6757125591" ad-format="auto" />
            </ad-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mdiPinOutline, mdiPlus } from '@mdi/js';
export default {
  name: 'SearchUser',
  scrollToTop: true,
  data() {
    return {
      inset: true,
      index: -1,
      current_page: 1,
      loading_post: false,
      loading: false,
      mdiPlus,
      mdiPinOutline,
      posts: [],
      nextPageUrl: '',
      hasPage: true,
    };
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    searchQuery() {
      return this.$route.query.posts;
    },
  },
  mounted() {
    this.getPosts();
  },

  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    async seeMorePosts() {
      setTimeout(() => {
        this.scrollToTop();
        this.loading_post = true;
      }, 700);
      try {
        const { items, nextPageUrl, hasPages } = await this.$axios.$get(
          this.nextPageUrl
        );
        this.posts = items;
        this.nextPageUrl = nextPageUrl;
        this.hasPage = hasPages;
      } catch (e) {
      } finally {
        this.loading_post = false;
      }
    },
    // search posts
    async getPosts() {
      this.loading_post = true;
      try {
        const { items, nextPageUrl, hasPages } = await this.$axios.$get(
          'api/search/posts',
          {
            params: {
              page: 1,
              per_page: 5,
              query: this.searchQuery,
            },
          }
        );
        this.hasPage = hasPages;
        this.posts = items;
        this.nextPageUrl = nextPageUrl;
      } catch (e) {
      } finally {
        this.loading_post = false;
      }
    },
    deleteReaction({ post, i, $event }) {
      const index = post.like.findIndex((_) => _.user_id === $event.user_id);
      if (index > -1) {
        post.likes--;
        post.like.splice(index, 1);
      }

      this.$set(this.posts, i, post);
    },
    // toggle comment box
    toggleCommentBox(post, index) {
      post.showComment = !post.showComment;
      this.$set(this.posts, index, post);
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
  },
};
</script>
