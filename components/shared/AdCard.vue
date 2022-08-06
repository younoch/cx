<template>
  <section>
    <v-card v-if="src" class="mx-auto rounded-lg" outlined flat>
      <v-card-subtitle class="text-right py-3 body-1">
        {{ title }}
      </v-card-subtitle>
      <v-skeleton-loader
        v-if="!src"
        v-bind="attrs"
        max-height="150"
        tile
        type="image"
      ></v-skeleton-loader>
      <v-img v-else class="white--text align-end" cover :src="src" />
    </v-card>
    <slot />
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
  </section>
</template>

<script>
export default {
  name: 'AdCard',
  props: {
    title: {
      type: String,
      default: 'Ad',
    },
    src: {
      type: String,
      default: null,
    },
    footer: {
      type: Boolean,
      default: true,
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
