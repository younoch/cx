<template>
  <v-dialog v-model="isOpen" max-width="500" :scrollable="false">
    <v-card v-if="meta">
      <v-card-title class="justify-space-between primary white--text">
        <div>Adjust your cover position!</div>
        <v-btn icon dark class="ma-0" @click.stop="$emit('closeCoverModal')">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-0" :loading="processing">
        <v-img :src="null" aspect-ratio="1.78">
          <template #placeholder>
            <v-skeleton-loader type="image" />
          </template>
          <img
            id="coverimage"
            ref="coverimage"
            :src="meta.data"
            style="max-width: 100%"
          />
        </v-img>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn outlined @click.stop="$emit('closeCoverModal')"> Cancel </v-btn>
        <v-btn class="secondary" @click.stop="resetCropper()"> Reset </v-btn>
        <v-btn
          :loading="processing"
          class="primary"
          @click.prevent="updateAnswerCover(meta.id)"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Cropper from 'cropperjs';
import { mdiClose } from '@mdi/js';

export default {
  props: {
    meta: {
      type: Object,
      required: true,
      default: () => {
        return {
          id: Number,
          type: String,
          name: String,
          data: String,
          answer_id: Number,
          created_at: Date,
          updated_at: Date,
        };
      },
    },
    answerId: {
      type: Number,
      required: true,
      default: 0,
    },
    open: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data() {
    return {
      processing: false,

      // Icons
      mdiClose,
    };
  },
  computed: {
    isOpen() {
      return this.open;
    },
  },
  methods: {
    openCropper() {
      // eslint-disable-next-line no-new
      new Cropper(this.$refs.coverimage, {
        aspectRatio: 1.6,
      });
    },
    resetCropper() {
      this.$refs.coverimage.cropper.reset();
    },
    async updateAnswerCover() {
      this.processing = true;

      try {
        await this.$refs.coverimage.cropper
          .getCroppedCanvas()
          .toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('type', 'image');
            formData.append('metaId', this.meta.id);
            formData.append('image', blob, `answer_cover_${this.answerId}.png`);
            const { message, cover } = await this.$axios.$post(
              `api/brainstorm/map/steps/answers/cover/${this.answerId}`,
              formData
            );
            this.$emit('update', {
              type: this.meta.type,
              cover,
              metaAttachmentId: this.meta.id,
            });
            this.$emit('closeCoverModal');
            this.processing = false;
            this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
          });
      } catch (err) {
        this.processing = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
  },
};
</script>
