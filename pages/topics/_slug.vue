<template>
  <div>
    <v-container id="subgroup">
      <v-row class="sticky-top-4 z-index-3 background py-3" justify="center">
        <v-col cols="12" md="6">
          <v-row justify="center" justify-md="end">
            <v-col cols="6" lg="3" md="6" sm="6" class="py-md-0 my-md-0 mb-3">
              <v-autocomplete
                v-model="filter_type"
                :items="[
                  { text: 'Discussion', value: 'discussion' },
                  { text: 'Idea', value: 'idea' },
                  { text: 'Question', value: 'question' },
                ]"
                :prepend-icon="mdiFilterVariant"
                label="Filter By"
                hide-details
                clearable
                class="pa-0 ma-0"
              />
            </v-col>
            <v-col cols="6" lg="3" md="6" sm="6" class="py-md-0 my-md-0 mt-0">
              <v-autocomplete
                v-model="filter_sort"
                :items="[
                  { text: 'Latest', value: 'latest' },
                  { text: 'Popular', value: 'popular' },
                ]"
                :prepend-icon="mdiFilterVariant"
                label="Filter By"
                hide-details
                clearable
                class="pa-0 ma-0"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="mt-0">
        <v-col cols="12" md="3">
          <div class="sticky-top-6">
            <!-- left sidebar -->
            <v-card
              v-if="topics.length > 0"
              class="rounded-lg border-1 overflow-hidden"
              outlined
            >
              <v-list
                class="py-0 custom-scrollbar topic__list-container"
                :style="{ maxHeight: jourenyPageHeightAuto }"
              >
                <template v-for="item in topics.slice(0, topicsLength)">
                  <v-list-item
                    :key="item.id"
                    active-class="primary--text"
                    :to="`/topics/${item.slug}`"
                    nuxt
                  >
                    <v-list-item-icon class="mr-1">
                      <v-icon v-text="mdiFire" />
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.title" />
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <template v-if="topics.length > 5">
                  <v-list-item @click="showAllTopic">
                    <v-list-item-icon class="mr-1 greyLight rounded-pill">
                      <v-icon>{{
                        topics.length === topicsLength
                          ? mdiChevronUp
                          : mdiChevronDown
                      }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      {{
                        topics.length === topicsLength
                          ? 'Less more'
                          : 'See more'
                      }}
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-card>
            <v-skeleton-loader v-else type="list-item-avatar@6" elevation="1" />
          </div>
        </v-col>

        <!-- dynamic posts sections -->
        <v-col cols="12" md="6">
          <div class="sticky-content background z-index-3">
            <v-card v-if="topic" class="mb-2 py-3 rounded-lg" outlined>
              <v-card-title class="cx-card__title relative">
                <h2 class="text-h6 line-height-24 cx-title text--text">
                  {{ topic.title }}
                </h2>
                <v-spacer />
                <div>
                  <template v-if="topic.isFollowing">
                    <v-btn
                      class="px-5 text-transform-initial"
                      rounded
                      color="primary"
                      :loading="following"
                      @click="followTaxonomy"
                    >
                      Following
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn
                      class="white--text px-8 text-transform-initial"
                      rounded
                      color="primary"
                      elevation="0"
                      :loading="following"
                      @click="followTaxonomy"
                    >
                      Follow
                    </v-btn>
                  </template>
                </div>
              </v-card-title>
            </v-card>
            <div
              v-if="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
              class="sticky-top-6"
            >
              <v-row>
                <v-col cols="4">
                  <v-card
                    :to="`/topics/${$route.params.slug}/discussion`"
                    class="
                      mb-3
                      rounded-lg
                      border-1
                      d-flex
                      justify-center
                      items-center
                      px-4
                      py-5
                    "
                    outlined
                  >
                    <div class="cx__icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g id="Layer_2" data-name="Layer 2">
                          <g id="Layer_1-2" data-name="Layer 1">
                            <rect
                              class="cx__icon-cls-1"
                              width="24"
                              height="24"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M6.82,15.72c2,0,3.88,0,5.77,0a6.78,6.78,0,0,0,4.88-2,7.21,7.21,0,0,0,2-7.1,4.09,4.09,0,0,1,1.42.51,5.62,5.62,0,0,1,3,5c.06,3.86,0,7.71,0,11.57,0,.05,0,.11,0,.26l-1.82-2c-1-1.15-2-2.28-3-3.44a1,1,0,0,0-.83-.38c-2.26,0-4.53,0-6.79,0A5.86,5.86,0,0,1,6.82,15.72Z"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M13.46,9.35c-.74,0-.71,0-.76-.73a1.41,1.41,0,0,1,.48-1.18q2.58-2.52,5.1-5.09c.32-.33.49-.3.75,0a7.55,7.55,0,0,0,.8.8c.16.15.21.25,0,.44C18,5.45,16.14,7.3,14.3,9.17,14,9.45,13.71,9.29,13.46,9.35Z"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M22,1.43a2.16,2.16,0,0,1-.25.27c-.68.7-.69.7-1.36,0S19.58.94,20.44.2c.12-.11.2-.15.34,0l1.08,1.09A.61.61,0,0,1,22,1.43Z"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M18.08,7.36l-.38.35L14.94,10.5a.69.69,0,0,1-.52.26c-.92,0-1.84,0-2.76,0-.27,0-.35-.08-.35-.34,0-.88,0-1.75,0-2.63a.81.81,0,0,1,.27-.69C12.71,6,13.83,4.81,15,3.69c.32-.31.22-.4-.11-.54a5.7,5.7,0,0,0-2.36-.51c-2.25,0-4.5-.06-6.74,0A5.71,5.71,0,0,0,.53,6.05c-.25.49-.3,1-.53,1.52V20.13a2.5,2.5,0,0,0,.24-.22q2.35-2.62,4.7-5.28a.84.84,0,0,1,.71-.32c2.3,0,4.59,0,6.88,0A5.85,5.85,0,0,0,18.24,9.4,3.5,3.5,0,0,0,18.08,7.36ZM7.59,10.29c0,.2,0,.28-.26.28a19.42,19.42,0,0,1-2.29,0c-.59-.07-.14-.63-.25-.95,0-.17-.11-.46.27-.43s.78,0,1.17,0h.33C7.68,9.16,7.67,9.16,7.59,10.29ZM8,7.75H5.12c-.25,0-.34-.06-.35-.33,0-1.08,0-1.08,1.05-1.08H6.9c.57,0,1.15,0,1.73,0,.27,0,.37,0,.37.36C9,7.75,9,7.75,8,7.75Z"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card
                    :to="`/topics/${$route.params.slug}/question`"
                    class="
                      mb-3
                      rounded-lg
                      border-1
                      d-flex
                      justify-center
                      items-center
                      px-4
                      py-5
                    "
                    outlined
                  >
                    <div class="cx__icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g id="Layer_2" data-name="Layer 2">
                          <g id="Layer_1-2" data-name="Layer 1">
                            <rect
                              class="cx__icon-cls-1"
                              width="24"
                              height="24"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M15.76,20.13c.9-2.81-1-4.66-3.42-4.72a4,4,0,0,0-4,2.13A1.79,1.79,0,0,0,9,20.21c-.48,0-.86-.07-1.23-.12S7,20,6.65,19.91A28.82,28.82,0,0,1,3,19a.77.77,0,0,1-.63-.77,8.74,8.74,0,0,1,.11-2.17,4.24,4.24,0,0,1,1.81-2.74,16.46,16.46,0,0,1,3.16-1.67,6.63,6.63,0,0,0,.93-.45A1.56,1.56,0,0,0,8.9,9,6.62,6.62,0,0,1,7.75,6.39c-.09-1.24-.46-2.49,0-3.76A3.73,3.73,0,0,1,11,.12a6.14,6.14,0,0,1,3.12.26,3.83,3.83,0,0,1,2.35,4.18c-.1.6,0,1.2-.15,1.78A9.31,9.31,0,0,1,15,9.06a1.6,1.6,0,0,0,.38,2,4.63,4.63,0,0,0,1,.53,17.64,17.64,0,0,1,3.17,1.64,4.28,4.28,0,0,1,2,3.65c.07,2.3.16,1.88-1.72,2.44A22.5,22.5,0,0,1,15.76,20.13Z"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M12.14,16.76a3,3,0,0,1,1.45.31,1.89,1.89,0,0,1,.27,3.25c-.27.19-.56.34-.84.52s-.38.23-.4.45c0,.49-.33.51-.71.51-1,0-1.25-.46-.75-1.37a2.22,2.22,0,0,1,1-.8.91.91,0,0,0,.59-.94.49.49,0,0,0-.49-.44.91.91,0,0,0-1,.54c-.12.21-.17.59-.48.54a2.56,2.56,0,0,1-1.32-.53c-.16-.13,0-.35,0-.53A2.63,2.63,0,0,1,12.14,16.76Z"
                            />
                            <path
                              class="cx__icon-cls-3"
                              d="M11.75,24c-.85,0-1-.13-1-.94s.18-.91,1-.91,1,.15,1,.95S12.65,24,11.75,24Z"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card
                    :to="`/topics/${$route.params.slug}/idea`"
                    class="
                      mb-3
                      rounded-lg
                      border-1
                      d-flex
                      justify-center
                      items-center
                      px-4
                      py-5
                    "
                    outlined
                  >
                    <div class="cx__icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g id="Layer_2" data-name="Layer 2">
                          <g id="Layer_1-2" data-name="Layer 1">
                            <rect
                              class="cx__icon-cls-1"
                              width="24"
                              height="24"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M13.34.05A9.31,9.31,0,0,0,4,8.89L1.49,12.25a.69.69,0,0,0,.56,1.08H4v4A2.66,2.66,0,0,0,6.7,20H8v4h9.29V17.72a9.28,9.28,0,0,0-4-17.67m1.33,14.61H12V13.33h2.66v1.33m2.12-6a4,4,0,0,1-1.46,1.43V12h-4V10.11A4,4,0,0,1,9.89,4.7a4,4,0,1,1,6.9,4Z"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </div>

          <NuxtChild
            :key="$route.fullPath"
            :subgroup="selectedSGroups"
            :sort="filter_sort"
            :type="filter_type"
          />
        </v-col>

        <!-- right sidebar -->
        <v-col cols="12" md="3">
          <div class="sticky-top-6">
            <v-card
              v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
              class="mb-2 rounded-lg border-1"
              outlined
            >
              <v-list class="py-0">
                <v-list-item
                  :to="`/topics/${$route.params.slug}/discussion`"
                  nuxt
                  class="py-0"
                >
                  <v-list-item-icon class="mr-2 mt-6">
                    <div class="cx__icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g id="Layer_2" data-name="Layer 2">
                          <g id="Layer_1-2" data-name="Layer 1">
                            <rect
                              class="cx__icon-cls-1"
                              width="24"
                              height="24"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M6.82,15.72c2,0,3.88,0,5.77,0a6.78,6.78,0,0,0,4.88-2,7.21,7.21,0,0,0,2-7.1,4.09,4.09,0,0,1,1.42.51,5.62,5.62,0,0,1,3,5c.06,3.86,0,7.71,0,11.57,0,.05,0,.11,0,.26l-1.82-2c-1-1.15-2-2.28-3-3.44a1,1,0,0,0-.83-.38c-2.26,0-4.53,0-6.79,0A5.86,5.86,0,0,1,6.82,15.72Z"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M13.46,9.35c-.74,0-.71,0-.76-.73a1.41,1.41,0,0,1,.48-1.18q2.58-2.52,5.1-5.09c.32-.33.49-.3.75,0a7.55,7.55,0,0,0,.8.8c.16.15.21.25,0,.44C18,5.45,16.14,7.3,14.3,9.17,14,9.45,13.71,9.29,13.46,9.35Z"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M22,1.43a2.16,2.16,0,0,1-.25.27c-.68.7-.69.7-1.36,0S19.58.94,20.44.2c.12-.11.2-.15.34,0l1.08,1.09A.61.61,0,0,1,22,1.43Z"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M18.08,7.36l-.38.35L14.94,10.5a.69.69,0,0,1-.52.26c-.92,0-1.84,0-2.76,0-.27,0-.35-.08-.35-.34,0-.88,0-1.75,0-2.63a.81.81,0,0,1,.27-.69C12.71,6,13.83,4.81,15,3.69c.32-.31.22-.4-.11-.54a5.7,5.7,0,0,0-2.36-.51c-2.25,0-4.5-.06-6.74,0A5.71,5.71,0,0,0,.53,6.05c-.25.49-.3,1-.53,1.52V20.13a2.5,2.5,0,0,0,.24-.22q2.35-2.62,4.7-5.28a.84.84,0,0,1,.71-.32c2.3,0,4.59,0,6.88,0A5.85,5.85,0,0,0,18.24,9.4,3.5,3.5,0,0,0,18.08,7.36ZM7.59,10.29c0,.2,0,.28-.26.28a19.42,19.42,0,0,1-2.29,0c-.59-.07-.14-.63-.25-.95,0-.17-.11-.46.27-.43s.78,0,1.17,0h.33C7.68,9.16,7.67,9.16,7.59,10.29ZM8,7.75H5.12c-.25,0-.34-.06-.35-.33,0-1.08,0-1.08,1.05-1.08H6.9c.57,0,1.15,0,1.73,0,.27,0,.37,0,.37.36C9,7.75,9,7.75,8,7.75Z"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="heading--text">
                      Create Discussion
                    </v-list-item-title>
                    <span class="caption greyMuted--text line-height-16"
                      >Share a best practice, insight, or a challenge</span
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-divider />
                <v-list-item
                  :to="`/topics/${$route.params.slug}/question`"
                  nuxt
                  class="py-0"
                >
                  <v-list-item-icon class="mr-2 mt-6">
                    <div class="cx__icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g id="Layer_2" data-name="Layer 2">
                          <g id="Layer_1-2" data-name="Layer 1">
                            <rect
                              class="cx__icon-cls-1"
                              width="24"
                              height="24"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M15.76,20.13c.9-2.81-1-4.66-3.42-4.72a4,4,0,0,0-4,2.13A1.79,1.79,0,0,0,9,20.21c-.48,0-.86-.07-1.23-.12S7,20,6.65,19.91A28.82,28.82,0,0,1,3,19a.77.77,0,0,1-.63-.77,8.74,8.74,0,0,1,.11-2.17,4.24,4.24,0,0,1,1.81-2.74,16.46,16.46,0,0,1,3.16-1.67,6.63,6.63,0,0,0,.93-.45A1.56,1.56,0,0,0,8.9,9,6.62,6.62,0,0,1,7.75,6.39c-.09-1.24-.46-2.49,0-3.76A3.73,3.73,0,0,1,11,.12a6.14,6.14,0,0,1,3.12.26,3.83,3.83,0,0,1,2.35,4.18c-.1.6,0,1.2-.15,1.78A9.31,9.31,0,0,1,15,9.06a1.6,1.6,0,0,0,.38,2,4.63,4.63,0,0,0,1,.53,17.64,17.64,0,0,1,3.17,1.64,4.28,4.28,0,0,1,2,3.65c.07,2.3.16,1.88-1.72,2.44A22.5,22.5,0,0,1,15.76,20.13Z"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M12.14,16.76a3,3,0,0,1,1.45.31,1.89,1.89,0,0,1,.27,3.25c-.27.19-.56.34-.84.52s-.38.23-.4.45c0,.49-.33.51-.71.51-1,0-1.25-.46-.75-1.37a2.22,2.22,0,0,1,1-.8.91.91,0,0,0,.59-.94.49.49,0,0,0-.49-.44.91.91,0,0,0-1,.54c-.12.21-.17.59-.48.54a2.56,2.56,0,0,1-1.32-.53c-.16-.13,0-.35,0-.53A2.63,2.63,0,0,1,12.14,16.76Z"
                            />
                            <path
                              class="cx__icon-cls-3"
                              d="M11.75,24c-.85,0-1-.13-1-.94s.18-.91,1-.91,1,.15,1,.95S12.65,24,11.75,24Z"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="heading--text">
                      Ask Question
                    </v-list-item-title>
                    <span class="caption greyMuted--text line-height-16"
                      >Feed your curiosity and ask a question</span
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-divider />
                <v-list-item
                  :to="`/topics/${$route.params.slug}/idea`"
                  nuxt
                  class="py-0"
                >
                  <v-list-item-icon class="mr-2 mt-6">
                    <div class="cx__icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g id="Layer_2" data-name="Layer 2">
                          <g id="Layer_1-2" data-name="Layer 1">
                            <rect
                              class="cx__icon-cls-1"
                              width="24"
                              height="24"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M13.34.05A9.31,9.31,0,0,0,4,8.89L1.49,12.25a.69.69,0,0,0,.56,1.08H4v4A2.66,2.66,0,0,0,6.7,20H8v4h9.29V17.72a9.28,9.28,0,0,0-4-17.67m1.33,14.61H12V13.33h2.66v1.33m2.12-6a4,4,0,0,1-1.46,1.43V12h-4V10.11A4,4,0,0,1,9.89,4.7a4,4,0,1,1,6.9,4Z"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="heading--text">
                      Share Idea
                    </v-list-item-title>
                    <span class="caption greyMuted--text line-height-16"
                      >Share an idea or explore <br />
                      something</span
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>

            <ad-card :footer="true">
              <adsbygoogle ad-slot="6757125591" ad-format="auto" />
            </ad-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <Confirm ref="confirm" />
  </div>
</template>

<script>
import {
  mdiArrowLeft,
  mdiShareVariant,
  mdiThumbUpOutline,
  mdiCommentTextOutline,
  mdiAccountArrowRight,
  mdiCommentEdit,
  mdiAccountQuestion,
  mdiHeadLightbulb,
  mdiMap,
  mdiFilterVariant,
  mdiFilterVariantRemove,
  mdiPlus,
  mdiDotsVertical,
  mdiDelete,
  mdiPencil,
  mdiFire,
  mdiCircleMedium,
  mdiChevronDown,
  mdiChevronUp,
} from '@mdi/js';

import { mapState } from 'vuex';

export default {
  name: 'DigitalTranformation',
  data() {
    return {
      sharedGroups: [],
      selectedSGroups: [],
      sgroups: [],
      loading_post: false,
      group: null,
      loading: false,
      following: false,
      filter_type: null,
      filter_sort: null,
      current_page: 1,
      last_page: 0,
      load_more: false,
      mdiArrowLeft,
      mdiShareVariant,
      mdiThumbUpOutline,
      mdiCommentTextOutline,
      mdiAccountArrowRight,
      mdiCommentEdit,
      mdiAccountQuestion,
      mdiHeadLightbulb,
      mdiMap,
      mdiFilterVariant,
      mdiFilterVariantRemove,
      mdiPlus,
      mdiDotsVertical,
      mdiDelete,
      mdiPencil,
      mdiFire,
      mdiCircleMedium,
      mdiChevronDown,
      mdiChevronUp,
      widowHeight: 0,
    };
  },
  head() {
    return {
      title: 'Hot Topics',
    };
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    topic() {
      if (this.topics.length) {
        return this.topics.find((_) => _.slug === this.$route.params.slug);
      }
      return null;
    },
    unfollow() {
      if (this.loggedIn) {
        return this.members.some((_) => _.id === this.$auth.user.id);
      }
      return false;
    },
    ...mapState('topics', ['topics', 'topicsLength']),
    jourenyPageHeightAuto() {
      return this.topics.length * 51 + 40 + 48 + 8 > this.widowHeight
        ? this.widowHeight + 'px'
        : this.topics.length * 51 + 40 + 48 + 8 + 'px';
    },
  },
  watch: {
    sgroups(val) {
      this.selectedSGroups = [];
      val.forEach((item) => {
        const group = this.sharedGroups[item];
        if (group) {
          this.selectedSGroups.push(group.slug);
        }
      });
    },
  },
  async mounted() {
    this.widowHeight = (window.innerHeight * 500) / 576;

    await this.getTaxonomy();
    await this.getTopicList();
  },

  methods: {
    // show all & less mutaition
    showAllTopic() {
      this.$store.commit('topics/TOPICS_PAGINATION');
    },
    // get card class based on post type
    getPostClass(type) {
      switch (type) {
        case 'idea':
          return 'primary lighten-4  idea-post';
        case 'question':
          return 'secondary lighten-5 question-post';
      }
    },
    // get taxonomy
    async getTaxonomy() {
      this.loading = true;
      try {
        const { group, sharedGroups } = await this.$axios.$get(
          'api/get-taxonomy',
          {
            params: { group: this.$route.params.slug },
          }
        );
        this.loading = false;
        this.group = group;
        this.sharedGroups = sharedGroups;
      } catch (e) {}
    },
    // get topic taxonomy
    getTopicList() {
      this.$store.dispatch('topics/getTopicList');
    },

    // follow sub group
    async followTaxonomy() {
      this.following = true;
      try {
        if (this.loggedIn) {
          await this.$axios.$get(`api/follow-taxonomy/${this.topic.id}`);
          this.following = false;
          await this.getTopicList();
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
  },
};
</script>

<style scoped>
.sticky-top-4 {
  position: sticky !important;
  top: 4rem !important;
}

.sticky-top-6 {
  position: sticky !important;
  top: 7.5rem !important;
}

.sticky-content {
  position: sticky !important;
  top: 7.5rem;
}

@media only screen and (max-width: 959px) {
  .sticky-top-4 {
    position: sticky !important;
    top: 3.5rem !important;
  }

  .sticky-top-6 {
    position: static !important;
    top: 0rem !important;
  }
}
</style>
