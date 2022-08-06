<template>
  <v-container class="pt-0">
    <v-row class="pt-0 d-flex justify-start sticky-top z-index-3 background">
      <v-col cols="12" sm="6" lg="6" class="d-flex align-center">
        <page-header class="py-0" />
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="3" class="d-flex align-center">
        <search-field
          placeholder="Search documents"
          @search="searchDocuments"
        />
      </v-col>
    </v-row>

    <v-row :class="$vuetify.breakpoint.xs ? 'pt-3 flex-column-reverse' : ''">
      <template v-if="loading">
        <v-col cols="12" md="9">
          <v-row>
            <v-col v-for="(n, i) in 8" :key="i" cols="12" md="4" sm="6">
              <v-skeleton-loader elevation="2" type="card" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="3">
          <v-skeleton-loader elevation="2" type="card-heading, image" />
        </v-col>
      </template>

      <template v-else>
        <v-col cols="12" md="9">
          <v-row>
            <v-col
              v-for="(item, i) in documents"
              :key="i"
              cols="12"
              md="4"
              sm="6"
            >
              <galleryCard :card-data="item" type="document" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="3" class="mt-md-0 mt-8">
          <ad-card :footer="true" class="sticky-top-ad">
            <adsbygoogle ad-slot="6757125591" ad-format="auto" />
          </ad-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { mdiClockOutline } from '@mdi/js';
import * as debounce from 'lodash.debounce';
import GalleryCard from '~/components/shared/GalleryCard.vue';

export default {
  name: 'DocumentsPage',
  components: { GalleryCard },
  data: () => ({
    loading: false,
    documents: [],
    mdiClockOutline,
  }),
  head: {
    title: 'Documents',
  },
  async mounted() {
    await this.getDocuments();
  },
  methods: {
    // get documents
    async getDocuments() {
      this.loading = true;
      try {
        const { data } = await this.$axios.$get('api/get-posts-media', {
          params: { type: 'documents', limit: 500 },
        });
        this.loading = false;
        this.documents = data;
      } catch (e) {}
    },
    searchDocuments: debounce(async function (query) {
      try {
        this.loading = true;

        const { data } = await this.$axios.$get('api/get-posts-media', {
          params: { type: 'documents', limit: 500, q: query },
        });
        this.documents = data;
        this.loading = false;
      } catch (e) {}
    }, 300),
  },
};
</script>
<style scoped>
.sticky-top {
  position: sticky !important;
  top: 4rem !important;
}
.sticky-top-ad {
  position: sticky !important;
  top: 7.8rem !important;
}
@media only screen and (max-width: 960px) {
  .sticky-top {
    position: sticky !important;
    top: 3.5rem !important;
  }
  .sticky-top-ad {
    position: static !important;
    top: 0rem !important;
  }
}
</style>
