<template>
  <v-tooltip right>
    <template #activator="{ on }">
      <v-icon x-small v-on="on">
        {{ getPrivacyIcon(type) }}
      </v-icon>
    </template>
    <span>
      <v-icon small>
        {{ getPrivacyIcon(type) }}
      </v-icon>
      {{ type }}
    </span>
  </v-tooltip>
</template>
<script>
import { mdiEarth, mdiAccountMultiple } from '@mdi/js';

export default {
  name: 'PostFeture',
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    postPrivacySettings: {
      public: mdiEarth,
      private: mdiAccountMultiple,
    },
  }),
  methods: {
    // get privacy icon
    getPrivacyIcon(value) {
      return this.postPrivacySettings[value];
    },
  },
};
</script>
