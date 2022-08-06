<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      transition="fade-transition"
      elevation="2"
      :type="skeletonType"
    />
    <client-only v-else>
      <v-card outlined v-bind="$attrs" class="rounded-lg overflow-hidden">
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
                :aspect-ratio="ratio"
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
    <div v-if="footer" class="pt-3 font-12 line-height-24 text-center">
      <div class="d-flex justify-center flex-wrap">
        <nuxt-link
          v-for="link in footerLinks"
          :key="link.id"
          class="px-1 text--text link-hover text-no-wrap"
          :to="link.url"
          >{{ link.label }}</nuxt-link
        >
      </div>
      <p class="px-1 py-2">
        Copyright © {{ new Date().getFullYear() }}-
        <a style="color: #0a66c2"> OMNIXCO LTD </a> All Rights Reserved.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopularPostsCarousel',
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
    footer: {
      type: Boolean,
      default: false,
    },
    ratio: {
      type: String,
      default: '1.78',
    },
  },
  data() {
    return {
      footerLinks: [
        {
          id: 1,
          label: 'About',
          url: '/about',
        },
        {
          id: 4,
          label: 'Terms of Use',
          url: '/terms-of-use',
        },
        {
          id: 5,
          label: 'Privacy Policy',
          url: '/privacy-policy',
        },
        {
          id: 6,
          label: 'Contact Us',
          url: '/contact-us',
        },
      ],
    };
  },
};
</script>
