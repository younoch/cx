<script>
import {
  mdiDotsVertical,
  mdiPencilOutline,
  mdiDelete,
  mdiThumbUp,
  mdiClose,
} from '@mdi/js';
import CommentBox from '~/components/comment/Box.vue';
import CommentListItem from '~/components/comment/ListItem.vue';

export default {
  name: 'CommentList',

  components: { CommentBox, CommentListItem },

  props: {
    endpoint: {
      type: String,
      default: 'api/posts/comments',
    },
    postId: {
      type: Number,
      required: true,
      default: 0,
    },
    postUserId: {
      type: Number,
      default: null,
    },
    postIndex: {
      type: Number,
      required: true,
      default: -1,
    },
  },

  data() {
    return {
      items: [],
      nextPageUrl: null,
      hasPages: false,
      perPage: 3,
      deleting: false,
      deleteComment: null,
      isConfirmToDelete: false,
      deleteIndex: null,
      deleteParentIndex: -1,
      nextRepliesPageUrl: undefined,
      mdiDotsVertical,
      mdiPencilOutline,
      mdiDelete,
      mdiThumbUp,
      mdiClose,
    };
  },

  computed: {
    deleteEndpoint() {
      return `${this.endpoint}/delete`;
    },
  },

  async mounted() {
    await this.loadComments();
  },

  methods: {
    // load comments
    async loadComments() {
      try {
        const { items, nextPageUrl, hasPages } = await this.$axios.$get(
          `${this.endpoint}/${this.postId}`
        );
        const length = items.length ? 160 : 40;
        this.$emit('scroll-down-answer',length, false);
        this.items = items;
        this.nextPageUrl = nextPageUrl;
        this.hasPages = hasPages;
      } catch (e) {}
    },
    // load more comments
    async loadMoreComments() {
      try {
        const { items, nextPageUrl, hasPages } = await this.$axios.$get(
          this.nextPageUrl
        );
        this.$emit('scroll-down-answer', 140, false);
        items.forEach((item) => {
          this.items.push(item);
        });
        this.nextPageUrl = nextPageUrl;
        this.hasPages = hasPages;
      } catch (e) {}
    },

    async loadReplies(commentId, commentIndex) {
      try {
        const { items, nextPageUrl } = await this.$axios.$get(
          `${this.endpoint}/sub/${commentId}`
        );
        const comment = this.items.find((_) => _.id === commentId);
        if (comment) {
          const newComment = Object.assign(comment, { subComments: items });
          newComment.hasReplies = nextPageUrl ?? false;
          this.$set(this.items, commentIndex, newComment);
          this.$emit('scroll-down-answer', 140, true);
        }
        this.nextRepliesPageUrl = nextPageUrl;
      } catch (e) {}
    },

    async loadMoreReplies(commentId, commentIndex) {
      try {
        const { items, nextPageUrl } = await this.$axios.$get(
          this.nextRepliesPageUrl
        );
        const comment = this.items.find((_) => _.id === commentId);
        if (comment) {
          const allSubComments = [...this.items[commentIndex].subComments];
          items.forEach((item) => {
            allSubComments.push(item);
          });
          const newComment = Object.assign(comment, {
            subComments: allSubComments,
          });
          newComment.hasReplies = nextPageUrl ?? false;
          this.$set(this.items, commentIndex, newComment);
          this.$emit('scroll-down-answer', 110, true);
        }
        this.nextRepliesPageUrl = nextPageUrl;
      } catch (e) {}
    },
    // comment like updated
    likeUpdated({ commentId, commentIndex, isLiked }) {
      // find the comment
      const comment = this.items.find((_) => _.id === commentId);
      if (comment) {
        comment.isLiked = isLiked;
        isLiked ? comment.likes_count++ : comment.likes_count--;
        this.$set(this.items, commentIndex, comment);
      }
    },
    // reply like updated
    replyLikeUpdated({ replyId, replyIndex, parentId, parentIndex, isLiked }) {
      // find the comment
      const comment = this.items.find((_) => _.id === parentId);
      if (comment) {
        // find the reply
        const reply = comment.subComments.find((_) => _.id === replyId);
        if (reply) {
          reply.isLiked = isLiked;
          isLiked ? reply.likes_count++ : reply.likes_count--;
          this.$set(comment.subComments, replyIndex, reply);
        }
        this.$set(this.items, parentIndex, comment);
      }
    },
    // show reply box
    showReplyBox({ commentId, commentIndex }) {
      // find the comment
      const comment = this.items.find((_) => _.id === commentId);
      if (comment) {
        comment.showReplyBox = !comment.showReplyBox;
        this.$set(this.items, commentIndex, comment);
      }
    },
    // new comment added
    commentAdded(comment) {
      // update comments count
      this.updateCommentCount(1);
      this.items.unshift(comment);
    },
    // new reply added
    replyAdded({ commentId, commentIndex, reply }) {
      // find the comment
      const comment = this.items.find((_) => _.id === commentId);
      if (comment) {
        comment.subComments.push(reply);
        comment.sub_comments_count++;
        this.$set(this.items, commentIndex, comment);
      }
      // update comments count
      this.updateCommentCount(1);
    },

    // select to show confirm delete dialog
    selectTodelete({ comment, index, parentIndex }) {
      this.isConfirmToDelete = true;
      this.deleteIndex = index;
      this.deleteParentIndex = parentIndex;
      this.deleteComment = comment;
    },

    // Delete comment from database and locally
    async deleteConfirm(commentId) {
      this.deleting = true;
      try {
        await this.$axios.$delete(`${this.deleteEndpoint}/${commentId}`);

        // delete from locally
        if (this.deleteParentIndex > -1) {
          this.items[this.deleteParentIndex].subComments.splice(
            this.deleteIndex,
            1
          );
          this.items[this.deleteParentIndex].sub_comments_count--;
          this.updateCommentCount(-1);
        } else {
          // find the comment
          const comment = this.items.findIndex((_) => _.id === commentId);
          if (comment > -1) {
            const removeAbleCount = Number(
              this.items[comment].subComments.length + 1
            );
            this.items.splice(this.deleteIndex, 1);
            this.updateCommentCount(-removeAbleCount);
          }
        }

        this.deleting = false;
        setTimeout(this.setDefaultDeleteData(), 500);
      } catch (e) {}
    },

    updateCommentCount(count) {
      this.$emit('comments-count-updated', {
        postId: this.postId,
        postIndex: this.postIndex,
        count,
      });
    },
    // set default value after deleted comment
    setDefaultDeleteData() {
      this.isConfirmToDelete = false;
      this.deleteIndex = null;
      this.deleteParentIndex = -1;
      this.deleteComment = null;
    },
  },
};
</script>

<template>
  <div>
    <comment-box
      :endpoint="endpoint"
      :post-id="postId"
      class="px-4 pb-3"
      @added="commentAdded"
    />
    <section v-for="(item, index) in items" :key="item.id" class="mb-4">
      <transition name="fade">
        <comment-list-item
          :comment="item"
          :comment-index="index"
          :post-user-id="postUserId"
          :endpoint="endpoint"
          class="px-4"
          @like-updated="likeUpdated"
          @reply-like-updated="replyLikeUpdated"
          @show-reply-box="showReplyBox"
          @reply-added="replyAdded"
          @load-replies="loadReplies"
          @load-more-replies="loadMoreReplies"
          @delete="selectTodelete"
        />
      </transition>
    </section>
    <v-btn
      v-if="nextPageUrl"
      color="greyLight"
      depressed
      small
      class="text-capitalize letter-spacing-normal ml-4 mb-4"
      @click="loadMoreComments"
      >Load more comments</v-btn
    >
    <!-- delete confirmation dialog (It will be use in future) -->
    <v-dialog
      v-if="deleteComment"
      v-model="isConfirmToDelete"
      width="700"
      max-width="700"
    >
      <v-card>
        <v-card-title
          class="
            font-18 font-weight-regular
            justify-space-between
            flex-nowrap
            line-height-24
            word-break-word
          "
        >
          Are you sure you want to delete your comment?
          <v-btn plain icon @click="setDefaultDeleteData"
            ><v-icon>{{ mdiClose }}</v-icon></v-btn
          >
        </v-card-title>
        <v-divider />

        <v-card-text class="pb-0">
          <div class="d-flex my-6">
            <v-avatar
              v-if="deleteComment.user"
              size="40"
              class="mb-4 mr-4"
              color="greyMuted"
            >
              <v-img
                v-if="deleteComment.user.image"
                :src="deleteComment.user.image"
              />
              <span v-else class="white--text text-h6">
                {{ deleteComment.user.name | avatar }}
              </span>
            </v-avatar>
            <div class="flex-grow-1 overflow-hidden">
              <div class="pa-2 rounded-lg rounded-tl-0 greyLight">
                <div class="d-flex justify-space-between align-start">
                  <div v-if="deleteComment.user">
                    <h4>
                      <nuxt-link
                        :to="`/${deleteComment.user.username}`"
                        class="heading--text"
                      >
                        {{ deleteComment.user.name }}
                      </nuxt-link>
                    </h4>
                    <p
                      v-if="deleteComment.user.tagline"
                      class="text-caption mb-3"
                    >
                      {{ deleteComment.user.tagline }}
                    </p>
                  </div>
                  <div>
                    <time class="font-13">{{
                      deleteComment.created_at | humanDateTime
                    }}</time>
                  </div>
                </div>
                <div>
                  <p
                    class="comment-text mb-0 font-14"
                    v-html="deleteComment.content"
                  ></p>
                  <template v-if="deleteComment.meta.length">
                    <v-img
                      v-for="meta in deleteComment.meta"
                      :key="meta.id"
                      :src="meta.data"
                      :title="meta.name"
                      aspect-ratio="1.78"
                      max-width="300"
                      class="rounded-lg mt-1"
                    ></v-img>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <v-divider />
          <p class="font-14 text--text my-3">
            All likes on this comment will also be removed.
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            depressed
            outlined
            rounded
            class="px-4 text-capitalize"
            @click="setDefaultDeleteData"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            rounded
            :disabled="deleting"
            class="px-4 text-capitalize"
            @click="deleteConfirm(deleteComment.id)"
          >
            {{ deleting ? 'Deleting' : 'Delete' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
