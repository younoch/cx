<template>
  <v-fab-transition>
    <v-btn
      v-if="fab"
      fab
      fixed
      bottom
      right
      small
      color="red"
      style="z-index: 999"
      @click.stop="vuetifyGo"
    >
      <v-icon color="white">
        {{ mdiChevronUp }}
      </v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
import { mdiChevronUp } from '@mdi/js';

export default {
  name: 'AppFab',

  data: () => ({
    fab: false,
    mdiChevronUp,
    isHydrated: false,
  }),
  computed: {
    vuetifyGo() {
      return this.isHydrated ? this.$vuetify.goTo(0) : false;
    },
  },
  mounted() {
    this.isHydrated = true;
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    handleScroll() {
      const top = Math.round(window.pageYOffset);

      if (top > 100) {
        this.fab = true;
      } else {
        this.fab = false;
      }
    },
  },
};
</script>
