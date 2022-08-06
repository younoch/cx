<template>
  <v-skeleton-loader
    v-if="loading"
    transition="fade-transition"
    elevation="2"
    :type="skeletonType"
  />
  <client-only v-else>
    <v-card outlined v-bind="$attrs">
      <v-card-title>{{ title }}</v-card-title>
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
            <v-img
              :src="post.image"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              width="100%"
              height="200"
              max-width="100%"
            >
              <template #placeholder>
                <v-skeleton-loader type="image" />
              </template>
              <v-card-title>
                <h3 class="text-subtitle-2">
                  {{ post.title }}
                </h3>
              </v-card-title>
            </v-img>
          </n-link>
        </slide>
      </carousel>
    </v-card>
  </client-only>
</template>

<script>
export default {
  name: 'ImageCarousel',
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
  },
};
</script>
