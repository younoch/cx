<template>
  <div v-if="!loading">
    <v-spacer></v-spacer>
    <v-btn
      v-if="viewCloseIcon"
      class="ma-2"
      text
      small
      absolute
      fab
      right
      @click="previewLink"
    >
      <v-icon size="32" color="primary">
        {{ mdiClose }}
      </v-icon>
    </v-btn>
    <div v-if="response" class="link__preview" v-html="response.html"></div>
  </div>
  <div v-else class="link__previewing-state">
    <p class="mb-0">Previewing...</p>
  </div>
</template>

<script>
import { mdiClose } from '@mdi/js';
export default {
  name: 'LinkPreview',
  auth: false,
  props: {
    apiUrl: {
      type: String,
      default: 'https://preview-link.herokuapp.com/?url=',
    },
    // eslint-disable-next-line vue/require-prop-types
    url: {
      types: [String, Object],
      required: true,
      default: null,
    },
    viewCloseIcon: {
      type: [Number, Boolean],
      required: true,
      default: 1,
    },
  },
  data() {
    return {
      response: null,
      loading: false,
      mdiClose,
      isPreviewLink: 1,
    };
  },

  watch: {
    url(newUrl, oldUrl) {
      if (newUrl && newUrl !== oldUrl) {
        this.loadData(newUrl);
      }
    },
  },

  async mounted() {
    if (this.url) {
      await this.loadData(this.url);
    }
  },
  methods: {
    async loadData(url) {
      this.loading = true;
      try {
        const data = await this.$axios.$get(this.apiUrl + url);
        this.response = data;
        this.loading = false;
      } catch (e) {}
    },
    previewLink() {
      this.isPreviewLink = 0;
      this.$emit('preview-link', this.isPreviewLink);
    },
  },
};
</script>
