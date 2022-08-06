<script>
import { cloneDeep } from 'lodash-es';
import {
  mdiEmoticonAngryOutline,
  mdiEmoticonConfusedOutline,
  mdiEmoticonNeutralOutline,
  mdiEmoticonExcitedOutline,
  mdiEmoticonHappyOutline,
  mdiEmoticonOutline,
  mdiDotsVertical,
  mdiFileExcelBoxOutline,
  mdiImageArea,
  mdiDelete,
} from '@mdi/js';

export default {
  name: 'RatingPane',

  props: {
    answer: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      answerRating: null,
      localAns: null,
      coverMeta: null,
      processing: false,
      mdiEmoticonAngryOutline,
      mdiEmoticonConfusedOutline,
      mdiEmoticonNeutralOutline,
      mdiEmoticonExcitedOutline,
      mdiEmoticonHappyOutline,
      mdiEmoticonOutline,
      mdiDotsVertical,
      mdiFileExcelBoxOutline,
      mdiImageArea,
      mdiDelete,
    };
  },

  watch: {
    answer: {
      immediate: true,
      handler(val) {
        this.localAns = cloneDeep(val);
        if (this.localAns.rating) {
          this.answerRating = this.localAns.rating.data;
        } else {
          this.answerRating = null;
        }
      },
    },
  },

  methods: {
    async makeReactionCover({ data, type }) {
      this.coverMeta = Object.assign({}, { data, type, id: 0 });
      await this.makeMetaCover();
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
      this.$emit('answerUpdated', this.localAns);
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
        this.$emit('answerUpdated', this.localAns);
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.processing = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },

    async rateAnswer() {
      this.localAns = Object.assign({}, this.localAns, {
        rating: {
          data: this.answerRating,
          type: 'rating',
        },
      });
      this.$emit('answerUpdated', this.localAns);
      if (this.localAns && this.localAns.id) {
        try {
          const { message } = await this.$axios.$post(
            `api/brainstorm/map/steps/answers/rating/${this.localAns.id}`,
            {
              value: this.answerRating,
            }
          );
          this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
        } catch (err) {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },

    async removeRating() {
      this.answerRating = null;
      this.localAns = Object.assign({}, this.localAns, {
        rating: null,
        type: 'none',
        settings: {
          metaAttachmentId: 0,
          isRatingCover: false,
        },
      });
      this.$emit('answerUpdated', this.localAns);
      if (this.localAns && this.localAns.id) {
        this.processing = true;
        try {
          const { message } = await this.$axios.$delete(
            `api/brainstorm/map/steps/answers/rating/${this.localAns.id}`
          );
          this.processing = false;

          this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
        } catch (err) {
          this.processing = false;
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },
  },
};
</script>

<template>
  <v-row>
    <v-col cols="12" class="py-0">
      <v-card v-if="localAns" flat>
        <v-card-text class="justify-center d-flex align-center">
          <v-radio-group
            v-model="answerRating"
            row
            class="map-rating ma-0 pa-0"
            hide-details
            @change="rateAnswer"
          >
            <v-radio name="anwerRating" value="1" ripple class="angry">
              <template #label>
                <v-icon x-large>{{ mdiEmoticonAngryOutline }}</v-icon>
              </template>
            </v-radio>
            <v-radio name="anwerRating" value="2" ripple class="confused">
              <template #label>
                <v-icon x-large>{{ mdiEmoticonConfusedOutline }}</v-icon>
              </template>
            </v-radio>
            <v-radio name="anwerRating" value="3" ripple class="neutral">
              <template #label>
                <v-icon x-large>{{ mdiEmoticonNeutralOutline }}</v-icon>
              </template>
            </v-radio>
            <v-radio name="anwerRating" value="4" ripple class="happy">
              <template #label>
                <v-icon x-large>{{ mdiEmoticonHappyOutline }}</v-icon>
              </template>
            </v-radio>
            <v-radio name="anwerRating" value="5" ripple class="excited">
              <template #label>
                <v-icon x-large>{{ mdiEmoticonExcitedOutline }}</v-icon>
              </template>
            </v-radio>
          </v-radio-group>
          <v-menu offset-y origin="center center" transition="scale-transition">
            <template #activator="{ on }">
              <v-icon v-on="on">{{ mdiDotsVertical }}</v-icon>
            </template>
            <v-list class="pa-0">
              <v-list-item
                v-if="
                  localAns.settings.isRatingCover && localAns.type === 'rating'
                "
                ripple
                @click.stop="removeCover"
              >
                <v-list-item-action class="mr-1">
                  <v-icon>
                    {{ mdiFileExcelBoxOutline }}
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content class="testy2">
                  <v-list-item-title> Remove Cover </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-else-if="localAns.id && localAns.rating"
                ripple
                @click.stop="makeReactionCover(localAns.rating)"
              >
                <v-list-item-action class="mr-1">
                  <v-icon>
                    {{ mdiImageArea }}
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content class="testy1">
                  <v-list-item-title> Make Cover </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item ripple @click="removeRating(localAns.id)">
                <v-list-item-action class="mr-1">
                  <v-icon>
                    {{ mdiDelete }}
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title> Remove </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
