<template>
  <v-breadcrumbs divider="-" :items="breadcrumbs">
    <template #item="{ item }">
      <template v-if="item.icon">
        <v-breadcrumbs-item
          nuxt
          :to="item.to"
          :disabled="item.disabled"
          :exact="item.exact"
        >
          <v-icon class="text--text">
            {{ mdiHome }}
          </v-icon>
        </v-breadcrumbs-item>
      </template>
      <template v-else>
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
</template>

<script>
import { mdiHome } from '@mdi/js';

export default {
  name: 'PageHeader',
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
      const pathArray = this.$route.path.split('/');
      pathArray.shift();
      const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        let title = this.capitalize(
          path.split('/').reverse()[0].split('-').join(' ')
        );
        if (this.$route.path === '/') {
          title = 'Home';
        }
        breadcrumbArray.push({
          path,
          to: breadcrumbArray[idx - 1]
            ? '/' + breadcrumbArray[idx - 1].path + '/' + path
            : '/' + path,
          text: title,
          icon: false,
          disabled: path === this.$route.path.split('/').reverse()[0],
          exact: true,
        });
        return breadcrumbArray;
      }, []);

      return [...crumbs, ...breadcrumbs];
    },
  },
  methods: {
    capitalize(str) {
      str = str || '';

      return str.replace(/\w\S*/g, function (word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
      });
    },
  },
};
</script>
