<script>
import {
  mdiDotsVertical,
  mdiPencilOutline,
  mdiTrashCanOutline,
  mdiThumbUp,
  mdiThumbUpOutline,
} from '@mdi/js';

export default {
  name: 'CommentReplyItem',

  props: {
    reply: {
      type: Object,
      required: true,
      default: null,
    },
    postUserId: {
      type: Number,
      default: null,
    },
    replyIndex: {
      type: Number,
      required: true,
      default: -1,
    },
    parentIndex: {
      type: Number,
      required: true,
      default: -1,
    },
    endpoint: {
      type: String,
      default: 'api/posts/comments',
    },
  },

  data() {
    return {
      commentText: '',
      isEdit: false,
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
    // like reply
    async like() {
      try {
        const { isLiked } = await this.$axios.$post(
          `${this.likeEndpoint}/${this.reply.id}`
        );
        this.$emit('reply-like-updated', {
          replyId: this.reply.id,
          replyIndex: this.replyIndex,
          parentId: this.reply.parentId,
          parentIndex: this.parentIndex,
          isLiked,
        });
      } catch (e) {}
    },
    // show reply box
    showReplyBox() {
      this.$emit('show-parent-reply-box', {
        parentId: this.reply.parentId,
        parentIndex: this.parentIndex,
      });
    },

    // delete reply event listening parent component
    deleteComment(comment) {
      this.$emit('delete', {
        comment,
        parentIndex: this.parentIndex,
        index: this.replyIndex,
        reply: true,
      });
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
        return makeText;
      }
      return str;
    },
    // update reply
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
  <div v-if="reply" class="d-flex">
    <v-avatar v-if="reply.user" size="40" class="my-0 mr-4" color="greyMuted">
      <v-img
        :src="
          reply && reply.user.image
            ? reply.user.image
            : $store.state.defaultProfileImage
        "
      />
    </v-avatar>
    <div class="flex-grow-1 overflow-hidden">
      <div class="pa-2 rounded-lg rounded-tl-0 greyLight">
        <div class="d-flex justify-space-between align-start">
          <div v-if="reply.user">
            <h4 class="comment__user-name">
              <nuxt-link :to="`/${reply.user.username}`" class="heading--text">
                {{ reply.user.name }}
              </nuxt-link>
            </h4>
            <p v-if="reply.user.tagline" class="text-caption mb-3">
              {{ reply.user.tagline.substring(0, 80) }}
            </p>
          </div>
          <div class="d-flex align-center">
            <time class="font-13">{{ reply.created_at | humanDateTime }}</time>
            <v-menu
              v-if="
                (loggedIn && reply.user.id === user.id) ||
                postUserId === user.id
              "
              transition="slide-x-transition"
              offset-y
              origin="center center"
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
                      v-if="loggedIn && reply.user.id === user.id"
                      @click="editComment(reply)"
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
                    <v-list-item @click="deleteComment(reply)">
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
            v-html="getTextEmoji(commentText || reply.content)"
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
              @click.stop="updateComment(reply)"
            >
              Save Changes
            </v-btn>
            <v-btn small text rounded @click="cancelComment(reply)">
              cancel
            </v-btn>
          </div>
          <template v-if="reply.meta.length">
            <v-img
              v-for="meta in reply.meta"
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
          :class="reply.isLiked ? 'primary--text' : ''"
          class="text-capitalize pr-sm-2"
          @click.stop="like"
        >
          <span class="d-none d-sm-inline-flex"> Like </span>
          <v-icon size="15" right>
            {{ reply.isLiked ? mdiThumbUp : mdiThumbUpOutline }}
          </v-icon>
        </v-btn>
        <span v-if="reply.likes_count > 0" class="text-body-2">
          {{ reply.likes_count }}
        </span>
        <span class="ml-3">|</span>
        <v-btn small plain class="text-capitalize" @click.stop="showReplyBox">
          Reply
        </v-btn>
      </div>
    </div>
  </div>
</template>
