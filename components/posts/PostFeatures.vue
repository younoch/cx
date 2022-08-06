<template>
  <div class="d-flex justify-center flex-wrap h-100">
    <v-carousel
      v-if="carousel"
      hide-delimiters
      class="post-features h-100 w-100"
    >
      <div class="absolute" style="right: 10px; top: 10px; z-index: 100">
        <v-btn
          icon
          dark
          :ripple="false"
          class="ma-0 remove transparent"
          style="curson: pointer"
          @click.stop="carousel = false"
        >
          <v-icon>{{ mdiArrowRight }}</v-icon>
        </v-btn>
      </div>
      <v-carousel-item
        v-for="(feature, index) in postFeatures"
        :key="index"
        :src="feature.data"
      >
      </v-carousel-item>
    </v-carousel>
    <template v-else>
      <v-hover
        v-for="(feature, index) in postFeatures.slice(0, 5)"
        :key="index"
        v-slot="{ hover }"
        :value="breakpoint.mdAndDown"
      >
        <div
          class="align-center d-flex justify-center"
          :class="index < 2 ? 'column-2' : 'column-3'"
          @click="carousel = true"
        >
          <div
            v-if="postEditable"
            v-show="hover"
            class="absolute"
            style="right: 10px; top: 10px; z-index: 100"
          >
            <v-btn
              v-if="feature.type === 'image' && !feature.id"
              color="primary"
              icon
              dark
              class="ma-0 edit transparent"
              @click.stop="$emit('edit', { index, type: feature.type })"
            >
              <v-icon>{{ mdiPencil }}</v-icon>
            </v-btn>
            <v-btn
              icon
              color="pink"
              dark
              class="ma-0 transparent"
              @click.stop="$emit('remove', { index, type: feature.type })"
            >
              <v-icon>{{ mdiDelete }}</v-icon>
            </v-btn>
          </div>

          <v-img
            v-if="feature.type === 'image'"
            :src="feature.data"
            class="border-1"
            aspect-ratio="1.78"
          >
          </v-img>

          <template v-else-if="feature.type === 'video'">
            <client-only>
              <video-embed class="w-100" :src="feature.data"></video-embed>
            </client-only>
          </template>

          <div
            v-else-if="feature.type === 'document'"
            class="player-wrapper w-100 h-100"
          >
            <div class="player">
              <iframe
                :src="`https://docs.google.com/viewer?embedded=true&url=${feature.data}`"
                style="width: 100%; height: 100%"
                frameborder="0"
                allowfullscreen
              >
              </iframe>
            </div>
          </div>

          <v-overlay
            v-if="index === 4"
            class="w-100 h-100"
            style="position: absolute; z-index: 150"
          >
            <p class="font-30 font-weight-regular letter-spacing-2 mb-0">
              {{ `+${postFeatures.length - 4}` }}
            </p>
          </v-overlay>
        </div>
      </v-hover>
    </template>
  </div>
</template>
<script>
import { mdiDelete, mdiPencil, mdiArrowRight } from '@mdi/js';

export default {
  name: 'PostFetures',
  props: {
    postEditable: {
      type: Boolean,
      default: false,
    },
    postFeatures: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    carousel: false,
    mdiArrowRight,
    mdiPencil,
    mdiDelete,
    isHydrated: false,
  }),

  computed: {
    breakpoint() {
      return this.isHydrated
        ? this.$vuetify.breakpoint
        : { lgAndDown: true, mdAndDown: false };
    },
  },
  mounted() {
    this.isHydrated = true;
  },
};
</script>
