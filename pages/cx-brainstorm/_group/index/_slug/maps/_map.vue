<template>
  <div id="singleBrainstormMap" class="d-flex flex-column">
    <v-card
      class="relative z-index-3"
      dark
      tile
      :class="localCover ? 'brainstorm-img-bg' : 'brainstorm-bg'"
      :style="[localCover ? { backgroundImage: `url(${localCover})` } : '']"
    >
      <v-container v-if="map">
        <v-row>
          <v-col cols="12" md="4" class=" d-flex flex-column justify-space-between">
            <v-card>
              <v-img :src="map ? map.image : ''" aspect-ratio="2">
                <template #placeholder>
                  <v-skeleton-loader type="image" />
                </template>
              </v-img>
            </v-card>
            <div class="d-flex flex-wrap">
              <v-btn small class="mt-4 mr-2" @click="ratingDialog = true">
                <v-icon left>
                  {{ mdiStar }}
                </v-icon>
                Rate Map
              </v-btn>
              <template v-if="map.isFollowing">
                <v-btn
                  color="#fff"
                  outlined
                  depressed
                  small
                  class="mt-4"
                  :loading="following"
                  @click="followMap(map)"
                >
                  Following
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  class="white--text mt-4"
                  color="primary"
                  small
                  :loading="following"
                  @click="followMap(map)"
                >
                  <v-icon left>
                    {{ mdiPlus }}
                  </v-icon>
                  Follow
                </v-btn>
              </template>
            </div>
          </v-col>
          <v-col cols="12" md="8">
            <div
              class="
                relative
                height-full
                d-flex
                flex-column
                justify-space-between
              "
            >
              <div></div>
              <h1 class="" :class="breakpoint.md ? 'font-16' : 'text-h5'">
                {{ map.title }}
              </h1>
              <p :class="breakpoint.md ? 'font-12' : 'text-subtitle-1'">
                {{ map.description }}
              </p>
              <div class="d-flex mb-4">
                <v-rating
                  background-color="white"
                  color="amber"
                  dense
                  readonly
                  half-increments
                  :value="map.rating"
                  size="24"
                />
                <span class="ml-2">
                  <!-- ({{ parseFloat(map.ratings_count).toFixed(1) }}) -->
                  ({{ map.ratings_count }})
                </span>
              </div>
              <MapShareButtons
                :url="`${$config.appURL}/map-experiences/${map.slug}`"
                :title="map.title"
                :excerpt="map.description"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-btn
        v-if="!breakpoint.xs"
        absolute
        small
        fab
        dark
        color="grey"
        title="Full screen"
        @click.stop="stepDialog = true"
      >
        <v-icon>{{ mdiArrowExpand }} </v-icon>
      </v-btn>
    </v-card>
    <template v-if="!stepDialog">
      <template v-if="map && map.type === 'standard'">
        <Standard
          :step-dialog="stepDialog"
          class="standard"
          @update-reaction="updateReaction"
          @delete-reaction="deleteReaction"
          @add-comment="addComment"
          @update-comment="updateComment"
          @copy-step="openCopyDialog"
          @openAnswerMediaDialogModal="openAnswerMediaDialogModal"
        />
      </template>
      <template v-if="map && map.type === 'layout1'">
        <LayoutOne
          :step-dialog="stepDialog"
          class="layout1"
          @update-reaction="updateReaction"
          @delete-reaction="deleteReaction"
          @copy-step="openCopyDialog"
          @add-comment="addComment"
          @update-comment="updateComment"
          @openAnswerMediaDialogModal="openAnswerMediaDialogModal"
        />
      </template>

      <template v-if="map && map.type === 'layout2'">
        <LayoutTwo
          :step-dialog="stepDialog"
          class="layout2"
          @update-reaction="updateReaction"
          @delete-reaction="deleteReaction"
          @copy-step="openCopyDialog"
          @add-comment="addComment"
          @update-comment="updateComment"
          @openAnswerMediaDialogModal="openAnswerMediaDialogModal"
        />
      </template>
    </template>

    <!-- expand dialog map (all map type also added here) -->
    <div v-if="stepDialog" class="map-entry-dialog">
      <template v-if="map">
        <client-only>
          <vue-drag-resize
            :is-active="true"
            :w="vDragDefaultWidth"
            :h="vDragDefaultHeight"
            :x="vDragPositionX"
            :y="vDragPositiony"
            drag-handle=".drag"
            :parent-limitation="true"
            :prevent-active-behavior="true"
            @resizing="resize"
          >
            <v-card flat>
              <div class="drag header">
                <v-btn
                  absolute
                  small
                  fab
                  dark
                  color="grey"
                  title="Exit full screen"
                  @click="stepDialog = false"
                >
                  <v-icon>{{ mdiArrowCollapse }}</v-icon>
                </v-btn>
              </div>
              <v-card
                class="relative py-5"
                tile
                :class="localCover ? 'brainstorm-img-bg' : 'brainstorm-bg'"
                :style="[
                  localCover ? { backgroundImage: `url(${localCover})` } : '',
                ]"
              >
                <v-card-text class="py-0">
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-card>
                        <v-img :src="map.image" aspect-ratio="2">
                          <template #placeholder>
                            <v-skeleton-loader type="image" />
                          </template>
                        </v-img>
                      </v-card>
                      <div class="d-flex flex-wrap">
                        <v-btn
                          small
                          class="mt-4 mr-2"
                          @click="ratingDialog = true"
                        >
                          <v-icon left>
                            {{ mdiStar }}
                          </v-icon>
                          Rate Map
                        </v-btn>
                        <template v-if="map.isFollowing">
                          <v-btn
                            color="#fff"
                            outlined
                            depressed
                            small
                            class="mt-4"
                            :loading="following"
                            @click="followMap(map)"
                          >
                            Following
                          </v-btn>
                        </template>
                        <template v-else>
                          <v-btn
                            class="white--text mt-4"
                            color="primary"
                            small
                            :loading="following"
                            @click="followMap(map)"
                          >
                            <v-icon left>
                              {{ mdiPlus }}
                            </v-icon>
                            Follow
                          </v-btn>
                        </template>
                      </div>
                    </v-col>
                    <v-col cols="12" md="8" class="pb-2">
                      <div
                        class="
                          relative
                          height-full
                          d-flex
                          flex-column
                          justify-space-between
                        "
                      >
                        <div>
                          <h1 class="text-h5">
                            {{ map.title }}
                          </h1>
                          <p class="text-subtitle-1">
                            {{ map.description }}
                          </p>
                        </div>
                        <div>
                          <div class="d-flex mb-2">
                            <v-rating
                              background-color="white"
                              color="amber"
                              dense
                              readonly
                              half-increments
                              :value="map.rating"
                              size="24"
                            />
                            <span class="ml-2">
                              <!-- ({{ parseFloat(map.ratings_count).toFixed(1) }}) -->
                              ({{map.ratings_count}})
                            </span>
                          </div>
                          <div
                            v-if="isAbleUploadCover"
                            class="d-flex justify-space-between align-center"
                          >
                            <MapShareButtons
                              :url="`${$config.appURL}/map-experiences/${map.slug}`"
                              :title="map.title"
                              :excerpt="map.description"
                            />
                            <div
                              class="d-flex justify-end items-center zoom-icons"
                            >
                              <v-btn
                                v-if="editcover"
                                fab
                                small
                                dark
                                class="mx-2 remove pink"
                                @click.stop="removeCoverImage"
                              >
                                <v-icon>{{ mdiDelete }}</v-icon>
                              </v-btn>
                              <div v-if="!editcover">
                                <v-btn
                                  v-if="!localCover"
                                  fab
                                  small
                                  dark
                                  color="transparent"
                                  class="mx-2"
                                  @click="$refs.cover.click()"
                                >
                                  <img
                                    :src="`/assets/images/icons/cover-upload.svg`"
                                    width="24"
                                  />
                                </v-btn>
                                <v-btn
                                  v-else
                                  fab
                                  small
                                  dark
                                  color="transparent"
                                  @click="editcover = true"
                                >
                                  <v-icon size="30">
                                    {{ mdiPencilOutline }}
                                  </v-icon>
                                </v-btn>

                                <v-btn
                                  fab
                                  small
                                  dark
                                  color="transparent"
                                  @click="zoomIn"
                                >
                                  <v-icon size="30">
                                    {{ mdiMagnifyPlusOutline }}
                                  </v-icon>
                                </v-btn>
                                <v-btn
                                  fab
                                  small
                                  dark
                                  color="transparent"
                                  class="mx-2"
                                  @click="zoomOut"
                                >
                                  <v-icon size="30">
                                    {{ mdiMagnifyMinusOutline }}
                                  </v-icon>
                                </v-btn>
                                <v-btn
                                  fab
                                  small
                                  dark
                                  color="transparent"
                                  @click="zoom = 1"
                                >
                                  <v-icon size="30">
                                    {{ mdiRestore }}
                                  </v-icon>
                                </v-btn>
                              </div>
                            </div>
                          </div>
                          <div v-else class="d-flex justify-end mt-6">
                            <v-btn
                              height="30"
                              class="capitalize"
                              outlined
                              @click="cancleNewCover"
                            >
                              cancel</v-btn
                            >
                            <v-btn
                              height="30"
                              color="primary ml-4 capitalize"
                              @click="confirmCover"
                            >
                              Save</v-btn
                            >
                          </div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card class="pa-2 rounded-pill" flat tile>
                <template v-if="map && map.type === 'standard'">
                  <Standard
                    :zoom="zoom"
                    :step-dialog="stepDialog"
                    @update-reaction="updateReaction"
                    @delete-reaction="deleteReaction"
                    @add-comment="addComment"
                    @update-comment="updateComment"
                    @copy-step="openCopyDialog"
                    @openAnswerMediaDialogModal="openAnswerMediaDialogModal"
                  />
                </template>
                <template v-if="map && map.type === 'layout1'">
                  <LayoutOne
                    :zoom="zoom"
                    :step-dialog="stepDialog"
                    @update-reaction="updateReaction"
                    @delete-reaction="deleteReaction"
                    @copy-step="openCopyDialog"
                    @add-comment="addComment"
                    @update-comment="updateComment"
                    @openAnswerMediaDialogModal="openAnswerMediaDialogModal"
                  />
                </template>

                <template v-if="map && map.type === 'layout2'">
                  <LayoutTwo
                    :zoom="zoom"
                    :step-dialog="stepDialog"
                    @update-reaction="updateReaction"
                    @delete-reaction="deleteReaction"
                    @copy-step="openCopyDialog"
                    @add-comment="addComment"
                    @update-comment="updateComment"
                    @openAnswerMediaDialogModal="openAnswerMediaDialogModal"
                  />
                </template>
              </v-card>
            </v-card>
          </vue-drag-resize>
        </client-only>
      </template>
    </div>
    <!-- copy map step dialog -->
    <v-dialog
      v-model="copySheet"
      transition="dialog-bottom-transition"
      width="500"
    >
      <v-card>
        <v-card-title class="primary">
          <h3>Copy to...</h3>
          <v-spacer />
          <v-btn icon @click="copySheet = false">
            <v-icon>{{ mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <validation-observer
          ref="form"
          v-slot="{ handleSubmit, invalid, reset }"
        >
          <v-form
            @reset.prevent="reset"
            @submit.prevent="handleSubmit(copyStep)"
          >
            <v-card-text class="pb-1">
              <v-container>
                <v-row>
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      v-model="map_id"
                      :items="maps"
                      item-text="title"
                      item-value="id"
                      label="Select journey"
                      full-width
                      outlined
                    />
                  </v-col>
                  <v-col cols="12">
                    <div class="d-flex justify-start align-center">
                      <label for="color" class="mr-4">Color: </label>
                      <v-menu offset-y transition="slide-y-transition">
                        <template #activator="{ on }">
                          <v-btn :color="pickColor" dark v-on="on"> </v-btn>
                        </template>
                        <v-color-picker
                          v-model="pickColor"
                          value="#7417BE"
                          hide-canvas
                          hide-inputs
                          show-swatches
                          class="mx-auto"
                        ></v-color-picker>
                      </v-menu>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="pa-6 pt-0">
              <v-spacer />
              <v-btn
                type="submit"
                :loading="processing"
                class="primary"
                :disabled="invalid"
              >
                Copy
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
      </v-card>
    </v-dialog>

    <!-- map rating dialog-->
    <v-dialog v-model="ratingDialog" max-width="336">
      <v-card>
        <v-card-title class="justify-space-between primary white--text">
          <span class="headline">Rate this map</span>
          <v-btn icon dark class="ma-0" @click.stop="ratingDialog = false">
            <v-icon>{{ mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-center px-2">
          <p class="mt-1 text--text body-2">
            Your rating will be added to overall score
          </p>
          <v-rating
            v-model="rating"
            background-color="primary"
            color="yellow accent-4"
            dense
            size="32"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text> Cancel </v-btn>
          <v-btn
            color="primary"
            outlined
            :loading="loadingRating"
            @click="rateMap"
          >
            Rate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <media-dialog-viewer
      :is-active="mediaDialogContents.active"
      :dialog-open="mediaDialogContents.isImageDialogOpen"
      :contents="mediaDialogContents.contents"
      @closeMediaDialogModal="closeMediaDialogModal"
    ></media-dialog-viewer>

    <!-- Cover image Uploader -->
    <input
      ref="cover"
      type="file"
      name="cover"
      accept="image/*"
      style="display: none"
      @change="updateCover($event)"
    />

    <Confirm ref="confirm" />
  </div>
</template>
<script>
import {
  mdiStar,
  mdiPlus,
  mdiClose,
  mdiArrowExpand,
  mdiArrowCollapse,
  mdiMagnifyPlusOutline,
  mdiMagnifyMinusOutline,
  mdiRestore,
  mdiCameraEnhanceOutline,
  mdiDelete,
  mdiPencilOutline,
} from '@mdi/js';
import { mapState } from 'vuex';
import LayoutOne from '~/components/maps/brainstorm/types/LayoutOne.vue';
import LayoutTwo from '~/components/maps/brainstorm/types/LayoutTwo.vue';
import Standard from '~/components/maps/brainstorm/types/Standard.vue';

export default {
  name: 'BrainstormSingleMap',
  components: { Standard, LayoutOne, LayoutTwo },
  props: {},
  data: () => ({
    pickColor: '#ffffff',
    copySheet: false,
    maps: {},
    map_id: '',
    processing: false,

    rating: 0,
    ratingDialog: false,
    loadingRating: false,
    following: false,
    stepDialog: false,
    zoom: 1,

    // resize map expand dialog
    width: 0,
    height: 0,
    top: 0,
    left: 0,

    mdiStar,
    mdiPlus,
    mdiClose,
    mdiArrowExpand,
    mdiMagnifyPlusOutline,
    mdiMagnifyMinusOutline,
    mdiRestore,
    mdiArrowCollapse,
    mdiCameraEnhanceOutline,
    mdiDelete,
    mdiPencilOutline,
    vDragDefaultWidth: 1150,
    vDragDefaultHeight: 800,
    vDragPositionX: 0,
    vDragPositiony: 0,
    isHydrated: false,
    localCover: '',
    imageFile: '',
    editcover: false,
    isAbleUploadCover: true,
    mediaDialogContents: {
      active: 0,
      isImageDialogOpen: false,
      contents: [],
    },
  }),
  computed: {
    breakpoint() {
      return this.isHydrated ? this.$vuetify.breakpoint : {};
    },
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    authId() {
      return this.loggedIn ? this.user.id : 0;
    },
    ...mapState('map', ['map']),
  },
  watch: {
    stepDialog(val) {
      if (val) {
        this.focusScrollbar();
      }
    },
  },
  created() {
    this.$emit('openSingleMap');
  },
  async mounted() {
    this.isHydrated = true;
    await this.getSingleMap();
    this.setVDragResize();

    this.focusScrollbar();
  },
  methods: {
    zoomIn(e) {
      if (this.zoom < 2) {
        this.zoom += 0.075;
      }
    },
    zoomOut(e) {
      if (this.zoom > 0.5) {
        this.zoom -= 0.075;
      }
    },
    setVDragResize() {
      this.vDragDefaultHeight =
        window.innerHeight > this.vDragDefaultHeight
          ? this.vDragDefaultHeight
          : window.innerHeight - 50;

      this.vDragDefaultWidth =
        window.innerWidth > this.vDragDefaultWidth
          ? this.vDragDefaultWidth
          : window.innerWidth - 50;

      this.vDragPositionX = (window.innerWidth - this.vDragDefaultWidth) / 2;
      this.vDragPositiony = (window.innerHeight - this.vDragDefaultHeight) / 2;
    },
    focusScrollbar() {
      setTimeout(() => {
        document.querySelectorAll('.ps-container').forEach((item) => {
          item.classList.add('ps--focus');
        });
      }, 100);
    },
    // get single map
    async getSingleMap() {
      try {
        const { data } = await this.$axios.$get(
          `api/brainstorm/map/get/${this.$route.params.map}`
        );
        this.$store.commit('map/PUSH_MAP', data);
        if (data.cover_image) {
          this.localCover = data.cover_image;
        }
      } catch (e) {}
    },
    // copy step
    async openCopyDialog($event) {
      this.stepSource = $event.step.id;
      this.pickColor = $event.step.color;
      try {
        const maps = await this.$axios.$get(
          `api/brainstorm/maps/copy/${this.user.id}/${$event.mapType}/${$event.group}/${$event.subGroupId}`
        );
        this.maps = maps.data;
        this.processing = false;
        this.copySheet = true;
      } catch (err) {
        this.processing = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },

    // copy step action
    async copyStep() {
      try {
        this.processing = true;
        const { message } = await this.$axios.$post(
          `api/brainstorm/map/steps/copy/${this.stepSource}`,
          {
            map_id: this.map_id,
            owner_id: this.map.user_id,
            color: this.pickColor,
          }
        );
        this.processing = false;
        this.copySheet = false;
        this.pickColor = '#ffffff';
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.processing = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },

    // rate map
    async rateMap() {
      this.loadingRating = true;
      try {
        const {
          message,
          rating,
          ratings_count: ratingsCoutns,
        } = await this.$axios.$post(`api/brainstorm/map/rate`, {
          map_id: this.map.id,
          rating_score: this.rating,
        });
        this.loadingRating = false;
        this.$store.commit('map/RATE_MAP', rating);
        this.$store.commit('map/RATE_MAP_COUNTS', ratingsCoutns);
        setTimeout(() => {
          this.ratingDialog = false;
        }, 300);
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.loadingRating = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
    // follow map
    async followMap(map) {
      this.following = true;
      try {
        if (this.loggedIn) {
          const { following } = await this.$axios.$get(
            `api/brainstorm/map/follow/${map.id}`
          );
          this.following = false;
          this.$store.commit('map/FOLLOW_MAP', following);
        } else {
          this.following = false;
          await this.$store.commit(
            'APP_NETWORK_ERROR',
            'Please sign in to use this service.'
          );
        }
      } catch (e) {
        this.following = false;
      }
    },
    // add comment
    addComment($event) {
      this.$store.commit('map/ADD_COMMENT', $event);
    },
    // update comment data
    updateComment(event) {
      // this.$store.commit('map/ADD_COMMENT_REACT', event);
    },
    // update reaction
    updateReaction($event) {
      if ($event.reactIndex > -1) {
        this.$store.commit('map/UPDATE_REACTION', {
          stepIndex: $event.stepIndex,
          answerIndex: $event.answerIndex,
          oldReactIndex: $event.reactIndex,
          reactData: $event.reactData,
        });
      } else {
        this.$store.commit('map/ADD_REACTION', {
          stepIndex: $event.stepIndex,
          answerIndex: $event.answerIndex,
          reactData: $event.reactData,
        });
      }
    },
    deleteReaction($event) {
      if ($event.reactIndex > -1) {
        this.$store.commit('map/DELETE_REACTION', {
          stepIndex: $event.stepIndex,
          answerIndex: $event.answerIndex,
          reactIndex: $event.reactIndex,
        });
      }
    },
    resize(newRect) {
      this.width = newRect.width;
      this.height = newRect.height;
      this.top = newRect.top;
      this.left = newRect.left;
    },

    openAnswerMediaDialogModal(data) {
      this.mediaDialogContents.isImageDialogOpen = data.isImageDialogOpen;
      this.mediaDialogContents.contents = data.contents;
      this.mediaDialogContents.active = data.active;
    },
    closeMediaDialogModal() {
      this.mediaDialogContents.isImageDialogOpen = false;
      this.mediaDialogContents.contents = [];
      this.mediaDialogContents.active = 0;
    },
    // map Cover upload
    updateCover(event) {
      this.isAbleUploadCover = false;
      this.imageFile = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.imageFile);
      reader.onload = () => {
        this.localCover = URL.createObjectURL(this.imageFile);
      };
      this.editcover = false;
      this.$refs.cover.value = '';
    },
    removeCoverImage() {
      this.editcover = false;
      this.confirmDeleteCover();
    },
    // delete cover confirm
    confirmDeleteCover() {
      this.$refs.confirm
        .open('Delete', 'Are you sure?', { color: 'red' })
        .then((res) => {
          if (res) {
            this.confirmCover();
          } else {
            this.cancleNewCover();
          }
          return false;
        });
    },
    async confirmCover() {
      this.isAbleUploadCover = true;
      try {
        const formData = new FormData();

        formData.append('image', this.map.image ? this.map.image : '');
        formData.append('title', this.map.title);
        formData.append('description', this.map.description);
        formData.append('type', this.map.type);
        formData.append('cover_image', this.imageFile);

        // create or update map
        const { map } = await this.$axios.$post(
          `api/brainstorm/map/update/${this.map.id}`,
          formData
        );

        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Map successfully updated'
        );
        this.imageFile = '';
        this.localCover = map.cover_image;
        const newMap = Object.assign({}, this.map, {
          cover_image: map.cover_image,
        });
        this.$store.commit('map/PUSH_MAP', newMap);
      } catch (err) {
        if (err.response && err.response.status === 422) {
          const { errors } = err.response.data;
          this.errors = errors;
          this.$refs.form.setErrors(errors);
        } else {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },
    cancleNewCover() {
      this.isAbleUploadCover = true;
      this.localCover = this.map.cover_image;
    },
  },
};
</script>
