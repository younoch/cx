<template>
  <v-card class="video-upload overflow-hidden">
    <v-card-title class="justify-space-between primary white--text">
      <div>Upload Your Video</div>
      <v-btn icon dark class="ma-0" @click.stop="$emit('close', '')">
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text
      :loading="processing"
      class="post-video__uploader custom-scrollbar"
    >
      <div class="d-flex flex-column justify-center align-center w-100 h-100">
        <b-text
          v-model="processVideo"
          rules="required|url"
          vid="video_link"
          label="Video Link"
          outlined
          autofocus
          class="w-100"
          placeholder="Supported YouTube, Vimeo, DailyMotion, Coub"
          @keydown.enter="savePostVideo"
        />
      </div>
      <div
        v-if="processVideoUrl"
        class="d-flex flex-column justify-center align-center w-100 h-100"
      >
        <v-btn
          icon
          dark
          class="ma-0 remove pink mx-4 my-2"
          @click.stop="removeVideo"
        >
          <v-icon>{{ mdiDelete }}</v-icon>
        </v-btn>
        <client-only>
          <video-embed class="w-100" :src="processVideoUrl" />
        </client-only>
      </div>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn outlined @click.stop="$emit('close', '')"> Cancel </v-btn>
      <v-btn
        :loading="processing"
        class="primary"
        @click.prevent="savePostVideo()"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mdiDelete, mdiCloudUpload, mdiClose } from '@mdi/js';

export default {
  name: 'PostVideoUploader',
  props: {
    postVideo: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    processVideo: '',
    processing: false,
    mdiCloudUpload,
    mdiDelete,
    mdiClose,
  }),
  computed: {
    processVideoUrl() {
      return this.postVideo || this.processVideo;
    },
  },
  methods: {
    savePostVideo() {
      if (this.processVideoUrl) {
        this.processing = true;
        const files = [];
        files.push({
          data: this.processVideo,
          type: 'video',
          name: 'A Video Attachment',
          base64: false,
        });
        this.$emit('save', { files });
        this.$nextTick(() => {
          this.processing = false;
          this.processVideo = '';
        });
      }
    },

    // remove image
    removeVideo() {
      this.processVideo = '';
      this.$emit('remove', '');
    },
  },
};
</script>
