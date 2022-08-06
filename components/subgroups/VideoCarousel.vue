<template>
  <v-skeleton-loader
    v-if="loading"
    transition="fade-transition"
    elevation="2"
    :type="skeletonType"
  />
  <client-only v-else>
    <v-card outlined v-bind="$attrs">
      <span v-if="iconOnly" class="py-2 d-block text-center">
        <v-icon>{{ mdiVideo }}</v-icon>
      </span>
      <v-card-title v-else>{{ title }}</v-card-title>
      <v-divider />
      <carousel
        :per-page="1"
        :pagination-enabled="false"
        :loop="true"
        :autoplay="autoPlay"
        :autoplay-timeout="autoPlayTimeout"
      >
        <slide v-for="(post, i) in posts" :key="i">
          <n-link :to="`${url}/${post.slug}`">
            <client-only>
              <video-embed :src="post.data.videos[0].data" />
            </client-only>
            <v-card-title class="carousel-b-title">
              <h3 class="text-subtitle-2">
                {{ post.title }}
              </h3>
            </v-card-title>
          </n-link>
        </slide>
      </carousel>
    </v-card>
  </client-only>
</template>

<script>
import { mdiVideo } from '@mdi/js';

export default {
  name: 'VideoCarousel',
  props: {
    title: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    skeletonType: {
      type: String,
      default: 'image',
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    autoPlayTimeout: {
      type: Number,
      default: 5000,
    },
    posts: {
      type: Array,
      required: true,
    },
    url: {
      type: String,
      default: '/posts',
    },
    iconOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdiVideo,
    };
  },
};
</script>
