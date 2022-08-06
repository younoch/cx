<template>
  <div id="groups">
    <!-- <client-only>
      <carousel
        :per-page-custom="[
          [400, 3],
          [600, 4],
          [768, 5],
          [960, 6],
          [1264, 10],
          [1904, 12],
          [1920, 14],
        ]"
        :scroll-per-page="false"
        :pagination-enabled="false"
        :navigation-enabled="true"
        :loop="true"
        :navigation-prev-label="`<span aria-hidden=&quot;true&quot; class=&quot;v-icon notranslate v-icon--svg theme--light&quot;><svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 24 24&quot; height=&quot;24&quot; width=&quot;24&quot; role=&quot;img&quot; aria-hidden=&quot;true&quot;><path d=&quot;M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z&quot;></path></svg></span>`"
        :navigation-next-label="`<span aria-hidden=&quot;true&quot; class=&quot;v-icon notranslate v-icon--svg theme--light&quot;><svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 24 24&quot; height=&quot;24&quot; width=&quot;24&quot; role=&quot;img&quot; aria-hidden=&quot;true&quot;><path d=&quot;M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z&quot;></path></svg></span>`"
      >
        <template v-if="loading">
          <slide v-for="(n, i) in 6" :key="i">
            <v-skeleton-loader
              :loading="loading"
              transition="fade-transition"
              type="image"
            />
          </slide>
        </template>
        <template v-else>
          <slide v-for="(item, i) in groups" :key="i">
            <v-card
              :to="`/cx-brainstorm/${item.slug}`"
              :title="item.title"
              class="mb-2 border-1 cx__subgroup"
              hover
              outlined
              width="160"
              height="200"
            >
              <v-img
                :src="item.image"
                rel="preload"
                width="100%"
                height="150"
                max-width="100%"
                class="mt-1"
              />
              <div class="caption pt-2 px-1 d-flex align-center text--text">
                <p class="ma-0">
                  {{ item.title }}
                </p>
              </div>
            </v-card>
          </slide>
        </template>
      </carousel>
    </client-only> -->
    <client-only>
      <template v-if="loading">
        <v-row align="start" class="flex-nowrap overflow-x-auto">
          <v-col v-for="(n, i) in 6" :key="i">
            <v-skeleton-loader
              :loading="loading"
              transition="fade-transition"
              type="image"
            /> </v-col
        ></v-row>
      </template>
      <template v-else>
        <div
          class="
            d-flex
            flex-nowrap
            overflow-y-hidden overflow-x-auto
            custom-scrollbar
            ma-n3
          "
        >
          <div class="d-flex justify-center mx-auto">
            <v-card
              v-for="(item, i) in groups"
              :key="i"
              :to="`/cx-brainstorm/${item.slug}`"
              :title="item.title"
              class="mb-2 border-1 cx__subgroup mx-3"
              hover
              outlined
              width="162"
              height="220"
              @click="$emit('updateSubgroup')"
            >
              <v-img
                width="162"
                height="150"
                max-width="100%"
                :src="item.image"
                rel="preload"
                class="mt-1"
              />
              <v-card-text class="caption py-2 px-1 text--text">
                <p class="ma-0">
                  {{ item.title }}
                </p>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </template>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TaxonomyGroup',
  props: {
    taxonomy: {
      type: String,
      required: true,
    },
  },
  computed: mapState('group', {
    loading: (state) => state.loading,
    groups(state) {
      const array = state.groups;
      if (array.length) {
        const group = array.find((_) => _.slug === this.taxonomy);
        return group && group.subgroups;
      }
      return [];
    },
  }),
  mounted() {
    if (this.groups && this.groups.length === 0) {
      this.$store.dispatch('group/getListGroups');
    }
  },
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 10px;
}
</style>
