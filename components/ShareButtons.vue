<template>
  <v-menu
    content-class="reaction rounded-full rounded-xl mt-n16"
    offset-y
    :nudge-left="sendBtnVisible ? 0 : 80"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        :class="addClass ? 'post-features_action' : ''"
        text
        v-bind="attrs"
        plain
        class="share-btn"
        v-on="on"
      >
        <v-icon :class="addClass ? 'mt-lg-0 mt-sm-2' : ''" left>
          {{ mdiShareVariant }}
        </v-icon>
        <span
          class="d-none d-lg-inline"
          :class="addClass ? 'mt-lg-0 mt-sm-3' : ''"
          >Share</span
        >
      </v-btn>
    </template>
    <div class="like-buttons d-flex">
      <v-tooltip :disabled="breakpoint.mdAndDown" top nudge-top="15">
        <template #activator="{ on, attrs }">
          <ShareNetwork
            network="facebook"
            :url="url"
            :title="title"
            :description="excerpt"
          >
            <v-img
              class="d-inline-block cursor-pointer"
              v-bind="attrs"
              :src="`/socials/facebook.png`"
              width="32"
              v-on="on"
            />
          </ShareNetwork>
        </template>
        <span>Facebook</span>
      </v-tooltip>
      <v-tooltip :disabled="breakpoint.mdAndDown" top nudge-top="15">
        <template #activator="{ on, attrs }">
          <ShareNetwork
            network="twitter"
            :url="url"
            :title="title"
            :description="excerpt"
          >
            <v-img
              class="cursor-pointer ml-2"
              v-bind="attrs"
              :src="`/socials/twitter.png`"
              width="32"
              v-on="on"
            />
          </ShareNetwork>
        </template>
        <span>Twitter</span>
      </v-tooltip>
      <v-tooltip :disabled="breakpoint.mdAndDown" top nudge-top="15">
        <template #activator="{ on, attrs }">
          <ShareNetwork
            network="linkedin"
            :url="url"
            :title="title"
            :description="excerpt"
          >
            <v-img
              class="cursor-pointer ml-2"
              v-bind="attrs"
              :src="`/socials/linkedin.png`"
              width="32"
              v-on="on"
            />
          </ShareNetwork>
        </template>
        <span>Linkedin</span>
      </v-tooltip>
      <v-tooltip :disabled="breakpoint.mdAndDown" top nudge-top="15">
        <template #activator="{ on, attrs }">
          <ShareNetwork
            network="pinterest"
            :url="url"
            :title="title"
            :description="excerpt"
          >
            <v-img
              class="cursor-pointer ml-2"
              v-bind="attrs"
              :src="`/socials/pinterest.png`"
              width="32"
              v-on="on"
            />
          </ShareNetwork>
        </template>
        <span>Pinterest</span>
      </v-tooltip>
    </div>
  </v-menu>
</template>

<script>
import { mdiShareVariant } from '@mdi/js';
export default {
  name: 'ShareButtons',
  props: {
    url: {
      type: String,
      required: true,
      default: '',
    },
    title: {
      type: String,
      required: true,
      default: '',
    },
    excerpt: {
      type: String,
      required: true,
      default: '',
    },
    addClass: {
      type: Boolean,
      default: false,
    },
    sendBtnVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdiShareVariant,
      isHydrated: false,
    };
  },
  computed: {
    breakpoint() {
      return this.isHydrated ? this.$vuetify.breakpoint : { mdAndDown: true };
    },
  },
  mounted() {
    this.isHydrated = true;
  },
};
</script>
<style>
.share-btn .v-btn__content {
  opacity: 1 !important;
}
</style>
