<template>
  <div class="width-full height-full">
    <v-img
      v-if="media.type === 'image'"
      height="100%"
      :src="media.data"
      aspect-ratio="1.6"
    />
    <template v-if="media.type === 'document'">
      <div class="player-wrapper">
        <div class="player">
          <iframe
            :src="`https://docs.google.com/viewer?embedded=true&url=${media.data}`"
            class="w-100 h-100"
            frameborder="0"
            allowfullscreen
          >
          </iframe>
        </div>
      </div>
    </template>
    <client-only v-if="media.type === 'video'">
      <video-embed :src="media.data" />
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'MediaCard',
  props: {
    media: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    getFileExtension(filename) {
      const extension = filename.split('.');
      return extension[extension.length - 1];
    },
  },
};
</script>
