<template>
  <div id="maps">
    <v-row v-if="loading">
      <v-col v-for="i in 6" :key="i" cols="12" md="4">
        <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-fade-transition v-else>
      <v-row>
        <v-col cols="12" md="4">
          <v-card
            height="100%"
            class="add-map"
            outlined
            @click.stop="openJourneyDialog(true)"
          >
            <v-card-text class="d-flex flex-column align-center justify-center">
              <v-icon large>
                {{ mdiPlusCircle }}
              </v-icon>
              <h2 class="title mt-4 text-center">Add New Map</h2>
            </v-card-text>
          </v-card>
        </v-col>

        <template v-for="(map, index) in maps">
          <v-col
            v-if="isActive(map.status, map.user_id)"
            :key="'map_' + map.id"
            cols="12"
            md="4"
          >
            <v-card outlined class="overflow-hidden">
              <!-- pin badge -->
              <span v-if="map.pin === 1" class="pin__badge">
                <v-icon size="20" color="primary">{{ mdiPinOutline }}</v-icon>
              </span>
              <v-list-item class="pl-2 pr-0" :style="getMapColor(map.color)">
                <v-list-item-avatar color="grey">
                  <v-img
                    :src="
                      user && map.user.image
                        ? map.user.image
                        : $store.state.defaultProfileImage
                    "
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="headline">
                    {{ map.user.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    @{{ map.user.username }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <!-- map control -->
                <v-list-item-icon
                  v-if="
                    (loggedIn && +map.user_id === authId) ||
                    user.role !== 'subscriber'
                  "
                >
                  <v-menu
                    transition="slide-x-transition"
                    offset-y
                    left
                    :max-width="170"
                    :allow-overflow="true"
                  >
                    <template #activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on">
                        {{ mdiDotsVertical }}
                      </v-icon>
                    </template>
                    <v-list class="pa-0">
                      <v-list-item
                        v-if="user.role !== 'subscriber'"
                        ripple
                        @click.stop="pinMapJourney(map.id, index)"
                      >
                        <v-list-item-action class="mr-3">
                          <v-icon size="20">
                            {{ mdiPinOutline }}
                          </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title class="font-14">
                            {{ map.pin === 1 ? 'Unpin' : 'Pin' }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <template v-if="loggedIn && +map.user_id === authId">
                        <v-list-item ripple @click="editJourney(map)">
                          <v-list-item-action class="mr-3">
                            <v-icon size="20">
                              {{ mdiPencilOutline }}
                            </v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title class="font-14">
                              Edit
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          ripple
                          @click="showConfirmDeleteMap(map.id, index)"
                        >
                          <v-list-item-action class="mr-3">
                            <v-icon size="20">
                              {{ mdiTrashCanOutline }}
                            </v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title class="font-14">
                              Delete
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-list>
                  </v-menu>
                </v-list-item-icon>
              </v-list-item>

              <nuxt-link
                :to="`/cx-brainstorm/${subgroup.slug}/maps/${map.slug}`"
              >
                <v-img
                  :src="map.image"
                  class="white--text align-end v-card--link"
                  :gradient="
                    map.image ? 'to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)' : ''
                  "
                  aspect-ratio="2"
                >
                  <template #placeholder>
                    <v-skeleton-loader type="image" />
                  </template>
                  <div class="pa-2">
                    <h3 class="title map-title">
                      {{ map.title }}
                    </h3>
                  </div>
                </v-img>
              </nuxt-link>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-fade-transition>

    <!-- START CREATE JOURNEY DIALOG -->
    <v-dialog
      v-model="sheet"
      width="100%"
      fullscreen
      attach="#maps"
      content-class="map-entry-dialog"
      transition="dialog-bottom-transition"
    >
      <v-card flat class="map-entry">
        <validation-observer
          ref="form"
          v-slot="{ handleSubmit, invalid, reset }"
        >
          <v-form
            @reset.prevent="reset"
            @submit.prevent="handleSubmit(onSubmit)"
          >
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="4">
                    <ImageUploader
                      v-model="image"
                      :errors="errors"
                      @updateImage="journey.image = $event"
                      @removeImage="journey.image = $event"
                    />
                  </v-col>
                  <v-col cols="12" sm="8">
                    <v-card>
                      <v-card-text>
                        <b-text
                          v-model="journey.title"
                          rules="required|min:10|max:50"
                          outlined
                          label="Title"
                          vid="title"
                          counter="50"
                          @blur="checkSlug"
                        />
                        <b-text
                          v-model="journey.slug"
                          rules="required"
                          vid="slug"
                          outlined
                          label="Slug"
                        />
                        <b-text-area
                          v-model="journey.description"
                          rules="required|min:10|max:250"
                          vid="description"
                          outlined
                          label="Description"
                          counter="250"
                        />

                        <v-radio-group v-model="journey.type" row>
                          <v-radio value="layout1">
                            <template #label>
                              <div class="d-flex flex-column">
                                <h5>Column Based Layout</h5>
                                <v-img
                                  :src="
                                    require(`~/assets/images/icons/maplayout1.png`)
                                  "
                                />
                              </div>
                            </template>
                          </v-radio>
                          <v-radio value="layout2">
                            <template #label>
                              <div class="d-flex flex-column">
                                <h5>Row Based Layout</h5>
                                <v-img
                                  :src="
                                    require(`~/assets/images/icons/maplayout2.png`)
                                  "
                                />
                              </div>
                            </template>
                          </v-radio>
                          <v-radio
                            v-if="journey.map_type === 'standard'"
                            value="standard"
                          >
                            <template #label>
                              <div class="d-flex flex-column">
                                <h5>Standard Journey Template</h5>
                                <v-img
                                  :src="
                                    require(`~/assets/images/icons/maplayout2.png`)
                                  "
                                />
                              </div>
                            </template>
                          </v-radio>
                        </v-radio-group>
                        <div class="d-flex justify-start align-center">
                          <div
                            v-if="
                              isConsolidate ||
                              journey.map_type === 'consolidate'
                            "
                            class="mr-4 d-flex justify-start flex-wrap"
                          >
                            <v-subheader class="font-15 pl-0"
                              >Pick a Color</v-subheader
                            >
                            <v-menu offset-y transition="slide-y-transition">
                              <template #activator="{ on }">
                                <v-btn
                                  class="map__color-btn color-btn"
                                  :color="journey.color"
                                  depressed
                                  dark
                                  v-on="on"
                                >
                                </v-btn>
                              </template>
                              <v-color-picker
                                v-model="journey.color"
                                value="#7417BE"
                                hide-canvas
                                hide-inputs
                                show-swatches
                                class="mx-auto"
                              ></v-color-picker>
                            </v-menu>
                          </div>
                          <ActiveInactiveDialog
                            v-model="journey.status"
                            hide-details
                            class="mt-0 pt-0"
                          />
                        </div>
                      </v-card-text>
                      <v-divider />
                      <v-card-actions>
                        <v-spacer />
                        <v-btn outlined @click="closeJourneyDialog">
                          Cancel
                        </v-btn>
                        <v-btn
                          v-if="isConsolidate"
                          type="submit"
                          :loading="creating"
                          class="primary"
                          :disabled="invalid"
                          @click.stop="publishMap"
                        >
                          {{ editable ? 'Update' : 'Publish' }}
                        </v-btn>
                        <v-btn
                          v-else
                          type="submit"
                          :loading="creating"
                          class="primary"
                          :disabled="invalid"
                        >
                          {{ editable ? 'Update' : 'Publish' }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-form>
        </validation-observer>
      </v-card>
    </v-dialog>
    <!-- END CREATE JOURNEY DIALOG -->
    <Confirm ref="confirm" />
  </div>
</template>

<script>
import * as debounce from 'lodash.debounce';
import {
  mdiDotsVertical,
  mdiTrashCanOutline,
  mdiPencilOutline,
  mdiPlusCircle,
  mdiClose,
  mdiPinOutline,
} from '@mdi/js';

export default {
  name: 'BrainstormMap',
  props: {
    subgroup: {
      type: Object,
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
  data() {
    return {
      mdiDotsVertical,
      mdiTrashCanOutline,
      mdiPencilOutline,
      mdiPlusCircle,
      mdiClose,
      mdiPinOutline,
      maps: [],
      loading: false,
      page: 1,
      lastPage: null,
      defaultForm: {
        title: '',
        slug: '',
        description: '',
        image: '',
        type: 'layout1',
        datetime: new Date().toISOString(),
        status: 'active',
        color: '#ffffff',
        map_type: 'standard',
      },
      journey: null,
      editable: false,
      sheet: false,
      isConsolidate: false,
      creating: false,
      colorMenu: false,
      errors: {},
      image: null,
    };
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    authId() {
      return this.loggedIn ? this.user.id : 0;
    },
    swatchStyle() {
      const { colorMenu } = this;
      const { color } = this.journey;
      return {
        backgroundColor: color,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        border: '1px solid #888888',
        borderRadius: colorMenu ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out',
      };
    },
  },
  watch: {
    async subgroup(val) {
      if (val) {
        await this.getMaps();
      }
    },
    async sort() {
      await this.getMaps();
    },
    async type() {
      await this.getMaps();
    },
    query: debounce(async function () {
      await this.getMaps();
    }, 300),
    consolidate() {
      this.openJourneyDialog();
    },
  },
  async mounted() {
    this.journey = Object.assign({}, this.defaultForm);
    if (this.maps.length === 0) {
      await this.getMaps();
    }
  },
  methods: {
    getMapColor(color) {
      return color && color.toLowerCase() !== '#ffffff'
        ? { backgroundColor: color }
        : '';
    },
    isActive(status, userId) {
      return (
        status === 'active' ||
        (status === 'inactive' && +userId === this.authId)
      );
    },
    // create journey
    openJourneyDialog(isNormalMap = null) {
      if (!isNormalMap) {
        this.isConsolidate = true;
        this.sheet = true;
        this.journey = Object.assign(
          {},
          { ...this.journey },
          {
            map_type: 'consolidate',
            type: 'layout1',
          }
        );
      } else {
        this.isConsolidate = false;
        this.journey = Object.assign(
          {},
          { ...this.journey },
          {
            map_type: 'standard',
            type: 'standard',
          }
        );
        this.sheet = true;
      }
    },
    // close journey dialog
    closeJourneyDialog() {
      this.sheet = false;
      this.$nextTick(() => {
        this.journey = Object.assign({}, this.defaultForm);
        this.image = '';
        this.$refs.form.reset();
      });
    },
    // edit journey
    editJourney(map) {
      this.editable = true;
      this.journey = Object.assign({}, map);
      this.image = this.journey.image;
      setTimeout(() => {
        this.sheet = true;
      }, 300);
    },
    publishMap() {
      const windowLocation = `${this.$config.appURL}${this.$route.path}/${this.journey.slug}`;
      window.open(windowLocation);
    },
    // check slug
    async checkSlug() {
      try {
        const { slug } = await this.$axios.$get(
          `api/brainstorm/map/check-slug/${encodeURIComponent(
            this.journey.title
          )}`
        );
        this.journey.slug = slug;
      } catch (e) {
        this.journey.slug = null;
      }
    },
    async onSubmit() {
      this.creating = true;
      try {
        const formData = new FormData();
        if(this.journey.cover_image === null)
        this.journey.cover_image = '';

        formData.append('group_id', this.subgroup.id);

        // append map type creation
        if (this.isConsolidate) {
          formData.append('map_type', 'consolidate');
        } else {
          formData.append('map_type', 'standard');
        }

        Object.keys(this.journey).forEach((key) =>
          formData.append(key, this.journey[key])
        );

        // create or update map
        if (this.editable) {
          const { map } = await this.$axios.$post(
            `api/brainstorm/map/update/${this.journey.id}`,
            formData
          );

          const updatedMapIndex = this.maps.findIndex((_) => _.id === map.id);
          if (updatedMapIndex > -1) {
            this.$set(this.maps, updatedMapIndex, map);
          }
          this.editable = false;

          this.$store.commit(
            'CRUD_SUCCESS_NO_ACTION',
            'Map successfully updated'
          );
        } else {
          const { map } = await this.$axios.$post(
            `api/brainstorm/map/create`,
            formData
          );

          map.pin = 0;
          this.maps.unshift(map);

          this.$store.commit(
            'CRUD_SUCCESS_NO_ACTION',
            'Map successfully created'
          );
        }

        this.creating = false;
        this.closeJourneyDialog();
        this.errors = null;
      } catch (err) {
        this.creating = false;
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
    // get all maps
    async getMaps() {
      this.loading = true;
      try {
        const { data } = await this.$axios.$get('api/brainstorm/map/get', {
          params: {
            page: this.page,
            group_id: this.subgroup.id,
            sort: this.sort,
            type: this.type,
            query: this.query,
            limit: 500,
          },
        });
        this.loading = false;

        // sorting the maps according to pin map
        this.maps = data;
      } catch (e) {
        this.loading = false;
      }
    },
    // delete map
    showConfirmDeleteMap(mapId, mapIndex) {
      this.$refs.confirm
        .open('Delete', 'Are you sure?', { color: 'red' })
        .then((res) => {
          if (res) {
            this.deleteMap(mapId, mapIndex);
          }
          return false;
        });
    },
    // delete map
    async deleteMap(mapId, mapIndex) {
      try {
        await this.$axios.$delete(`api/brainstorm/map/delete/${mapId}`);
        // find map
        const findMap = this.maps.find((map) => map.id === mapId);

        // remove from locally
        if (findMap) {
          this.maps.splice(mapIndex, 1);
        }

        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Map successfully deleted'
        );
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
    async pinMapJourney(mapId, index) {
      try {
        await this.$axios.$get(`api/brainstorm/map/pin/${mapId}`);

        const findMap = this.maps.find((map) => map.id === mapId);
        let notifyMessage = '';

        if (findMap && findMap.pin === 0) {
          findMap.pin = 1;

          // remove from old index
          this.maps.splice(index, 1);

          // Move to new first index
          this.maps.splice(0, 0, findMap);
          notifyMessage = 'Map successfully pined';

          // unpin other maps
          this.unpinOtherMaps(mapId);
        } else {
          findMap.pin = 0;
          // remove from old index
          this.maps.splice(index, 1);

          // Move to end
          this.maps.push(findMap);
          notifyMessage = 'Map successfully unpinned';
        }
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', notifyMessage);
      } catch (err) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
    unpinOtherMaps(mapId) {
      this.maps.forEach((map) => {
        if (map.id !== mapId) {
          if (map.pin === 1) {
            map.pin = 0;
            this.unpinMap(map.id);
          }
        }
      });
    },
    async unpinMap(mapId) {
      try {
        await this.$axios.$get(`api/brainstorm/map/pin/${mapId}`);
      } catch (e) {}
    },
  },
};
</script>
<style scoped>
.color-btn {
  margin-top: 6px !important;
}
</style>
