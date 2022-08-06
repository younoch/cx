<template>
  <div>
    <ShareNetwork
      network="facebook"
      :url="url"
      :title="title"
      :description="excerpt"
    >
      <v-btn fab x-small dark class="facebook">
        <v-icon>{{ mdiFacebook }}</v-icon>
      </v-btn>
    </ShareNetwork>
    <ShareNetwork
      network="twitter"
      :url="url"
      :title="title"
      :description="excerpt"
    >
      <v-btn fab x-small dark class="twitter mx-1">
        <v-icon>{{ mdiTwitter }}</v-icon>
      </v-btn>
    </ShareNetwork>
    <ShareNetwork
      network="linkedin"
      :url="url"
      :title="title"
      :description="excerpt"
    >
      <v-btn fab x-small dark class="linkedin mx-1">
        <v-icon>{{ mdiLinkedin }}</v-icon>
      </v-btn>
    </ShareNetwork>
    <ShareNetwork
      network="pinterest"
      :url="url"
      :title="title"
      :description="excerpt"
    >
      <v-btn fab x-small dark class="pinterest">
        <v-icon>{{ mdiPinterest }}</v-icon>
      </v-btn>
    </ShareNetwork>
  </div>
</template>

<script>
import { mdiFacebook, mdiTwitter, mdiLinkedin, mdiPinterest } from '@mdi/js';
export default {
  name: 'MapShareButtons',
  props: {
    url: {
      type: String,
      required: true,
      default: '',
    },
    title: {
      type: String,
      required: true,
      default: '',
    },
    excerpt: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      mdiFacebook,
      mdiTwitter,
      mdiLinkedin,
      mdiPinterest,
    };
  },
};
</script>
