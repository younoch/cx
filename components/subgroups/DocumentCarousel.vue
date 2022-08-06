<template>
  <v-skeleton-loader
    v-if="loading"
    transition="fade-transition"
    elevation="2"
    :type="skeletonType"
  />
  <client-only v-else>
    <v-card outlined v-bind="$attrs">
      <span  v-if="iconOnly" class="py-2 d-block text-center">
        <v-icon>{{ mdiFileDocument }}</v-icon>
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
            <div class="player-wrapper">
              <div class="player">
                <iframe
                  :src="`https://docs.google.com/viewer?embedded=true&url=${
                    post.data.documents.length > 0
                      ? post.data.documents[0].data
                      : ''
                  }`"
                  style="width: 100%; height: 100%"
                  frameborder="0"
                  allowfullscreen
                />
              </div>
            </div>
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
import { mdiFileDocument } from '@mdi/js';

export default {
  name: 'DocumentCarousel',
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
      mdiFileDocument,
    };
  },
};
</script>
