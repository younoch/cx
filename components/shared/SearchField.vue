<template>
  <v-text-field
    v-model.trim="query"
    :label="placeholder"
    flat
    solo
    :prepend-inner-icon="mdiMagnify"
    class="theme__search-bar"
    hide-details
    @keyup="searchKeyword"
  />
</template>

<script>
import { mdiMagnify } from '@mdi/js';
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Search here',
    },
  },
  data() {
    return {
      query: '',
      mdiMagnify,
    };
  },
  methods: {
    searchKeyword() {
      this.$emit('search', this.query);
    },
  },
};
</script>
