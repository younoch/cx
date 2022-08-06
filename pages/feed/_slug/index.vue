<template>
  <div id="postEntry">
    <v-container>
      <page-header />
    </v-container>
    <v-progress-linear v-if="loading" :indeterminate="loading" />
    <validation-observer ref="form" v-slot="{ handleSubmit, invalid, reset }">
      <v-form @reset.prevent="reset" @submit.prevent="handleSubmit(savePost)">
        <v-container v-if="postModel">
          <v-row class="justify-center">
            <v-col cols="12" :sm="breakpoint.mdAndDown ? 11 : 8">
              <v-card outlined class="h-100">
                <v-card-title class="justify-space-between primary white--text">
                  <div>Edit Your Post</div>
                </v-card-title>
                <v-card-text :loading="processing" class="pb-0">
                  <v-card flat :scrollable="false" class="pa-0">
                    <v-card-subtitle class="pa-0 w-100">
                      <v-toolbar flat class="padding-x-remove my-sm-0 my-5">
                        <div
                          class="d-flex flex-nowrap align-center"
                          style="flex: 1"
                        >
                          <v-avatar size="36px" class="mr-2">
                            <img
                              v-if="authUser && authUser.image"
                              alt="Avatar"
                              :src="authUser.image"
                            />
                            <v-icon
                              v-else
                              color="primary"
                              v-text="authUser.name.charAt(0).toUpperCase()"
                            ></v-icon>
                          </v-avatar>
                          <div :elevation="6" class="d-flex align-center">
                            <v-tooltip class="user-name-tooltip" top>
                              <template #activator="{ on, attrs }">
                                <p
                                  class="
                                    pr-sm-4 pr-1
                                    heading--text
                                    user-name-tooltip-p
                                  "
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  {{
                                    authUser.name.length > autoStringLimit
                                      ? authUser.name.substr(
                                          0,
                                          autoStringLimit
                                        ) + '...'
                                      : authUser.name
                                  }}
                                </p>
                              </template>
                              <span> {{ authUser.name }}</span>
                            </v-tooltip>
                            <v-menu
                              v-model="privacySettings"
                              offset-y
                              origin="center center"
                              transition="scale-transition"
                              right
                              bottom
                              max-width="340"
                            >
                              <template #activator="{ on }">
                                <v-hover v-slot="{ hover }">
                                  <v-chip
                                    flat
                                    :outlined="hover"
                                    :elevation="hover ? 2 : 0"
                                    class="
                                      px-3
                                      post-create-modal-chip
                                      grey-light
                                      mr-sm-0 mr-1
                                    "
                                    v-on="on"
                                  >
                                    <v-icon class="mr-2" size="21px">
                                      {{ getPrivacyIcon(postModel.type) }}
                                    </v-icon>
                                    <span
                                      class="
                                        text-capitalize
                                        font-weight-medium font-15
                                        mr-1
                                      "
                                    >
                                      {{ getPrivacyTitle(postModel.type) }}
                                    </span>
                                    <v-icon size="25px" right class="ml-n1">
                                      {{ mdiChevronDown }}
                                    </v-icon>
                                  </v-chip>
                                </v-hover>
                              </template>
                              <v-radio-group
                                v-model="postModel.type"
                                hide-details
                                class="pt-0 ma-0"
                              >
                                <v-list>
                                  <v-list-item>
                                    <v-icon size="28px" left>
                                      {{ mdiEarth }}
                                    </v-icon>

                                    <v-list-item-content>
                                      <v-list-item-title
                                        >Anyone</v-list-item-title
                                      >
                                      <v-list-item-subtitle
                                        >Anyone on or off
                                        CXBrainstorm</v-list-item-subtitle
                                      >
                                    </v-list-item-content>
                                    <v-radio
                                      value="public"
                                      color="primary"
                                    ></v-radio>
                                  </v-list-item>

                                  <v-list-item>
                                    <v-icon size="28px" left>
                                      {{ mdiHumanGreetingProximity }}
                                    </v-icon>

                                    <v-list-item-content>
                                      <v-list-item-title
                                        >Connections only</v-list-item-title
                                      >
                                      <v-list-item-subtitle
                                        >Connections on
                                        CXBrainstorm</v-list-item-subtitle
                                      >
                                    </v-list-item-content>
                                    <v-radio
                                      value="private"
                                      color="primary"
                                    ></v-radio>
                                  </v-list-item>
                                </v-list>
                              </v-radio-group>
                            </v-menu>
                          </div>
                        </div>

                        <ActiveInactiveDialog
                          v-model="postModel.status"
                          class="active-toggle"
                          hide-details
                        />
                      </v-toolbar>
                    </v-card-subtitle>
                    <v-card-text class="pb-0 px-sm-4 px-0">
                      <b-text
                        v-model.trim="postModel.title"
                        rules="required|min:10|max:180"
                        vid="title"
                        label="Post Title"
                        hide-details
                        @blur="checkSlug"
                        @keypress.enter.native.prevent
                      />
                      <b-text-area
                        v-model.trim="postModel.content"
                        rules="required|min:10|max:1294"
                        vid="content"
                        hide-details
                        placeholder="What do you want to talk about?"
                        auto-grow
                      />
                      <div v-show="postFeatures.length">
                        <PostFeatures
                          id="postFeatures"
                          :post-features="postFeatures"
                          :post-editable="true"
                          :user-info="postModel"
                          class="pt-2"
                          @edit="editPostFeature($event)"
                          @remove="removeFeature($event)"
                        />
                      </div>
                    </v-card-text>
                    <v-divider />
                    <v-card-actions
                      v-if="postModel.data"
                      class="d-flex justify-space-between"
                    >
                      <v-btn
                        text
                        :disabled="
                          !!(
                            postModel.data.videos.length ||
                            postModel.data.documents.length
                          )
                        "
                        @click="openPostDialog('images')"
                      >
                        <v-icon color="blue darken-2" left size="24">
                          {{ mdiImageArea }}
                        </v-icon>
                        <span class="d-md-block d-none"> Photo</span>
                      </v-btn>
                      <v-btn
                        text
                        :disabled="
                          !!(
                            postModel.data.images.length ||
                            postModel.data.documents.length
                          )
                        "
                        @click="openPostDialog('videos')"
                      >
                        <v-icon color="orange darken-2" left size="24">
                          {{ mdiPlayBoxOutline }}
                        </v-icon>
                        <span class="d-md-block d-none"> Video</span>
                      </v-btn>

                      <v-btn
                        text
                        :disabled="
                          !!(
                            postModel.data.images.length ||
                            postModel.data.videos.length
                          )
                        "
                        @click="openPostDialog('documents')"
                      >
                        <v-icon color="blue-grey darken-2" left size="24">
                          {{ mdiFileDocument }}
                        </v-icon>
                        <span class="d-md-block d-none"> Document</span>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-spacer />
                  <v-btn outlined @click="$router.push('/feed')">
                    Cancel
                  </v-btn>
                  <v-btn
                    :loading="processing"
                    class="primary"
                    type="submit"
                    :disabled="invalid"
                  >
                    Update
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </validation-observer>
    <!-- Post Photo Dialog -->
    <v-dialog
      v-model="postDialog"
      max-width="600"
      width="600"
      :loading="processing"
      :scrollable="false"
    >
      <template v-if="postDialogContent === 'images'">
        <PostImageUploader
          id="postImageUploader"
          ref="postImageUploader"
          :edit-feature="editFeature"
          :edit-feature-index="editFeatureIndex"
          @update="updatePostFeature"
          @save="savePostFeatures"
          @remove="removeFeature($event)"
          @close="closePostDialog"
          @cancel="cancelFeatureEdit"
        />
      </template>
      <template v-if="postDialogContent === 'videos'">
        <PostVideoUploader
          id="postVideoUploader"
          ref="postVideoUploader"
          @save="savePostFeatures"
          @remove="removeFeature($event)"
          @close="closePostDialog"
        />
      </template>
      <template v-if="postDialogContent === 'documents'">
        <PostDocumentUploader
          id="postDocumentUploader"
          ref="postDocumentUploader"
          :edit-feature="editFeature"
          :edit-feature-index="editFeatureIndex"
          @update="updatePostFeature"
          @save="savePostFeatures"
          @remove="removeFeature($event)"
          @close="closePostDialog"
        />
      </template>
    </v-dialog>
    <!-- END Post DIALOG -->
    <Confirm ref="confirm" />
  </div>
</template>

<script>
import { format } from 'date-fns';
import {
  mdiCalendar,
  mdiPlus,
  mdiDelete,
  mdiPencil,
  mdiClose,
  mdiPencilBoxOutline,
  mdiImageArea,
  mdiFileDocument,
  mdiPlayBoxOutline,
  mdiAccountMultiple,
  mdiMenuDownOutline,
  mdiArrowRight,
  mdiEarth,
  mdiChevronDown,
  mdiHumanGreetingProximity,
} from '@mdi/js';

export default {
  name: 'EditFeedPost',
  middleware: 'auth',
  async asyncData({ app, params, redirect }) {
    try {
      const response = await app.$axios.$get(`api/get-post/${params.slug}`);
      return {
        postModel: Object.assign({}, response),
      };
    } catch (e) {
      redirect('/feed');
    }
  },
  data() {
    const defaultPost = Object.freeze({
      content: null,
      data: [],
      datetime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      type: 'public',
      title: '',
      slug: '',
      status: 'active',
    });

    return {
      isHydrated: false,
      language: 'en',
      postModel: Object.assign({}, defaultPost),
      postPrivacySettings: {
        public: mdiEarth,
        private: mdiAccountMultiple,
      },
      processing: false,
      postDialog: false,
      postDialogContent: null,
      privacySettings: null,
      loading: false,
      editFeatureIndex: -1,
      editFeatureType: null,
      mdiCalendar,
      mdiPlus,
      mdiPencil,
      mdiDelete,
      mdiClose,
      mdiPencilBoxOutline,
      mdiImageArea,
      mdiFileDocument,
      mdiPlayBoxOutline,
      mdiAccountMultiple,
      mdiMenuDownOutline,
      mdiArrowRight,
      mdiChevronDown,
      mdiHumanGreetingProximity,
      mdiEarth,
    };
  },
  head() {
    return {
      title: `Edit - ${this.postModel.title}`,
    };
  },
  computed: {
    oggedIn() {
      return this.$auth.loggedIn;
    },
    authUser() {
      return this.$auth.user;
    },
    username() {
      return this.$auth.user.username;
    },
    userAvatar() {
      return 'something';
      // return this.$auth.user.name.split(' ').map((name) => name.charAt(0).toUpperCase());
    },
    editFeature() {
      return this.editFeatureIndex > -1
        ? this.postModel.data[this.editFeatureType][this.editFeatureIndex]
        : {};
    },
    postFeatures() {
      let postFeatures = [];
      if (this.postModel && this.postModel.data) {
        if (this.postModel.data.images.length) {
          postFeatures = this.postModel.data.images;
        } else if (this.postModel.data.documents.length) {
          postFeatures = this.postModel.data.documents;
        } else if (this.postModel.data.videos.length) {
          postFeatures = this.postModel.data.videos;
        }
      }

      return postFeatures;
    },
    autoStringLimit() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 7;
        case 'sm':
          return 15;
        default:
          return 30;
      }
    },
    breakpoint() {
      return this.isHydrated ? this.$vuetify.breakpoint : { mdAndDown: false };
    },
  },
  mounted() {
    this.isHydrated = true;
  },
  methods: {
    // get privacy icon
    getPrivacyIcon(value) {
      return this.postPrivacySettings[value];
    },
    // get privacy title
    getPrivacyTitle(value) {
      return value === 'public' ? 'Anyone' : 'Connections only';
    },
    openPostDialog(content) {
      this.postDialogContent = content;
      this.postDialog = true;
    },
    savePostFeatures(event) {
      event.files.forEach((file) => {
        const updatedFeature = Object.assign(file, { updated: true });
        this.postModel.data[this.postDialogContent].push(updatedFeature);
      });
      this.$nextTick(() => {
        this.postDialog = false;
      });
    },
    editPostFeature(event) {
      this.editFeatureIndex = event.index;
      this.editFeatureType = `${event.type}s`;
      this.$nextTick(() => {
        this.postDialog = true;
        this.postDialogContent = this.editFeatureType;
      });
    },
    updatePostFeature(event) {
      const updatedFeature = Object.assign(event.feature, { updated: true });
      this.postModel.data[this.editFeatureType].splice(
        this.editFeatureIndex,
        1,
        updatedFeature
      );
      this.$nextTick(() => {
        this.editFeatureIndex = -1;
        this.editFeatureType = null;
        this.postDialog = false;
      });
    },
    cancelFeatureEdit() {
      this.editFeatureType = null;
      this.editFeatureIndex = -1;
      this.postDialog = false;
    },
    getFileExtenstion(filename) {
      return filename.split('.').pop();
    },

    getFileName(filepath) {
      return filepath.split('/').pop();
    },
    savePostVideo() {
      this.$set(this.postModel.data, 0, event.feature);
      this.$nextTick(() => {
        this.editFeatureType = null;
        this.postDialog = false;
      });
    },
    async removeFeature(event) {
      if (!event.type === 'video') {
        const source = this.postModel.data[`${event.type}s`][event.index].data;
        await this.$axios.$post(`api/common/asset-file`, {
          source,
        });
      }
      if (this.postModel.data[`${event.type}s`] !== undefined) {
        this.postModel.data[`${event.type}s`].splice(event.index, 1);
      }
    },
    // check slug
    async checkSlug() {
      try {
        const { slug } = await this.$axios.$get(
          `api/check-post-slug/${encodeURIComponent(this.postModel.title)}`
        );

        this.postModel.slug = slug;
      } catch (e) {
        this.postModel.slug = null;
      }
    },
    async savePost() {
      this.processing = true;
      try {
        await this.$axios.$post(
          `api/feed/post/${this.postModel.id}`,
          this.postModel
        );
        this.processing = false;
        this.$store.dispatch('crud_success', {
          message: 'Post successfully updated',
          path: `/${this.username}`,
        });
      } catch (err) {
        this.processing = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
    closePostDialog() {
      if (this.postModel.data.length) {
        this.$refs.confirm
          .open(
            'Discard your post!',
            "You didn't complete your post. Do you want to discard your post?",
            { color: 'primary' }
          )
          .then((res) => {
            if (!res) {
              return false;
            }
          });
      }
      // close post modal
      this.$nextTick(() => {
        this.postDialog = false;
        this.postDialogContent = null;
        // reset post modal
      });
    },
    confirmDiscardPost() {
      this.$refs.confirm
        .open(
          'Discard your post!',
          "You didn't complete your post. Do you want to discard your post?",
          { color: 'primary' }
        )
        .then((res) => res);
    },
    resetPostModel() {
      this.postModel = {
        content: null,
        data: [],
        datetime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        type: 'public',
        status: 'active',
      };
    },
  },
};
</script>
