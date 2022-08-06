<template>
  <div class="pl-8">
    <v-icon class="absolute mt-4 ml-n8">
      {{ mdiHome }}
    </v-icon>
    <v-breadcrumbs class="d-inline-block" divider="-" :items="breadcrumbs">
      <template #item="{ item }">
        <template v-if="!item.icon">
          <v-breadcrumbs-item
            nuxt
            :to="item.to"
            :disabled="item.disabled"
            :exact="item.exact"
          >
            {{ item.text }}
          </v-breadcrumbs-item>
        </template>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
import { mdiHome } from '@mdi/js';

export default {
  name: 'PageBreadcrumb',
  props: {
    paths: {
      type: Array,
      default() {
        return [
          {
            text: 'Home',
            to: '/',
            path: '/',
            disabled: false,
            icon: true,
            exact: true,
          },
        ];
      },
    },
  },
  data: () => ({
    mdiHome,
  }),
  computed: {
    breadcrumbs() {
      const crumbs = [
        {
          text: 'Home',
          to: '/',
          path: '/',
          disabled: false,
          icon: true,
          exact: true,
        },
      ];

      return [...crumbs, ...this.paths];
    },
  },
};
</script>
