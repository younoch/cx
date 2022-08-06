<template>
  <v-card height="100%" class="justify-space-between" outlined elevation="1">
    <template v-if="meta.type === 'image'">
      <v-img :src="meta.data" aspect-ratio="1.78">
        <template #placeholder>
          <v-skeleton-loader type="image" />
        </template>
      </v-img>
    </template>
    <template v-if="meta.type === 'video'">
      <div class="video-player">
        <client-only>
          <video-embed :src="meta.data"></video-embed>
        </client-only>
      </div>
    </template>
    <template v-if="meta.type === 'document'">
      <div class="player-wrapper">
        <div class="player">
          <iframe
            :src="`https://docs.google.com/viewer?embedded=true&url=${meta.data}`"
            class="w-100 h-100"
            frameborder="0"
            allowfullscreen
          >
          </iframe>
        </div>
      </div>
    </template>
    <!-- v-show="!showEditTitle || titleId != meta.id" -->
    <v-card-title class="text--heading pa-0 ma-2 mt-4 line-clamp-1">
      <span v-if="breakpoint.mdAndUp">
        {{ meta.name.length > 16 ? meta.name.slice(0, 16) + '..' : meta.name }}
      </span>
      <span v-else>
        {{ meta.name.length > 30 ? meta.name.slice(0, 30) + '..' : '' }}
      </span>
    </v-card-title>

    <v-card-subtitle class="d-flex justify-space-between pa-2 pb-3">
      <div>
        <v-icon left class="pr-0">{{ mdiClockOutline }}</v-icon>
        {{ meta.created_at | date }}
      </div>
      <v-menu
        v-if="user.id === mapUserId"
        min-width="160"
        left
        bottom
        offset-y
        origin="center center"
        transition="scale-transition"
      >
        <template #activator="{ on }">
          <v-icon v-on="on">{{ mdiDotsVertical }}</v-icon>
        </template>
        <v-list class="py-0 post-edit">
          <v-list-item
            v-if="localAns && meta.id"
            ripple
            @click.prevent="
              parseInt(localAns.settings.metaAttachmentId) === meta.id
                ? removeCover()
                : makeCover(meta, metaIndex)
            "
          >
            <v-list-item-action class="mr-1">
              <v-icon class="mr-3">
                {{
                  parseInt(localAns.settings.metaAttachmentId) === meta.id
                    ? mdiFileExcelBoxOutline
                    : mdiImageArea
                }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{
                  parseInt(localAns.settings.metaAttachmentId) === meta.id
                    ? 'Remove'
                    : 'Make'
                }}
                Cover
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item ripple @click="deleteAttachment">
            <v-list-item-action class="mr-1">
              <v-icon class="mr-3">
                {{ mdiTrashCan }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Delete </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-subtitle>
    <!-- COVER DIALOG -->
    <cover-dialog
      v-if="coverDialog"
      ref="coverImage"
      :open="coverDialog"
      :answer-id="localAns.id"
      :meta="coverMeta"
      @update="updateCover"
      @closeCoverModal="closeCoverModal"
    />
  </v-card>
</template>

<script>
import {
  mdiTrashCan,
  mdiClockOutline,
  mdiDotsVertical,
  mdiFileExcelBoxOutline,
  mdiImageArea,
} from '@mdi/js';
import { cloneDeep } from 'lodash-es';
import { format } from 'date-fns';
export default {
  name: 'AnswerDocuments',
  filters: {
    date(value) {
      const dateTime = value || new Date();
      return format(new Date(dateTime), 'dd MMM, yyyy');
    },
  },
  props: {
    answer: {
      type: Object,
      default: null,
    },
    meta: {
      type: Object,
      required: true,
      default: null,
    },
    mapUserId: {
      type: Number,
      required: true,
      default: null,
    },
    metaIndex: {
      type: Number,
      required: true,
      default: null,
    },
  },
  data() {
    return {
      // Answer Cover
      coverMeta: null,
      coverDialog: false,
      localAns: null,
      mdiTrashCan,
      mdiClockOutline,
      mdiDotsVertical,
      mdiFileExcelBoxOutline,
      mdiImageArea,
      isHydrated: false,
    };
  },

  computed: {
    user() {
      return this.$auth.user;
    },
    loggedIn() {
      return this.$auth.loggedIn;
    },
    breakpoint() {
      return this.isHydrated ? this.$vuetify.breakpoint : { mdAndUp: true };
    },
  },

  watch: {
    answer: {
      immediate: true,
      handler(val) {
        this.localAns = cloneDeep(val);
      },
    },
  },

  mounted() {
    this.isHydrated = true;
  },

  methods: {
    deleteAttachment() {
      this.$emit('delete-attachment', this.metaIndex);
    },
    makeCover(meta, metaIndex) {
      this.coverMeta = Object.assign({}, meta);
      if (meta.type === 'image') {
        this.coverDialog = true;
        setTimeout(() => {
          this.$refs.coverImage.openCropper();
        }, 100);
      } else {
        this.makeMetaCover(meta, metaIndex);
      }
    },
    async makeMetaCover() {
      this.processing = true;

      try {
        const formData = new FormData();
        formData.append('type', this.coverMeta.type);

        formData.append('url', this.coverMeta.data);

        formData.append('metaId', this.coverMeta.id);

        const { message, cover } = await this.$axios.$post(
          `api/brainstorm/map/steps/answers/cover/${this.localAns.id}`,
          formData
        );
        this.updateCover({
          cover,
          type: this.coverMeta.type,
          metaAttachmentId: this.coverMeta.id,
        });
        this.processing = false;
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.processing = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
    // update answer cover
    updateCover(event) {
      this.localAns = Object.assign({}, this.localAns, {
        cover_image: event.cover,
        type: event.type,
        settings: {
          metaAttachmentId: event.metaAttachmentId,
          isRatingCover: event.type === 'rating',
        },
      });

      this.$emit('updateMakeCover', this.localAns);
    },
    async removeCover() {
      this.processing = true;
      try {
        const { message } = await this.$axios.$delete(
          `api/brainstorm/map/steps/answers/cover/${this.localAns.id}`
        );
        this.processing = false;
        this.localAns = Object.assign({}, this.localAns, {
          cover_image: null,
          type: 'none',
          settings: {
            metaAttachmentId: 0,
            isRatingCover: false,
          },
        });
        this.$emit('removeCover', this.localAns);
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.processing = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },

    // close Cover Modal
    closeCoverModal() {
      this.coverDialog = false;
      setTimeout(() => (this.coverMeta = null));
    },
  },
};
</script>

<style lang="scss" scoped>
.player-wrapper {
  position: relative;
  padding-top: 56.25%;

  .player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.video-player {
  height: 57.25%;
}
</style>
