<script>
import { mdiEmoticonHappyOutline, mdiImageOutline, mdiDelete } from '@mdi/js';

export default {
  name: 'CommentBox',

  props: {
    reply: {
      type: Boolean,
      default: false,
    },
    endpoint: {
      type: String,
      default: 'api/posts/comments',
    },
    postId: {
      type: Number,
      required: true,
      default: 0,
    },
    commentId: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      comment: '',
      file: null,
      attachment: null,
      isEmojiPannel: false,
      error: false,
      commentLength: 0,
      mdiEmoticonHappyOutline,
      mdiImageOutline,
      mdiDelete,
      processing: false,
    };
  },

  computed: {
    user() {
      return this.$auth.user;
    },
    placeholder() {
      return this.reply ? 'Write a reply...' : 'Write a comment...';
    },
    submitBtnText() {
      return this.reply ? 'Reply' : 'Post';
    },
    storeEndpoint() {
      return `${this.endpoint}/add`;
    },
    updateEndpoint() {
      return `${this.endpoint}/update`;
    },
  },

  methods: {
    // enter new line
    enterLine() {
      this.comment = `${this.comment}\n`;
    },
    // add attachments
    addAttachment(event) {
      const file = event.target.files[0];
      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.attachment = URL.createObjectURL(file);
      };
      event.target.value = null;
    },
    onPasteImage(event) {
      const allItems = (
        event.clipboardData || event.originalEvent.clipboardData
      ).items;
      for (const index in allItems) {
        const item = allItems[index];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          this.file = file;
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.attachment = URL.createObjectURL(file);
          };
        }
      }
    },
    // remove attachment
    removeAttachment() {
      this.file = null;
      this.attachment = null;
    },
    // clear comment box
    clear() {
      this.comment = '';
      this.removeAttachment();
    },
    // focus input
    focusFormInput() {
      this.$refs.commentBox.$refs.input && this.$refs.commentBox.$refs.input.focus();
    },
    addEmoji(e) {
      if (!e) {
        return false;
      }
      if (!this.comment) {
        this.comment = e.native;
      } else {
        // get cursor position
        const index = this.$refs.commentBox.$refs.input.selectionStart || this.comment.length;
        this.comment = `${this.comment.slice(0, index)}${
          e.native
        }${this.comment.slice(index)}`;
      }
      this.focusFormInput();
    },
    // save comment into server
    async save() {
      this.processing = true;
      if (this.comment || this.file) {
        try {
          const formData = new FormData();
          if (this.comment) {
            formData.append('content', this.comment);
          }
          if (this.file) {
            formData.append('image', this.file);
          }
          if (this.reply) {
            formData.append('parent_id', this.commentId);
          }
          const { comment } = await this.$axios.$post(
            `${this.storeEndpoint}/${this.postId}`,
            formData
          );
          this.clear();

          // emit added event
          this.$emit('added', comment);
        } catch (err) {
          if (err.response.status === 422) {
            this.$store.commit(
              'APP_NETWORK_ERROR',
              err.response.data.errors.image[0]
            );
          } else {
            this.$store.commit(
              'APP_NETWORK_ERROR',
              err.response && err.response.data.message
            );
          }
        }
      }
      this.processing = false;
    },
  },
};
</script>

<template>
  <div class="d-flex">
    <v-avatar size="40" class="my-4 mr-4" color="greyMuted">
      <v-img :src="user && user.image? user.image : $store.state.defaultProfileImage" />
    </v-avatar>
    <div class="flex-grow-1 mt-4">
      <div>
        <v-textarea
          ref="commentBox"
          v-model="comment"
          :disabled="processing"
          outlined
          rounded
          dense
          rows="1"
          auto-grow
          hide-spin-buttons
          :placeholder="placeholder"
          class="font-14 comment_textarea"
          :counter="1250"
          @keydown.enter.exact.prevent
          @keyup.enter.exact="save"
          @keydown.native.enter.shift.exact="enterLine"
        >
          <template #append>
            <v-menu
              :max-width="300"
              :allow-overflow="true"
              :close-on-click="true"
              :close-on-content-click="false"
              top
              left
              offset-y
              offset-x
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  height="25"
                  class="mr-1"
                  width="25"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon size="24">{{ mdiEmoticonHappyOutline }}</v-icon>
                </v-btn>
              </template>
              <picker
                set="native"
                :native="true"
                title="Pick your emoji.."
                @select="addEmoji"
              />
            </v-menu>
            <v-btn
              icon
              height="25"
              class="mr-1"
              width="25"
              @click.stop="$refs.image.click()"
            >
              <v-icon size="24">{{ mdiImageOutline }}</v-icon>
            </v-btn>
          </template>
        </v-textarea>
      </div>
      <div v-if="comment.length || attachment">
        <v-btn
          small
          rounded
          class="primary"
          :disabled="processing || comment.length >= 1250 ? true : false"
          @click.stop="save"
        >
          {{ submitBtnText }}
        </v-btn>
        <v-btn small text rounded @click="clear"> cancel </v-btn>
      </div>
      <div v-if="file" class="selected-img">
        <v-img :src="attachment" class="rounded-lg" aspect-ratio="1.78">
          <v-btn
            icon
            dark
            right
            absolute
            fab
            x-small
            class="pink mt-4"
            @click.stop="removeAttachment"
          >
            <v-icon>{{ mdiDelete }}</v-icon>
          </v-btn>
        </v-img>
      </div>
    </div>
    <input
      ref="image"
      type="file"
      name="image"
      class="d-none"
      accept="image/*"
      @change="addAttachment($event)"
    />
  </div>
</template>
