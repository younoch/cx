<script>
import {
  mdiDotsVertical,
  mdiPencilOutline,
  mdiTrashCanOutline,
  mdiThumbUp,
  mdiThumbUpOutline,
} from '@mdi/js';
import CommentBox from '~/components/comment/Box.vue';
import CommentReplyItem from '~/components/comment/ReplyItem.vue';

export default {
  name: 'CommentListItem',

  components: { CommentBox, CommentReplyItem },

  props: {
    comment: {
      type: Object,
      required: true,
      default: null,
    },
    commentIndex: {
      type: Number,
      required: true,
      default: -1,
    },
    postUserId: {
      type: Number,
      default: null,
    },
    endpoint: {
      type: String,
      default: 'api/posts/comments',
    },
  },

  data() {
    return {
      isEdit: false,
      commentText: '',
      mdiDotsVertical,
      mdiPencilOutline,
      mdiTrashCanOutline,
      mdiThumbUp,
      mdiThumbUpOutline,
    };
  },

  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    likeEndpoint() {
      return `${this.endpoint}/like`;
    },
    updateEndpoint() {
      return `${this.endpoint}/update`;
    },
  },

  methods: {
    loadReplies() {
      this.$emit('load-replies', this.comment.id, this.commentIndex);
    },
    loadMoreReplies() {
      this.$emit('load-more-replies', this.comment.id, this.commentIndex);
    },

    // li, ke comment
    async like() {
      try {
        const { isLiked } = await this.$axios.$post(
          `${this.likeEndpoint}/${this.comment.id}`
        );

        this.$emit('like-updated', {
          commentId: this.comment.id,
          commentIndex: this.commentIndex,
          isLiked,
        });
      } catch (e) {}
    },
    // reply like updated
    replyLikeUpdated(payload) {
      this.$emit('reply-like-updated', payload);
    },
    // show reply box
    showReplyBox() {
      this.$emit('show-reply-box', {
        commentId: this.comment.id,
        commentIndex: this.commentIndex,
      });
    },
    // show parent reply box
    showParentReplyBox({ parentId, parentIndex }) {
      this.$emit('show-reply-box', {
        commentId: parentId,
        commentIndex: parentIndex,
      });
    },
    // added new reply
    replyAdded(reply) {
      this.$emit('reply-added', {
        commentId: this.comment.id,
        commentIndex: this.commentIndex,
        reply,
      });
    },

    // delete comment event listening parent component
    deleteComment(payload) {
      if (payload.reply) {
        this.$emit('delete', {
          comment: payload.comment,
          index: payload.index,
          parentIndex: payload.parentIndex,
        });
      } else {
        this.$emit('delete', {
          comment: payload,
          index: this.commentIndex,
          parentIndex: -1,
        });
      }
    },

    // edit comment event listening parent component
    editComment(comment) {
      this.commentText = comment.content;
      this.isEdit = true;
    },

    // cancel comment event listening parent component
    cancelComment(comment) {
      this.commentText = comment.content;
      this.isEdit = false;
    },

    getTextEmoji(text) {
      const regexExp =
        /(\u00A9|\u00AE|[\u2000-\u3300]|\uD83C[\uD000-\uDFFF]|\uD83D[\uD000-\uDFFF]|\uD83E[\uD000-\uDFFF])/gi;

      const isEmoji = regexExp.test(text);
      if (isEmoji) {
        let modifyText;
        if (text.match(/[a-zA-Z0-9 _-]+/)) {
          modifyText = text.replace(/\p{Emoji}+/gu, (emoji, i) =>
            Number.isInteger(Number(emoji))
              ? `<span>${emoji}</span>`
              : `${this.isHasNumberWithEmoji(emoji)}`
          );
        } else {
          modifyText = `<span class='font-28'>${text}</span>`;
        }
        return modifyText;
      } else {
        return text;
      }
    },
    isHasNumberWithEmoji(str) {
      if (str) {
        let makeText = '';
        str.split('').forEach((item) => {
          makeText += Number.isInteger(Number(item))
            ? `<span>${item}</span>`
            : `<span class='font-14'>${item}</span>`;
        });
        // console.log({ makeText });
        return makeText;
      }

      return str;
    },
    // Update comments
    async updateComment(comment) {
      if (this.commentText) {
        try {
          const formData = new FormData();
          if (this.commentText) {
            formData.append('content', this.commentText);
          }

          await this.$axios.$post(
            `${this.updateEndpoint}/${comment.id}`,
            formData
          );

          comment.content = this.commentText;
          this.isEdit = false;
        } catch (err) {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },
  },
};
</script>

<template>
  <div v-if="comment" class="d-flex">
    <v-avatar v-if="comment.user" size="40" class="my-0 mr-4" color="greyMuted">
      <v-img
        :src="
          comment && comment.user.image
            ? comment.user.image
            : $store.state.defaultProfileImage
        "
      />
    </v-avatar>
    <div class="flex-grow-1 overflow-hidden">
      <div class="pa-2 rounded-lg rounded-tl-0 greyLight">
        <div class="d-flex justify-space-between align-start">
          <div v-if="comment.user">
            <h4 class="comment__user-name">
              <nuxt-link
                :to="`/${comment.user.username}`"
                class="heading--text"
              >
                {{ comment.user.name }}
              </nuxt-link>
            </h4>
            <p v-if="comment.user.tagline" class="text-caption mb-3">
              {{ comment.user.tagline.substring(0, 80) }}
            </p>
          </div>

          <div>
            <time class="font-13">{{
              comment.created_at | humanDateTime
            }}</time>
            <v-menu
              v-if="
                (loggedIn && comment.user.id === user.id) ||
                postUserId === user.id
              "
              transition="slide-x-transition"
              offset-y
              left
              :nudge-width="210"
              :max-width="170"
              :allow-overflow="true"
            >
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon v-on="on">
                    {{ mdiDotsVertical }}
                  </v-icon>
                </v-btn>
              </template>
              <v-card
                class="rounded-lg overflow-hidden"
                flat
                outlined
                elevation="10"
              >
                <v-list dense class="py-0">
                  <v-list-item-group color="primary">
                    <v-list-item
                      v-if="loggedIn && comment.user.id === user.id"
                      @click="editComment(comment)"
                    >
                      <v-list-item-icon class="mr-3">
                        <v-icon size="20">
                          {{ mdiPencilOutline }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="body-2 font-weight-regular">
                          Edit
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="deleteComment(comment)">
                      <v-list-item-icon class="mr-3">
                        <v-icon size="20">
                          {{ mdiTrashCanOutline }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="body-2 font-weight-regular">
                          Delete
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-menu>
          </div>
        </div>
        <div>
          <div
            v-if="!isEdit"
            :contenteditable="false"
            class="comment-text mb-0 font-14 text--text"
            v-html="getTextEmoji(commentText || comment.content)"
          ></div>
          <div
            v-else
            :contenteditable="true"
            class="comment-text mb-0 font-14 custom__edit-input"
            @blur="(e) => (commentText = e.target.innerText)"
            v-html="commentText"
          ></div>
          <!-- edit comment actions -->
          <div v-if="isEdit" class="d-flex mt-3">
            <v-btn
              small
              rounded
              depressed
              class="primary"
              :disabled="commentText.length >= 1250 ? true : false"
              @click.stop="updateComment(comment)"
            >
              Save Changes
            </v-btn>
            <v-btn small text rounded @click="cancelComment(comment)">
              cancel
            </v-btn>
          </div>
          <template v-if="comment.meta.length">
            <v-img
              v-for="meta in comment.meta"
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
      <div class="comment__acionts d-flex align-center">
        <v-btn
          small
          plain
          :class="comment.isLiked ? 'primary--text' : ''"
          class="text-capitalize pr-sm-2"
          @click.stop="like"
        >
          <span class="d-none d-sm-inline-flex"> Like </span>
          <v-icon size="15" right>
            {{ comment.isLiked ? mdiThumbUp : mdiThumbUpOutline }}
          </v-icon>
        </v-btn>
        <span v-if="comment.likes_count > 0" class="text-body-2">
          {{ comment.likes_count }}
        </span>
        <span class="ml-3">|</span>
        <v-btn small plain class="text-capitalize" @click.stop="showReplyBox">
          Reply
        </v-btn>
        <v-btn
          v-if="comment.sub_comments_count"
          small
          plain
          min-width="40"
          class="text-capitalize px-sm-0"
          @click="loadReplies()"
        >
          {{
            comment.sub_comments_count > 1
              ? comment.sub_comments_count + ' Replies'
              : comment.sub_comments_count + ' Reply'
          }}
        </v-btn>
      </div>

      <comment-reply-item
        v-for="(item, index) in comment.subComments"
        :key="item.id"
        class="mt-2"
        :post-user-id="postUserId"
        :endpoint="endpoint"
        :reply="item"
        :reply-index="index"
        :parent-index="commentIndex"
        :like-endpoint="likeEndpoint"
        @delete="deleteComment"
        @show-parent-reply-box="showParentReplyBox"
        @reply-like-updated="replyLikeUpdated"
      />
      <v-btn
      v-if="comment.hasReplies"
        color="greyLight"
        depressed
        small
        class="text-capitalize letter-spacing-normal mt-4 mb-2"
        @click="loadMoreReplies"
      >
        Load more replies
      </v-btn>
      <transition name="fade">
        <comment-box
          v-if="comment.showReplyBox"
          :endpoint="endpoint"
          :reply="true"
          :post-id="comment.post_id"
          :comment-id="comment.id"
          @added="replyAdded"
        />
      </transition>
    </div>
  </div>
</template>
