<template>
  <v-card
    v-if="cardData"
    :href="`posts/${cardData.slug}`"
    target="_blank"
    class="rounded-lg overflow-hidden"
    outlined
  >
    <div class="galley__card-content overflow-hidden">
      <!-- preview document -->
      <div v-if="type === 'document'" class="player-wrapper">
        <div class="player">
          <iframe
            :src="`https://docs.google.com/viewer?embedded=true&url=${cardData.data.documents[0].data}`"
            style="width: 100%; height: 100%"
            frameborder="0"
            allowfullscreen
          >
          </iframe>
        </div>
      </div>

      <!-- preview video -->
      <div v-else-if="type === 'video'">
        <template v-if="findUrl(cardData.data.videos[0].data)">
          <client-only>
            <video-embed :src="cardData.data.videos[0].data" />
          </client-only>
        </template>
        <v-img
          v-else
          :aspect-ratio="16 / 9"
          src="https://www.cyberlink.com/prog/learning-center/html/3621/PDR19-YouTube-21_How_to_Name_Your_YouTube_Videos/img/No-Thumbnail.png"
        ></v-img>
      </div>

      <!-- preview image -->
      <v-img v-else :src="cardData.data.images[0].data" :aspect-ratio="16 / 9">
        <template #placeholder>
          <v-skeleton-loader type="image" />
        </template>
      </v-img>
    </div>

    <v-card-title class="font-16 line-height-24 pt-2 pb-1 px-2">
      <v-tooltip max-width="300" color="primary" top>
        <template #activator="{ on, attrs }">
          <p class="mb-0 text-truncate" v-bind="attrs" v-on="on">
            {{ cardData.title }}
          </p>
        </template>
        <span> {{ cardData.title }}</span>
      </v-tooltip>
    </v-card-title>
    <v-divider />
    <v-card-subtitle
      class="py-2 px-2 font-14 opacity-07 grey-muted--text d-flex align-center"
    >
      <v-icon size="20" class="mr-1" left>
        {{ mdiClockOutline }}
      </v-icon>
      {{ cardData.created_at | datetime }} ago
    </v-card-subtitle>
  </v-card>
</template>

<script>
import { mdiClockOutline } from '@mdi/js';
export default {
  name: 'GalleryCard',
  props: {
    cardData: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: 'image',
    },
  },
  data() {
    return {
      mdiClockOutline,
    };
  },
  methods: {
    // to find url
    findUrl(string) {
      if (string) {
        const findUrl = string.match(
          /(http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/
        );

        if (findUrl) {
          return findUrl[0];
        } else {
          return findUrl;
        }
      }
    },
  },
};
</script>
