<template>
  <div id="profile">
    <v-container>
      <v-row justify="center">
        <v-col v-if="user" cols="12" md="3" class="d-none d-sm-inline-block">
          <user-profile-card
            :card-data="user"
            :show-edit="false"
            @updateUserProfile="updateUserProfile"
          />
          <v-card class="overflow-hidden rounded-lg" outlined>
            <v-subheader class="feed_sub-header"> Bio </v-subheader>
            <v-divider />
            <v-card-subtitle>
              {{ user.bio ? user.bio : 'No Data Found!' }}
            </v-card-subtitle>
          </v-card>
          <div class="w-full sticky-top">
            <!-- START JOURNEY PAGES USER FOLLOW -->
            <v-card
              class="my-2 overflow-auto rounded-lg custom-scrollbar"
              :style="{ height: jourenyPageHeightAuto }"
              outlined
            >
              <v-list tile class="py-0">
                <v-subheader class="feed_sub-header"
                  >Journey Pages I Follow
                </v-subheader>
                <v-divider />
                <v-list-item-group color="primary">
                  <v-list-item
                    v-for="(item, i) in joureny_pages"
                    :key="i"
                    :to="getJourneyLink(item)"
                    nuxt
                  >
                    <v-list-item-icon
                      class="my-2"
                      :class="item.image ? 'mr-4' : 'mr-3'"
                    >
                      <v-img
                        v-if="item.image"
                        :src="item.image"
                        width="35"
                        height="35"
                      />
                      <v-icon v-else size="39">
                        {{ mdiFire }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="font-14" v-text="item.title" />
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="jurneyPageShowLessMore"
                    @click="getJourneyPages(false)"
                  >
                    <v-list-item-icon class="seemore-icon mr-4 my-2">
                      <v-progress-circular
                        v-if="loading_journey_pages"
                        width="2"
                        size="20"
                        indeterminate
                      />
                      <v-icon v-else size="28"> {{ mdiChevronUp }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content
                      class="font-14 font-weight-regular text--text"
                      >Show less</v-list-item-content
                    >
                  </v-list-item>
                  <v-list-item v-else @click="getJourneyPages(true)">
                    <v-list-item-icon class="seemore-icon mr-4 my-2">
                      <v-progress-circular
                        v-if="loading_journey_pages"
                        width="2"
                        size="20"
                        indeterminate
                      />
                      <v-icon v-else size="28"> {{ mdiChevronDown }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content
                      class="font-14 font-weight-regular text--text"
                      >Show more</v-list-item-content
                    >
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
            <!-- END JOURNEY PAGES USER FOLLOW -->
          </div>
        </v-col>

        <!-- create post section -->
        <v-col cols="12" md="6">
          <template v-if="loading_post">
            <v-skeleton-loader
              type="list-item-avatar-two-line, actions"
              class="rounded-0 mb-4"
            />
            <v-skeleton-loader
              type="list-item-avatar-two-line,card"
              class="rounded-0"
            />
          </template>
          <v-fade-transition v-else group>
            <v-card v-if="user" :key="'post'" class="mb-2 rounded-lg" outlined>
              <v-card-text class="d-flex align-center justify-space-between">
                <v-avatar size="42" class="mr-4">
                  <img v-if="authUser.image"  :src="authUser && authUser.image? authUser.image : $store.state.defaultProfileImage" :alt="authUser.name"/>
                </v-avatar>
                <v-text-field
                  placeholder="Start a Post"
                  outlined
                  rounded
                  hide-details
                  readonly
                  single-line
                  dense
                  @click="openPostDialog('post')"
                ></v-text-field>
              </v-card-text>
              <v-card-actions
                class="flex-wrap pb-4 pt-0 px-6 justify-space-between"
              >
                <div
                  class="cursor-pointer d-flex align-center"
                  @click="openPostDialog('image')"
                >
                  <svg
                    width="25"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24.97 19.63"
                  >
                    <defs>
                      <style>
                        .cls-image-post-1 {
                          fill: #2b7dfe;
                        }
                        .cls-image-post-2 {
                          fill: #2b7efe;
                        }
                      </style>
                    </defs>
                    <g id="Layer_2" data-name="Layer 2">
                      <g id="Layer_1-2" data-name="Layer 1">
                        <path
                          class="cls-image-post-1"
                          d="M24.93,1.25a1.23,1.23,0,0,0-.66-1,1.82,1.82,0,0,0-1-.26H1.5A1.65,1.65,0,0,0,.32.6,1.43,1.43,0,0,0,0,1.67V18a1.45,1.45,0,0,0,.62,1.3,1.78,1.78,0,0,0,1,.32H23.52a1.68,1.68,0,0,0,1.14-.57,1.61,1.61,0,0,0,.31-.86V1.44A.43.43,0,0,1,24.93,1.25ZM23.38,12.92v.22c-.12,0-.17-.08-.23-.14l-2.86-2.6a1.18,1.18,0,0,0-1.13-.29,1.25,1.25,0,0,0-.59.36c-1,1-2,1.95-2.93,2.94-.14.15-.21.13-.34,0l-6-7.14a1.21,1.21,0,0,0-2,0l-5.51,6.4c-.05.06-.09.14-.18.16s0-.17,0-.25c0-3.52,0-7,0-10.55,0-.24.06-.31.31-.31q10.59,0,21.18,0c.21,0,.3,0,.3.28Q23.38,7.45,23.38,12.92Z"
                        />
                        <path
                          class="cls-image-post-2"
                          d="M18.82,8A2.18,2.18,0,1,1,21,5.87,2.18,2.18,0,0,1,18.82,8Z"
                        />
                      </g>
                    </g>
                  </svg>
                  <span class="ml-3 hide_more_small">Photo</span>
                </div>

                <div
                  class="cursor-pointer d-flex align-center"
                  @click="openPostDialog('video')"
                >
                  <svg
                    width="25"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24.94 19"
                  >
                    <defs>
                      <style>
                        .cls-video-post-1 {
                          fill: #fe9b1d;
                        }
                      </style>
                    </defs>
                    <g id="Layer_2" data-name="Layer 2">
                      <g id="Layer_1-2" data-name="Layer 1">
                        <path
                          class="cls-video-post-1"
                          d="M24.94,3.67A3.65,3.65,0,0,0,21.28,0H3.67A3.67,3.67,0,0,0,.11,2.75c0,.15-.07.31-.11.47V15.78s0,.06,0,.09A3.65,3.65,0,0,0,3.72,19H21.28a3.65,3.65,0,0,0,3.66-3.67C25,11.44,25,7.56,24.94,3.67ZM23.48,15.22a2.19,2.19,0,0,1-2.32,2.32H3.79a2.2,2.2,0,0,1-2.33-2.33V3.78A2.19,2.19,0,0,1,3.78,1.46H21.15A2.2,2.2,0,0,1,23.48,3.8Z"
                        />
                        <path
                          class="cls-video-post-1"
                          d="M16.41,8.82,10.74,5.27A.74.74,0,0,0,9.55,6v7.11a.76.76,0,0,0,.38.73.71.71,0,0,0,.8-.06l5.69-3.55A.74.74,0,0,0,16.41,8.82Zm-5.39,3V7.17L14.75,9.5Z"
                        />
                      </g>
                    </g>
                  </svg>
                  <span class="ml-3 hide_more_small">Video</span>
                </div>

                <div
                  class="cursor-pointer d-flex align-center"
                  @click="openPostDialog('document')"
                >
                  <v-icon color="blue-grey darken-2" left size="24">
                    {{ mdiFileDocument }}
                  </v-icon>
                  <span class="hide_more_small">Document</span>
                </div>

                <!-- <v-btn text @click="openPostDialog('document')">
                  <v-icon color="blue-grey darken-2" left size="24">
                    {{ mdiFileDocument }}
                  </v-icon>
                  Document
                </v-btn> -->
              </v-card-actions>
            </v-card>
            <!-- feed post -->
            <div v-for="(post, i) in posts" :key="'feed_post_' + post.id">
              <FeedPostCard
                :post="post"
                :index="i"
                @delete-reaction="deleteReaction"
                @update-reaction="updateReaction"
                @comments-count-updated="commentsCountUpdated"
                @toggle-comment-box="toggleCommentBox(post, i)"
                @post-delete="showConfirmDelete"
              />
            </div>
          </v-fade-transition>
        </v-col>

        <v-col cols="12" md="3">
          <!-- START MOST POPULAR POSTS -->
          <popular-posts-carousel
            :loading="loading_cx_journies"
            :posts="cx_journies"
            url="/cx-brainstorm"
            title="Most Popular Journey Pages"
          />
          <!-- END MOST POPULAR POSTS -->
          <!-- START MOST POPULAR POSTS -->
          <popular-posts-carousel
            :loading="loading_journies"
            :posts="map_journies"
            url="/cx-brainstorm"
            title="Most Popular Journey Maps"
            class="mt-2"
            ratio="1.78"
          />
          <!-- END MOST POPULAR POSTS -->

          <div class="w-full sticky-top z-index-3 background mt-2">
            <!-- START MOST POPULAR POSTS -->
            <ad-card :footer="true">
              <adsbygoogle ad-slot="6757125591" ad-format="auto" />
            </ad-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Post Photo Dialog -->
    <v-dialog
      v-model="postDialog"
      attach="#profile"
      max-width="770"
      width="600"
      persistent
      :content-class="breakpoint.xsOnly ? 'mx-1' : ''"
      :loading="processing"
      class="z-index-10000"
    >
      <template v-if="postDialogContent === 'post'">
        <v-card class="h-100 px-xs-0 rounded-lg">
          <validation-observer ref="form" v-slot="{ handleSubmit, reset }">
            <v-form
              @reset.prevent="reset"
              @submit.prevent="handleSubmit(savePost)"
            >
              <v-card-title
                class="
                  justify-space-between
                  flex-nowrap
                  primary
                  white--text
                  pr-2
                "
              >
                <div class="keep-word text-h6">Create a post</div>
                <v-btn
                  icon
                  dark
                  class="ma-0"
                  @click.stop="closePostDialogModal"
                >
                  <v-icon size="30">{{ mdiClose }}</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text :loading="processing" class="px-0 pb-0">
                <v-card flat :scrollable="false" class="pa-0 px-xs-0">
                  <v-card-subtitle
                    class="py-0 mt-4 mb-1 w-100 d-flex align-center"
                    :class="breakpoint.smAndUp ? 'flex-nowrap' : 'flex-wrap'"
                  >
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
                                  ? authUser.name.substr(0, autoStringLimit) +
                                    '...'
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
                                  px-2
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
                                  <v-list-item-title>Anyone</v-list-item-title>
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
                      class="mt-0 active-toggle"
                      hide-details
                    />
                  </v-card-subtitle>
                  <v-card-text class="pb-0 mt-4">
                    <b-text
                      v-model="postModel.title"
                      rules="required|min:10|max:180"
                      vid="title"
                      label="Add your post title"
                      @keyup="checkSlug"
                    />
                    <div class="my-0"></div>
                    <b-text-area
                      v-model="postModel.content"
                      class="mt-0"
                      rules="required|min:10|max:1294"
                      vid="content"
                      label="Add a description"
                      placeholder="What do you want to talk about?"
                      auto-grow
                    />
                    <!-- link preview -->

                    <link-preview
                      v-if="findUrl(postModel.content) && postModel.preview"
                      :url="findUrl(postModel.content)"
                      :view-close-icon="postModel.preview"
                      @preview-link="previewLink"
                    />

                    <PostFeatures
                      v-show="postModel.files.length"
                      id="postFeatures"
                      :post-features="postModel.files"
                      :post-editable="true"
                      :photo-edit="true"
                      :user-info="postModel"
                      @edit="editPostFeature($event.index, $event.type)"
                      @remove="removeFeature($event.index, $event.type)"
                    />
                  </v-card-text>
                </v-card>
              </v-card-text>
              <v-divider class="mt-1" />

              <v-card-actions class="py-0">
                <v-card-actions
                  class="flex-wrap justify-space-between"
                  :class="postModel.files.length ? 'py-6' : ''"
                >
                  <v-btn
                    v-show="!postModel.files.length"
                    icon
                    @click="openPostDialog('image')"
                  >
                    <svg
                      width="25"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24.97 19.63"
                    >
                      <defs>
                        <style>
                          .cls-image-post-1 {
                            fill: #2b7dfe;
                          }
                          .cls-image-post-2 {
                            fill: #2b7efe;
                          }
                        </style>
                      </defs>
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                          <path
                            class="cls-image-post-1"
                            d="M24.93,1.25a1.23,1.23,0,0,0-.66-1,1.82,1.82,0,0,0-1-.26H1.5A1.65,1.65,0,0,0,.32.6,1.43,1.43,0,0,0,0,1.67V18a1.45,1.45,0,0,0,.62,1.3,1.78,1.78,0,0,0,1,.32H23.52a1.68,1.68,0,0,0,1.14-.57,1.61,1.61,0,0,0,.31-.86V1.44A.43.43,0,0,1,24.93,1.25ZM23.38,12.92v.22c-.12,0-.17-.08-.23-.14l-2.86-2.6a1.18,1.18,0,0,0-1.13-.29,1.25,1.25,0,0,0-.59.36c-1,1-2,1.95-2.93,2.94-.14.15-.21.13-.34,0l-6-7.14a1.21,1.21,0,0,0-2,0l-5.51,6.4c-.05.06-.09.14-.18.16s0-.17,0-.25c0-3.52,0-7,0-10.55,0-.24.06-.31.31-.31q10.59,0,21.18,0c.21,0,.3,0,.3.28Q23.38,7.45,23.38,12.92Z"
                          />
                          <path
                            class="cls-image-post-2"
                            d="M18.82,8A2.18,2.18,0,1,1,21,5.87,2.18,2.18,0,0,1,18.82,8Z"
                          />
                        </g>
                      </g>
                    </svg>
                  </v-btn>

                  <v-btn
                    v-show="!postModel.files.length"
                    icon
                    @click="openPostDialog('video')"
                  >
                    <svg
                      width="25"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24.94 19"
                    >
                      <defs>
                        <style>
                          .cls-video-post-1 {
                            fill: #fe9b1d;
                          }
                        </style>
                      </defs>
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                          <path
                            class="cls-video-post-1"
                            d="M24.94,3.67A3.65,3.65,0,0,0,21.28,0H3.67A3.67,3.67,0,0,0,.11,2.75c0,.15-.07.31-.11.47V15.78s0,.06,0,.09A3.65,3.65,0,0,0,3.72,19H21.28a3.65,3.65,0,0,0,3.66-3.67C25,11.44,25,7.56,24.94,3.67ZM23.48,15.22a2.19,2.19,0,0,1-2.32,2.32H3.79a2.2,2.2,0,0,1-2.33-2.33V3.78A2.19,2.19,0,0,1,3.78,1.46H21.15A2.2,2.2,0,0,1,23.48,3.8Z"
                          />
                          <path
                            class="cls-video-post-1"
                            d="M16.41,8.82,10.74,5.27A.74.74,0,0,0,9.55,6v7.11a.76.76,0,0,0,.38.73.71.71,0,0,0,.8-.06l5.69-3.55A.74.74,0,0,0,16.41,8.82Zm-5.39,3V7.17L14.75,9.5Z"
                          />
                        </g>
                      </g>
                    </svg>
                  </v-btn>

                  <v-btn
                    v-show="!postModel.files.length"
                    icon
                    @click="openPostDialog('document')"
                  >
                    <v-icon
                      class="ml-2"
                      color="blue-grey darken-2"
                      left
                      size="24"
                      >{{ mdiFileDocument }}</v-icon
                    >
                  </v-btn>
                </v-card-actions>
                <v-spacer />
                <v-btn
                  :loading="processing"
                  height="30px"
                  class="px-6 mr-2 text-capitalize"
                  color="primary"
                  type="submit"
                  rounded
                  :disabled="postButtonStatus"
                >
                  Post
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card>
      </template>
      <template v-else-if="postDialogContent === 'image'">
        <PostImageUploader
          id="postImageUploader"
          ref="postImageUploader"
          :edit-feature="editFeature"
          :edit-feature-index="editFeatureIndex"
          @update="updatePostFeature"
          @save="savePostFeatures"
          @remove="removeFeature"
          @close="closePostDialog"
          @cancel="cancelFeatureEdit"
        />
      </template>
      <template v-if="postDialogContent === 'video'">
        <PostVideoUploader
          id="postVideoUploader"
          ref="postVideoUploader"
          @save="savePostFeatures"
          @remove="removeFeature"
          @close="closePostDialog"
        />
      </template>
      <template v-if="postDialogContent === 'document'">
        <PostDocumentUploader
          id="postDocumentUploader"
          ref="postDocumentUploader"
          :edit-feature="editFeature"
          :edit-feature-index="editFeatureIndex"
          @update="updatePostFeature"
          @save="savePostFeatures"
          @remove="removeFeature"
          @close="closePostDialog"
        />
      </template>
    </v-dialog>
    <!-- END Post DIALOG -->

    <Confirm ref="confirm" />
  </div>
</template>

<script>
import groupBy from 'lodash.groupby';
import { mapState } from 'vuex';
import {
  mdiAccountArrowLeft,
  mdiAccountArrowRight,
  mdiBookOpenVariant,
  mdiHeadQuestion,
  mdiFileQuestion,
  mdiCommentQuestion,
  mdiShareVariant,
  mdiThumbUpOutline,
  mdiCommentTextOutline,
  mdiAccountEdit,
  mdiFire,
  mdiPencilBoxOutline,
  mdiImageArea,
  mdiFileDocument,
  mdiPlayBoxOutline,
  mdiClose,
  mdiAccountMultiple,
  mdiMenuDownOutline,
  mdiPencil,
  mdiDelete,
  mdiDotsVertical,
  mdiArrowRight,
  mdiEarth,
  mdiCircleMedium,
  mdiHumanGreetingProximity,
  mdiImageMultiple,
  mdiFileDocumentOutline,
  mdiChevronDown,
  mdiChevronUp,
} from '@mdi/js';
import { format, parseISO } from 'date-fns';
import * as debounce from 'lodash.debounce';
export default {
  name: 'FeedPage',
  async asyncData({ $auth, $axios }) {
    try {
      const { data } = await $axios.$get(`api/get-user/${$auth.user.username}`);
      return {
        user: data,
      };
    } catch (e) {}
  },
  data() {
    return {
      menu: 0,
      isHydrated: false,
      user: null,
      chatUser: null,
      activeClass: 0,
      menus: [
        {
          text: 'Page 1',
          icon: mdiBookOpenVariant,
        },
        {
          text: 'Page 2',
          icon: mdiHeadQuestion,
        },
        {
          text: 'Page 3',
          icon: mdiFileQuestion,
        },
        {
          text: 'Page 4',
          icon: mdiCommentQuestion,
        },
      ],
      groups: [
        {
          text: 'Group 1',
          icon: mdiBookOpenVariant,
        },
        {
          text: 'Group 2',
          icon: mdiHeadQuestion,
        },
        {
          text: 'Group 3',
          icon: mdiFileQuestion,
        },
        {
          text: 'Group 4',
          icon: mdiCommentQuestion,
        },
      ],
      privacySettings: null,
      postModel: {
        content: null,
        files: [],
        datetime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        type: 'public',
        title: '',
        slug: '',
        status: 'active',
        preview: 1,
      },
      postButtonStatus: true,
      postPrivacySettings: {
        public: mdiEarth,
        private: mdiAccountMultiple,
      },
      carousel: false,
      processing: false,
      postDialog: false,
      postDialogContent: null,
      editFeatureIndex: null,
      posts: [],
      type: '',
      loading_post: false,
      current_page: 1,
      last_page: 0,
      load_more: false,
      loading_journies: false,
      loading_cx_journies: false,

      map_journies: [],
      cx_journies: [],
      joureny_pages_number: 0,
      joureny_pages: [],
      currentJourenyPage: 1,
      jurneyPageShowLessMore: false,
      loading_journey_pages: false,
      mdiAccountArrowLeft,
      mdiAccountArrowRight,
      mdiShareVariant,
      mdiThumbUpOutline,
      mdiCommentTextOutline,
      mdiAccountEdit,
      mdiFire,
      mdiPencilBoxOutline,
      mdiImageArea,
      mdiFileDocument,
      mdiPlayBoxOutline,
      mdiClose,
      mdiAccountMultiple,
      mdiMenuDownOutline,
      mdiPencil,
      mdiDelete,
      mdiDotsVertical,
      mdiArrowRight,
      mdiEarth,
      mdiCircleMedium,
      mdiHumanGreetingProximity,
      mdiImageMultiple,
      mdiFileDocumentOutline,
      mdiChevronDown,
      mdiChevronUp,
      widowHeight: 0,
    };
  },
  computed: {
    ...mapState('online', ['messagingChatUsers']),
    ...mapState('chat', ['singleChatUsers']),
    loggedIn() {
      return this.$auth.loggedIn;
    },
    authUser() {
      return this.$auth ? this.$auth.user : '';
    },
    username() {
      return this.$auth.user.username;
    },
    editFeature() {
      return this.editFeatureIndex || this.editFeatureIndex === 0
        ? this.postModel.files[this.editFeatureIndex]
        : {};
    },
    breakpoint() {
      return this.isHydrated
        ? this.$vuetify.breakpoint
        : { smAndUp: true, xsOnly: false };
    },
    jourenyPageHeightAuto() {
      return this.joureny_pages.length * 51 + 40 + 48 + 8 > this.widowHeight
        ? this.widowHeight + 'px'
        : this.joureny_pages.length * 51 + 40 + 48 + 8 + 'px';
    },
    autoStringLimit() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 7;
        default:
          return 30;
      }
    },
  },
  created() {
    this.$nuxt.$on('getLatestPosts', async () => {
      this.current_page = 1;
      await this.getUserPosts();
    });
  },
  async mounted() {
    this.widowHeight = (window.innerHeight * 500) / 576;

    this.isHydrated = true;
    await this.getUserPosts();
    await this.getPopularJournies();
    await this.getPopularCXJournies();
    await this.getJourneyPages(true);
    await this.getChatUsers();

    // auto scroll pagination
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    updateUserProfile(userData) {
      this.user = userData;
      this.posts.map((item) => {
        item.user.image = userData.image;
        item.user.cover_image = userData.cover_image;
        item.user = userData;
        return item;
      });
    },
    async getChatUsers() {
      if (this.loggedIn) {
        await this.$store.dispatch('online/getChatUsers');
        if (this.messagingChatUsers.length > 0 && this.messagingChatUsers) {
          if (!this.$vuetify.breakpoint.smAndDown) {
            this.selectUserToChat(this.messagingChatUsers[0].user, 0);
          }
        }
      }
    },

    async selectUserToChat(chatUser, index) {
      this.chatUser = chatUser;
      this.activeClass = index;
      if (chatUser) {
        await this.getMessages();
        // join in chat room
        await this.$store.dispatch('online/joinChatRoom', {
          userId: chatUser.id,
        });
        await this.$store.dispatch('online/unseenMessageCount', {
          user: chatUser,
        });
      }
    },

    // get message
    async getMessages() {
      this.processing = true;
      try {
        const { data, connectionId } = await this.$axios.$get(
          `api/message/${this.chatUser.id}`,
          {
            params: {
              limit: 100,
            },
          }
        );

        this.connectionId = connectionId;
        const allMessages = data.reverse().map((e) => {
          e.date = format(parseISO(e.created_at), 'yyyy-MM-dd');
          return e;
        });
        const messages = groupBy(allMessages, 'date');
        this.$store.commit('online/GET_CONNECTION_MESSAGES', {
          connectionId,
          userId: this.chatUser.id,
          user: this.chatUser,
          messages,
        });
        this.processing = false;
      } catch (e) {
        this.processing = false;
      }
    },

    // get privacy icon
    getPrivacyIcon(value) {
      return this.postPrivacySettings[value];
    },
    // get privacy title
    getPrivacyTitle(value) {
      return value === 'public' ? 'Anyone' : 'Connections only';
    },

    // get edit page url
    getEditUrl(post) {
      switch (post.type) {
        case 'public':
          return `/feed/${post.slug}`;
        case 'private':
          return `/feed/${post.slug}`;
        default:
          return `/posts/${post.slug}/edit`;
      }
    },
    openPostDialog(content) {
      this.postDialogContent = content;
      setTimeout(() => (this.postDialog = true), 100);
    },
    savePostFeatures(event) {
      event.files.forEach((file) => {
        this.postModel.files.push(file);
      });
      this.$nextTick(() => {
        this.postDialogContent = 'post';
      });
    },
    editPostFeature(index, type) {
      this.editFeatureIndex = index;
      this.$nextTick(() => {
        this.postDialogContent = type;
      });
    },
    updatePostFeature(event) {
      this.postModel.files.splice(this.editFeatureIndex, 1, event.feature);
      this.$nextTick(() => {
        this.editFeatureIndex = null;
        this.postDialogContent = 'post';
      });
    },
    cancelFeatureEdit() {
      this.editFeatureIndex = null;
      this.postDialogContent = 'post';
    },
    getFileExtenstion(filename) {
      return filename.split('.').pop();
    },

    getFileName(filepath) {
      return filepath.split('/').pop();
    },
    savePostVideo() {
      this.$set(this.postModel.files, 0, event.feature);
      this.$nextTick(() => {
        this.postDialogContent = 'post';
      });
    },
    removeFeature(index = -1) {
      this.postModel.files.splice(index, 1);
    },
    // to generate slug
    checkSlug: debounce(async function () {
      if (this.findUrl(this.postModel.title)) {
        this.$store.commit('APP_NETWORK_ERROR', 'Please type a valid title');
      } else {
        try {
          const { slug } = await this.$axios.$get(
            `api/check-post-slug/${encodeURIComponent(this.postModel.title)}`
          );

          this.postModel.slug = slug;
          this.postButtonStatus = false;
        } catch (e) {
          this.postButtonStatus = true;
          this.postModel.slug = null;
        }
      }
    }, 300),

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
    async savePost() {
      this.processing = true;
      try {
        const isoDateString = new Date().toISOString();
        this.postModel.datetime = isoDateString;

        const { post } = await this.$axios.$post(
          `api/feed/post`,
          this.postModel
        );
        post.seeMore = false;
        this.posts.unshift(post);
        // this.$set(this.posts, 0, post);
        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Post successfully created'
        );
        this.processing = false;
        this.postButtonStatus = true;
        this.resetPostModel();
        this.$nextTick(() => {
          this.postDialog = false;
          this.postDialogContent = null;
        });
      } catch (err) {
        if (err.response.status === 422 && err.response.data.errors.slug[0]) {
          this.$store.commit('APP_NETWORK_ERROR', 'Please type a valid title');
        } else {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
        this.processing = false;
      }
    },

    closePostDialog() {
      if (this.postModel.files.length) {
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
            this.resetPostModel();
          });
      }
      this.postDialogContent = 'post';
    },

    closePostDialogModal() {
      this.postModel.preview = 1;
      this.postDialog = false;
      this.resetPostModel();
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
        files: [],
        datetime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        type: 'public',
        status: 'active',
        preview: 1,
      };
    },
    // handle scroll pagination
    handleScroll() {
      const bottom = document.documentElement.getBoundingClientRect().bottom;
      const height = document.documentElement.clientHeight;

      if (bottom < height + 200) {
        // let's add more data
        if (this.current_page < this.last_page) {
          if (!this.load_more) {
            this.current_page++;
            this.loadMore(this.type);
          }
        }
      }
    },
    // get user posts
    async getUserPosts(type) {
      this.loading_post = true;
      try {
        const { data, meta } = await this.$axios.$get(`api/feed/post`, {
          params: {
            page: this.current_page,
            limit: 6,
            type,
          },
        });
        this.loading_post = false;
        data.forEach((item) => {
          item.seeMore = false;
        });
        this.posts = data;
        this.last_page = meta.last_page;
      } catch (e) {}
    },
    // delete message
    showConfirmDelete(postId) {
      this.$refs.confirm
        .open('Delete', 'Are you sure?', { color: 'red' })
        .then((res) => {
          if (res) {
            this.deletePost(postId);
          }
          return false;
        });
    },
    // delete post
    async deletePost(postId) {
      try {
        await this.$axios.$delete(`api/user/post/delete/${postId}`);
        await this.getUserPosts();
        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Post successfully deleted'
        );
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
    // load more
    async loadMore(type) {
      this.load_more = true;
      try {
        const { data } = await this.$axios.$get(`api/feed/post`, {
          params: {
            page: this.current_page,
            limit: 6,
            type,
          },
        });
        this.load_more = false;
        data.forEach((item) => {
          item.seeMore = false;
          this.posts.push(item);
        });
      } catch (e) {}
    },
    // get popular map journey
    async getPopularJournies() {
      this.loading_journies = true;
      try {
        const { data } = await this.$axios.$get(
          `api/brainstorm/map/popular/posts`,
          {
            params: {
              limit: 5,
            },
          }
        );
        this.loading_journies = false;
        this.map_journies = data;
      } catch (e) {}
    },
    // get popular cx map journey
    async getPopularCXJournies() {
      this.loading_cx_journies = true;
      try {
        const { data } = await this.$axios.$get(`api/popular-taxonomy`, {
          params: {
            limit: 5,
          },
        });
        this.loading_cx_journies = false;
        data.forEach((item) => this.cx_journies.push(item));
      } catch (e) {}
    },
    // get journey page link
    getJourneyLink(item) {
      if (item.type === 'subgroup') {
        return `/cx-brainstorm/${item.slug}`;
      } else {
        return `/topics/${item.slug}`;
      }
    },
    // get journey pages
    async getJourneyPages(showMore = true) {
      this.loading_journey_pages = true;
      try {
        const { data } = await this.$axios.$get(`api/feed/group`, {
          params: {
            limit: 5,
            page: showMore ? this.currentJourenyPage : 1,
          },
        });

        if (!showMore) {
          this.joureny_pages = [];
          this.currentJourenyPage = 1;
        }

        if (data.length < 5 || data.length === 0) {
          this.jurneyPageShowLessMore = true;
        } else {
          this.jurneyPageShowLessMore = false;
        }

        this.loading_journey_pages = false;

        data.forEach((item) => {
          this.joureny_pages.push(item);
        });

        this.currentJourenyPage += 1;
      } catch (e) {}
    },
    // toggle comment box
    toggleCommentBox(post, index) {
      post.showComment = !post.showComment;
      this.$set(this.posts, index, post);
    },
    // update comments count
    commentsCountUpdated({ postId, postIndex, count }) {
      // find post
      const post = this.posts.find((_) => _.id === postId);
      if (post) {
        post.comments_count = post.comments_count + count;

        this.$set(this.posts, postIndex, post);
      }
    },
    updateReaction({ post, i, $event }) {
      const index = post.like.findIndex((_) => _.user_id === $event.user_id);
      if (index > -1) {
        post.like.splice(index, 1, {
          post_id: $event.postId,
          reaction: $event.reaction,
          user_id: $event.user_id,
        });
      } else {
        post.likes++;
        post.like.push({
          post_id: $event.postId,
          reaction: $event.reaction,
          user_id: $event.user_id,
        });
      }

      this.$set(this.posts, i, post);
    },
    deleteReaction({ post, i, $event }) {
      const index = post.like.findIndex((_) => _.user_id === $event.user_id);
      if (index > -1) {
        post.likes--;
        post.like.splice(index, 1);
      }
      this.$set(this.posts, i, post);
    },
    postSeeMore(postIndex) {
      this.posts[postIndex].seeMore = !this.posts[postIndex].seeMore;
    },
    previewLink(value) {
      this.postModel.preview = value;
    },
  },
};
</script>
<style>
.see-more-post:hover {
  color: rgb(10 102 194) !important;
  text-decoration: underline !important;
}
</style>
