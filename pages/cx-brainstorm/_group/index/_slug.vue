<template>
  <div>
    <nuxt-child
      :key="$route.fullPath"
      :subgroup="subgroup"
      :sort="sort"
      :type="type"
      :query="query"
      :consolidate="consolidate"
      :shared-groups="sharedGroups"
      @openSingleMap="$emit('openSingleMap')"
    ></nuxt-child>
  </div>
</template>

<script>
export default {
  name: 'TaxonomySubGroupSlugPosts',
  props: {
    subgroup: {
      type: Object,
      default: null,
    },
    sharedGroups: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: String,
      default: null,
    },
    sort: {
      type: String,
      default: 'latest',
    },
    type: {
      type: String,
      default: null,
    },
    query: {
      type: String,
      default: null,
    },
    consolidate: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
