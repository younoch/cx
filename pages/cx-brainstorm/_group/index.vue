<template>
  <div>
    <v-container fluid>
      <SubGroup
        :taxonomy="$route.params.group"
        @updateSubgroup="updateSubgroup"
      />
    </v-container>
    <v-container id="subgroup">
      <v-row class="sticky-top z-index-10 background">
        <v-col cols="3" sm="6" md="3" class="text-left">
          <v-btn
            v-if="backToJourneryBtn"
            rounded
            depressed
            class="map__back-btn grey-btn text-capitalize"
            @click="backToJournery"
          >
            <v-icon left>{{ mdiArrowLeft }}</v-icon>
            <span v-if="breakpoint.smAndUp"> Back </span>
          </v-btn>
          <v-btn
            v-else-if="backMapsBtn"
            rounded
            depressed
            class="map__back-btn grey-btn text-capitalize"
            @click="backToMaps"
          >
            <v-icon left>{{ mdiArrowLeft }}</v-icon>
            <span v-if="breakpoint.smAndUp"> Journey Maps </span>
          </v-btn>
          <v-btn
            v-else
            rounded
            depressed
            class="map__back-btn grey-btn text-capitalize"
            @click="backToCxBrainStorm"
          >
            <v-icon left>{{ mdiArrowLeft }}</v-icon>
            <span v-if="breakpoint.smAndUp"> CX Brainstorm </span>
          </v-btn>
        </v-col>
        <v-col
          v-if="breakpoint.smAndDown"
          cols="9"
          md="3"
          sm="6"
          class="text-right"
        >
          <v-btn
            v-if="showMapOptions && user.role !== 'subscriber'"
            rounded
            depressed
            class="grey-btn text-capitalize"
            @click="consolidate = !consolidate"
          >
            consolidate journeys Maps
          </v-btn>
          <v-btn
            v-else-if="user.role === 'subscriber'"
            rounded
            depressed
            class="grey-btn text-capitalize"
            @click="isJourneySuggestForm = true"
          >
            Suggest a New Journey
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-row v-if="$route.name === 'cx-brainstorm-group-index-slug-maps'">
            <v-col
              cols="12"
              md="6"
              class="search-journey-maps"
              :class="showMapOptions ? '' : 'pa-0'"
            >
              <v-text-field
                v-if="showMapOptions"
                v-model="searchMapQuery"
                solo
                label="Search journey maps..."
                clearable
                background-color="lighten-3"
                outlined
                class="search-map__journey"
                hide-details
                single-line
                flat
                :prepend-inner-icon="mdiMagnify"
              />
            </v-col>
            <v-col cols="6" md="3" class="filter-1">
              <v-autocomplete
                v-if="showMapOptions"
                v-model="filterType"
                :items="[
                  {
                    text: 'Standard',
                    value: 'standard',
                  },
                  {
                    text: 'Column',
                    value: 'layout1',
                  },
                  {
                    text: 'Row',
                    value: 'layout2',
                  },
                ]"
                :prepend-icon="mdiFilterVariant"
                label="Filter By"
                hide-details
                clearable
                class="pa-0 ma-0"
              />
              <v-autocomplete
                v-else
                v-model="filterType"
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
            <v-col cols="6" md="3" class="filter-2">
              <v-autocomplete
                v-if="showMapOptions"
                v-model="sortBy"
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
              <v-autocomplete
                v-else
                v-model="sortBy"
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
        <v-col
          v-if="breakpoint.mdAndUp"
          cols="12"
          md="3"
          sm="6"
          class="text-sm-right text-left align-left"
        >
          <v-btn
            v-if="showMapOptions && user.role !== 'subscriber'"
            rounded
            depressed
            class="grey-btn text-capitalize"
            @click="consolidate = !consolidate"
          >
            consolidate journeys Maps
          </v-btn>
          <v-btn
            v-else-if="user.role === 'subscriber'"
            rounded
            depressed
            class="grey-btn text-capitalize"
            @click="isJourneySuggestForm = true"
          >
            Suggest a New Journey
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="3" class="pb-0 pb-md-3">
          <div class="sticky-top-8 z-index-3">
            <!-- Touch Points sections -->
            <v-card class="mb-2 rounded-lg" outlined>
              <v-card-title class="text--text justify-space-between">
                Touch Points
                <v-btn
                  v-if="!breakpoint.mdAndUp"
                  icon
                  @click="isExpandTouchPannel = !isExpandTouchPannel"
                >
                  <v-icon>{{
                    isExpandTouchPannel ? mdiChevronUp : mdiChevronDown
                  }}</v-icon>
                </v-btn>
              </v-card-title>
              <!-- for small devices -->
              <template v-if="breakpoint.mdAndUp || isExpandTouchPannel">
                <v-divider />
                <v-skeleton-loader
                  v-if="loading"
                  elevation="2"
                  type="chip@5"
                  class="ma-1"
                />
                <v-card-text>
                  <v-chip-group
                    v-model="sgroups"
                    multiple
                    column
                    active-class="primary--text"
                  >
                    <v-chip
                      v-for="(item, i) in sharedGroups"
                      :key="`${i}-touch-point`"
                      class="ma-1 primary font-12"
                      outlined
                    >
                      {{ item.name }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </template>
            </v-card>
          </div>
          <div
            class="carousel-title cxbrainstorm__cards-inner d-none d-md-block"
          >
            <ImagesCarousel
              class="cxbrainstrom__right-card mb-2 rounded-lg"
              :loading="loading_image_post"
              :posts="images_post"
              title="Images"
              :icon-only="breakpoint.mobile ? true : false"
            />

            <VideoCarousel
              class="cxbrainstrom__right-card mb-2 rounded-lg"
              :loading="loading_video_post"
              :posts="videos_post"
              title="Videos"
              :icon-only="breakpoint.mobile ? true : false"
            />

            <DocumentCarousel
              class="cxbrainstrom__right-card rounded-lg"
              :loading="loading_document_post"
              :posts="documents_post"
              title="Documents"
              :icon-only="breakpoint.mobile ? true : false"
            />
          </div>
        </v-col>

        <!-- post section -->
        <v-col cols="12" md="6" class="pt-0 pt-md-3">
          <div
            class="sticky-top-8 z-index-10"
            :class="showMapOptions ? 'sticky-top-11' : ''"
          >
            <v-card class="py-3 mb-2 rounded-lg" outlined>
              <v-card-title
                class="cx-card__title relative d-flex justify-space-between"
              >
                <h2
                  v-if="subgroup"
                  class="text-h6 line-height-24 cx-title text--text"
                >
                  {{ subgroup.title }}
                </h2>
                <div class="cx-follow">
                  <template v-if="unfollow">
                    <v-btn
                      height="32"
                      class="rounded-pill text-capitalize font-12"
                      color="#2CBEE3"
                      outlined
                      depressed
                      :loading="following"
                      @click="followTaxonomy"
                    >
                      Following
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn
                      height="32"
                      class="rounded-pill text-capitalize font-12"
                      outlined
                      color="#2CBEE3"
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
          </div>

          <!-- right sidebar sections -->
          <v-row v-if="subgroup && breakpoint.smAndDown" class="mb-3">
            <v-col cols="3">
              <v-card
                :to="`/cx-brainstorm/${subgroup.slug}/discussion`"
                :class="
                  breakpoint.xs ? 'd-flex justify-center items-center' : ''
                "
                class="py-3"
                nuxt
                outlined
                :min-height="breakpoint.mdAndUp ? 160 : '100%'"
                @click="backToJourneryBtn = true"
              >
                <v-card-title
                  class="justify-center word-nobreak d-flex flex-column"
                >
                  <v-badge
                    v-if="subgroup.discussions_count > 0"
                    overlap
                    color="primary"
                    :content="subgroup.discussions_count"
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
                  </v-badge>
                  <template v-else>
                    <v-icon :class="breakpoint.sm ? 'd-block' : ''">{{
                      mdiCommentEdit
                    }}</v-icon>
                  </template>
                  <span
                    class="text-subtitle-1 font-weight-light"
                    :class="{
                      'd-block text-center': breakpoint.sm,
                      'd-none': breakpoint.xs,
                    }"
                  >
                    Create Discussion
                  </span>
                </v-card-title>
                <v-card-subtitle
                  class="text-body-2 work-nobreak"
                  :class="{
                    'pt-2 text-center': breakpoint.sm,
                    'd-none': breakpoint.xs,
                  }"
                >
                  Share a best practice, insight, or a challenge
                </v-card-subtitle>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card
                :to="`/cx-brainstorm/${subgroup.slug}/question`"
                class="py-3"
                :class="
                  breakpoint.xs ? 'd-flex justify-center items-center' : ''
                "
                nuxt
                outlined
                :min-height="breakpoint.mdAndUp ? 160 : '100%'"
                @click="backToJourneryBtn = true"
              >
                <v-card-title
                  class="justify-center word-nobreak d-flex flex-column"
                >
                  <v-badge
                    v-if="subgroup.questions_count"
                    overlap
                    color="primary"
                    :content="subgroup.questions_count"
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
                  </v-badge>
                  <template v-else>
                    <v-icon :class="breakpoint.sm ? 'd-block' : ''">{{
                      mdiAccountQuestion
                    }}</v-icon>
                  </template>
                  <span
                    :class="{
                      'd-block text-center': breakpoint.sm,
                      'd-none': breakpoint.xs,
                    }"
                    class="text-subtitle-1 font-weight-light"
                  >
                    Ask Question
                  </span>
                </v-card-title>
                <v-card-subtitle
                  class="text-body-2 word-nobreak"
                  :class="{
                    'pt-2 text-center': breakpoint.sm,
                    'd-none': breakpoint.xs,
                  }"
                >
                  Feed your curiosity and ask a question
                </v-card-subtitle>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card
                :to="`/cx-brainstorm/${subgroup.slug}/idea`"
                class="py-3"
                :class="
                  breakpoint.xs ? 'd-flex justify-center items-center' : ''
                "
                nuxt
                outlined
                :min-height="breakpoint.mdAndUp ? 160 : '100%'"
                @click="backToJourneryBtn = true"
              >
                <v-card-title
                  class="justify-center word-nobreak d-flex flex-column"
                >
                  <v-badge
                    v-if="subgroup.ideas_count"
                    overlap
                    color="primary"
                    :content="subgroup.ideas_count"
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
                  </v-badge>
                  <template v-else>
                    <v-icon :class="breakpoint.sm ? 'd-block' : ''">{{
                      mdiHeadLightbulb
                    }}</v-icon>
                  </template>
                  <span
                    class="text-subtitle-1 font-weight-light"
                    :class="{
                      'd-block text-center': breakpoint.sm,
                      'd-none': breakpoint.xs,
                    }"
                  >
                    Share Idea
                  </span>
                </v-card-title>
                <v-card-subtitle
                  class="text-body-2 word-nobreak"
                  :class="{
                    'pt-2 text-center': breakpoint.sm,
                    'd-none': breakpoint.xs,
                  }"
                >
                  Share an idea or explore something
                </v-card-subtitle>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card
                outlined
                class="py-3"
                :class="
                  breakpoint.xs ? 'd-flex justify-center items-center' : ''
                "
                :min-height="breakpoint.mdAndUp ? 160 : '100%'"
                :to="`/cx-brainstorm/${subgroup.slug}/maps`"
                @click="backToJourneryBtn = true"
              >
                <v-card-title
                  class="justify-center word-nobreak d-flex flex-column"
                >
                  <v-badge
                    v-if="subgroup.maps_count"
                    overlap
                    color="primary"
                    :content="subgroup.maps_count"
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
                              d="M0,5.06,7,.49A.7.7,0,0,1,7.08,1c0,6.1,0,12.2,0,18.3a.72.72,0,0,1-.41.74C4.45,21.32,2.23,22.65,0,24Z"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M24,0V14.06c-.19,0-.24-.2-.34-.3a6.87,6.87,0,0,0-6.25-2.35c-.33,0-.45,0-.45-.38,0-2.14,0-4.27,0-6.41A.62.62,0,0,1,17.32,4C19.4,2.77,21.47,1.52,23.55.27c.12-.07.29-.11.36-.27Z"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M12,21.37c-1.14-.55-2.19-1.07-3.25-1.57a.43.43,0,0,1-.3-.46c0-.14,0-.29,0-.43V1c0-.59,0-.59.52-.31q3.09,1.71,6.19,3.39a.6.6,0,0,1,.38.61c0,2.29,0,4.59,0,6.88a.47.47,0,0,1-.29.51,6.92,6.92,0,0,0-3.34,9C12,21.17,12,21.22,12,21.37Z"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M21.91,22.63a3.6,3.6,0,0,0-3.18-3.57,2.44,2.44,0,0,0,1.45-1,2.11,2.11,0,0,0,.22-1.66,2.11,2.11,0,0,0-4.09.17c-.19,1.15.33,2,1.67,2.53a3.58,3.58,0,0,0-2.23,1.17,3.43,3.43,0,0,0-.88,2.35c-1.21-.47-2.33-3-2.1-4.79a5.63,5.63,0,0,1,10.89-1.36A5.46,5.46,0,0,1,21.91,22.63Z"
                            />
                            <path
                              class="cx__icon-cls-2"
                              d="M16.26,22.83a2.12,2.12,0,0,1,2.33-2.35,2,2,0,0,1,1.85,1.8c.09,1.49.33,1.28-1.23,1.61a4.9,4.9,0,0,1-2.22-.1C16.23,23.6,16.23,23.6,16.26,22.83Z"
                            />
                            <path
                              class="cx__icon-cls-3"
                              d="M19.06,16.94a.65.65,0,0,1-.65.69.69.69,0,1,1,.65-.69Z"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                  </v-badge>
                  <template v-else>
                    <v-icon :class="breakpoint.sm ? 'd-block' : ''">{{
                      mdiMap
                    }}</v-icon>
                  </template>
                  <span
                    class="text-subtitle-1 font-weight-light"
                    :class="{
                      'd-block text-center': breakpoint.sm,
                      'd-none': breakpoint.xs,
                    }"
                  >
                    Map Journeys
                  </span>
                </v-card-title>
                <v-card-subtitle
                  class="text-body-2 word-nobreak"
                  :class="{
                    'pt-2 text-center': breakpoint.sm,
                    'd-none': breakpoint.xs,
                  }"
                >
                  Map customer journey experiences
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>

          <NuxtChild
            :key="$route.fullPath"
            :subgroup="subgroup"
            :sort="sortBy"
            :type="filterType"
            :query="searchMapQuery"
            :consolidate="consolidate"
            :shared-groups="selectedSGroups"
            @openSingleMap="singleMapClicked"
          />
        </v-col>

        <v-col v-if="breakpoint.mdAndUp" cols="12" md="3">
          <div class="sticky-top-8 z-index-3 background">
            <v-card class="mb-2 rounded-lg overflow-hidden" outlined>
              <template v-if="subgroup">
                <v-list class="py-0">
                  <v-list-item
                    :to="`/cx-brainstorm/${subgroup.slug}/discussion`"
                    nuxt
                    class="py-0"
                    @click="backToJourneryBtn = true"
                  >
                    <v-list-item-icon
                      class="
                        mr-2
                        mt-4
                        flex-column
                        align-center
                        justify-space-around
                      "
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
                      <span class="font-weight-medium mt-1">{{
                        subgroup.discussions_count
                      }}</span>
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
                    :to="`/cx-brainstorm/${subgroup.slug}/question`"
                    nuxt
                    class="py-0"
                    @click="backToJourneryBtn = true"
                  >
                    <v-list-item-icon
                      class="
                        mr-2
                        mt-4
                        flex-column
                        align-center
                        justify-space-around
                      "
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
                      <span class="font-weight-medium mt-1">{{
                        subgroup.questions_count
                      }}</span>
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
                    :to="`/cx-brainstorm/${subgroup.slug}/idea`"
                    nuxt
                    class="py-0"
                    @click="backToJourneryBtn = true"
                  >
                    <v-list-item-icon
                      class="
                        mr-2
                        mt-4
                        flex-column
                        align-center
                        justify-space-around
                      "
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
                      <span class="font-weight-medium mt-1">{{
                        subgroup.ideas_count
                      }}</span>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="heading--text">
                        Share Idea
                      </v-list-item-title>
                      <span class="caption greyMuted--text line-height-16"
                        >Share an idea or explore something</span
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider />
                  <v-list-item
                    class="py-0"
                    :to="`/cx-brainstorm/${subgroup.slug}/maps`"
                    @click="backToJourneryBtn = true"
                  >
                    <v-list-item-icon
                      class="
                        mr-2
                        mt-4
                        flex-column
                        align-center
                        justify-space-around
                      "
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
                                d="M0,5.06,7,.49A.7.7,0,0,1,7.08,1c0,6.1,0,12.2,0,18.3a.72.72,0,0,1-.41.74C4.45,21.32,2.23,22.65,0,24Z"
                              />
                              <path
                                class="cx__icon-cls-2"
                                d="M24,0V14.06c-.19,0-.24-.2-.34-.3a6.87,6.87,0,0,0-6.25-2.35c-.33,0-.45,0-.45-.38,0-2.14,0-4.27,0-6.41A.62.62,0,0,1,17.32,4C19.4,2.77,21.47,1.52,23.55.27c.12-.07.29-.11.36-.27Z"
                              />
                              <path
                                class="cx__icon-cls-2"
                                d="M12,21.37c-1.14-.55-2.19-1.07-3.25-1.57a.43.43,0,0,1-.3-.46c0-.14,0-.29,0-.43V1c0-.59,0-.59.52-.31q3.09,1.71,6.19,3.39a.6.6,0,0,1,.38.61c0,2.29,0,4.59,0,6.88a.47.47,0,0,1-.29.51,6.92,6.92,0,0,0-3.34,9C12,21.17,12,21.22,12,21.37Z"
                              />
                              <path
                                class="cx__icon-cls-2"
                                d="M21.91,22.63a3.6,3.6,0,0,0-3.18-3.57,2.44,2.44,0,0,0,1.45-1,2.11,2.11,0,0,0,.22-1.66,2.11,2.11,0,0,0-4.09.17c-.19,1.15.33,2,1.67,2.53a3.58,3.58,0,0,0-2.23,1.17,3.43,3.43,0,0,0-.88,2.35c-1.21-.47-2.33-3-2.1-4.79a5.63,5.63,0,0,1,10.89-1.36A5.46,5.46,0,0,1,21.91,22.63Z"
                              />
                              <path
                                class="cx__icon-cls-2"
                                d="M16.26,22.83a2.12,2.12,0,0,1,2.33-2.35,2,2,0,0,1,1.85,1.8c.09,1.49.33,1.28-1.23,1.61a4.9,4.9,0,0,1-2.22-.1C16.23,23.6,16.23,23.6,16.26,22.83Z"
                              />
                              <path
                                class="cx__icon-cls-3"
                                d="M19.06,16.94a.65.65,0,0,1-.65.69.69.69,0,1,1,.65-.69Z"
                              />
                            </g>
                          </g>
                        </svg>
                      </div>
                      <span class="font-weight-medium mt-1">{{
                        subgroup.maps_count
                      }}</span>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="heading--text">
                        Map Journeys
                      </v-list-item-title>
                      <span class="caption greyMuted--text line-height-16"
                        >Map customer journey experiences</span
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </template>
              <!-- skeleton -->
              <template v-else>
                <v-skeleton-loader
                  type="list-item-three-line"
                ></v-skeleton-loader>
                <v-skeleton-loader
                  type="divider, list-item-three-line"
                ></v-skeleton-loader>
                <v-skeleton-loader
                  type="divider, list-item-three-line"
                ></v-skeleton-loader>
                <v-skeleton-loader
                  type="divider, list-item-three-line"
                ></v-skeleton-loader>
              </template>
            </v-card>
          </div>
          <!-- START FOLLOWED MEMBER LIST -->
          <v-card class="mb-2 rounded-lg" outlined>
            <v-card-title> {{ members.length }} members </v-card-title>
            <v-divider />
            <v-skeleton-loader :loading="following_loading" type="avatar">
              <v-card-text class="pa-4 pb-2 d-flex justify-center flex-wrap">
                <n-link
                  v-for="(member, i) in members"
                  :key="`${i}-member`"
                  :to="`/${member.username}`"
                  :class="i < members.length - 1 ? 'mb-2' : ''"
                >
                  <v-avatar class="mx-1" color="primary">
                    <v-img :src="member.image" :alt="member.name" />
                  </v-avatar>
                </n-link>
              </v-card-text>
            </v-skeleton-loader>
          </v-card>
          <!-- END FOLLOWED MEMBER LIST -->

          <!-- START ACTIVE USER -->
          <v-skeleton-loader
            v-if="loading_user"
            transition="fade-transition"
            elevation="2"
            type="card"
          />
          <client-only v-else>
            <v-card class="mb-2 rounded-lg overflow-hidden" outlined>
              <v-card-title class="text--text"
                >Most Active Members</v-card-title
              >
              <v-divider />
              <carousel
                :per-page="1"
                :pagination-enabled="false"
                :loop="true"
                :autoplay="true"
                :autoplay-timeout="5000"
              >
                <slide v-for="(member, i) in users" :key="`${i}-member-2`">
                  <n-link :to="`/${member.username}`">
                    <user-card :user="member" rounded="rounded-0" />
                  </n-link>
                </slide>
              </carousel>
            </v-card>
          </client-only>
          <!-- END ACTIVE USER -->

          <!-- START MOST POPULAR POSTS -->
          <popular-posts-carousel
            class="rounded-lg carousel-title"
            :loading="loading_popular_post"
            :posts="popular_posts"
            title="Most Popular Posts"
          />
          <!-- END MOST POPULAR POSTS -->

          <ad-card :footer="true" class="sticky-top-30">
            <adsbygoogle ad-slot="6757125591" ad-format="auto" />
          </ad-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- Popover message -->
    <v-dialog
      v-if="loggedIn && subgroup && subgroup.show"
      v-model="courseAlertDialog"
      width="400"
      content-class="course-assignment-dialog"
      persistent
    >
      <v-card v-if="subgroup.course_id" outlined>
        <v-card-title class="pa-2 primary white--text">
          Learning Opportunity
          <v-spacer />
          <v-btn icon dark @click="closeCourse(subgroup)">
            <v-icon>{{ mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-2 text-center">
          <template v-if="subgroup.mandatory_course">
            You have been assigned a mandatory training course that must be
            completed by
            <span class="red--text">
              {{ subgroup.course_deadline | toFormattedDateString }} </span
            >. Click
            <nuxt-link :to="`/courses/${subgroup.course_id}`"> here </nuxt-link>
            to view your course.
          </template>
          <template v-else>
            You have been assigned a training course . Click
            <nuxt-link :to="`/courses/${subgroup.course_id}`"> here </nuxt-link>
            to view your course.
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Popover message -->
    <!-- Training course Dialog -->
    <v-dialog
      v-model="courseDialog"
      fullscreen
      hide-overlay
      :scrollable="false"
      transition="dialog-bottom-transition"
    >
      <template v-if="course">
        <Course :course="course" @close="closeCourseDialog" />
      </template>
    </v-dialog>
    <!-- Training course Dialog -->

    <!-- suggest journey form -->
    <v-dialog
      v-model="isJourneySuggestForm"
      width="500"
      content-class="sugget-journey__form"
    >
      <v-card>
        <v-toolbar color="primary" flat>
          <h4 class="font-18 font-xs-16 white--text font-weight-regular pl-2">
            Write your suggestion for new journey
          </h4>
          <v-spacer />
          <v-btn icon color="white" @click="closeSuggestForm"
            ><v-icon>{{ mdiClose }}</v-icon></v-btn
          >
        </v-toolbar>
        <validation-observer ref="contactForm" v-slot="{ handleSubmit, reset }">
          <v-form
            v-if="isJourneySuggestForm"
            @reset.prevent="reset"
            @submit.prevent="handleSubmit(submitSuggestJourney)"
          >
            <v-card-text class="suggest__form mt-1 pb-0">
              <b-text-area
                v-model="suggestJourney"
                class="mt-0"
                rules="required|min:10|max:400"
                vid="content"
                label="Suggest a new journey"
                placeholder="Type here..."
                auto-grow
                outlined
              />
            </v-card-text>
            <v-card-actions class="pb-6 mx-2 pt-0">
              <v-spacer />
              <v-btn
                rounded
                :loading="suggestLoading"
                color="primary"
                type="submit"
                class="text-capitalize font-weight-medium px-5"
              >
                Submit
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-form>
        </validation-observer>
      </v-card>
    </v-dialog>

    <Confirm ref="confirm" />
  </div>
</template>

<script>
import {
  mdiArrowLeft,
  mdiShareVariant,
  mdiThumbUpOutline,
  mdiThumbUp,
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
  mdiPlusCircle,
  mdiClose,
  mdiCircleMedium,
  mdiCircleSmall,
  mdiSend,
  mdiMagnify,
  mdiEarth,
  mdiChevronDown,
  mdiChevronUp,
} from '@mdi/js';
import { format } from 'date-fns';
import { mapState } from 'vuex';

export default {
  name: 'TaxonomySubGroup',
  beforeRouteLeave(to, from, next) {
    this.backToJournery();
  },
  data() {
    return {
      isHydrated: false,
      course: null,
      courseDialog: false,
      courseAlertDialog: false,
      closedCourses: [],
      closeInterval: null,
      closeCount: 0,
      sharedGroups: [],
      selectedSGroups: [],
      sgroups: [],
      images_post: [],
      loading_image_post: true,
      videos_post: [],
      loading_video_post: false,
      documents_post: [],
      loading_document_post: false,
      group: null,
      subgroup: null,
      loading: false,
      following: false,
      following_loading: false,
      members: [],
      loading_user: false,
      users: [],
      loading_popular_post: false,
      popular_posts: [],
      filterType: null,
      sortBy: null,
      showMaps: false,
      showSingleMap: false,
      creating: false,
      image: '',
      file: null,
      current_page: 1,
      last_page: 0,
      showJourneyBackButton: false,
      errors: {},
      searchMapQuery: '',
      showMapOptions: false,
      backToJourneryBtn: false,
      backMapsBtn: false,
      consolidate: false,
      isJourneySuggestForm: false,
      suggestLoading: false,
      suggestJourney: '',
      isExpandTouchPannel: false,
      mdiArrowLeft,
      mdiShareVariant,
      mdiThumbUpOutline,
      mdiThumbUp,
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
      mdiPlusCircle,
      mdiClose,
      mdiCircleMedium,
      mdiCircleSmall,
      mdiSend,
      mdiMagnify,
      mdiEarth,
      mdiChevronDown,
      mdiChevronUp,
    };
  },
  computed: {
    ...mapState('notification', ['copyMapStap']),
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    unfollow() {
      if (this.loggedIn) {
        return this.members.some((_) => _.id === this.$auth.user.id);
      }
      return false;
    },
    publishedAt() {
      if (this.journey.datetime > format(new Date(), 'yyyy-MM-dd HH:mm:ss')) {
        const date = new Date(this.journey.datetime.split(' ').join('T'));
        return format(date, 'E, MMM dd, yyyy - hh:mm:ss a');
      }
      return null;
    },

    breakpoint() {
      return this.isHydrated
        ? this.$vuetify.breakpoint
        : { mdAndUp: true, sm: true, xs: false };
    },
  },
  watch: {
    // watch copy map step changes
    copyMapStap(NewStep) {
      this.pushCopyStep(NewStep);
    },
    sgroups(val) {
      this.selectedSGroups = [];
      val.forEach((item) => {
        const group = this.sharedGroups[item];
        if (group) {
          this.selectedSGroups.push(group.slug);
        }
      });
    },
    async $route(to, from) {
      // react to route changes...
      this.toggleMapFilterOptions(to.name);
      await this.getTaxonomy();
      await this.getFollowerTaxonomy();
    },
  },
  created() {
    if (this.$route.params.type) {
      this.backToJourneryBtn = true;
    } else if (this.$route.name === 'cx-brainstorm-group-index-slug-maps') {
      this.backToJourneryBtn = true;
    } else {
      this.backToJourneryBtn = false;
    }
  },
  async mounted() {
    this.isHydrated = true;
    this.toggleMapFilterOptions(this.$route.name);
    await this.getTaxonomy();
    await this.getSubTaxonomy();
    await this.getImagesPosts();
    await this.getVideosPosts();
    await this.getDocumentsPosts();
    await this.getFollowerTaxonomy();
    await this.getActiveUsers();
    await this.getPopularPosts();
  },
  methods: {
    // sent user journey suggestion
    async submitSuggestJourney() {
      this.suggestLoading = true;

      if (
        this.suggestJourney &&
        this.suggestJourney.length > 9 &&
        this.suggestJourney.length < 500
      ) {
        const suggest = {
          message: this.suggestJourney,
          subgroup: this.subgroup.title,
          name: this.user.name,
        };

        try {
          await this.$axios.$post('api/user-journey-suggestion', suggest);
          this.suggestLoading = false;

          this.$store.commit(
            'CRUD_SUCCESS_NO_ACTION',
            'Suggestion sent successfully'
          );
          this.suggestJourney = '';

          this.$nextTick(() => {
            this.isJourneySuggestForm = false;
          });
        } catch (e) {
          this.suggestLoading = false;
        }
      } else {
        this.suggestLoading = false;
      }
    },
    closeSuggestForm() {
      this.isJourneySuggestForm = false;
      this.suggestJourney = '';
    },
    // Mutation copy map step push
    pushCopyStep(step) {
      this.$store.commit('map/PUSH_COPY_MAP', step);
    },

    async openCourseDialog(courseId) {
      try {
        const { course } = await this.$axios.$get(
          `api/training/course/${courseId}`
        );
        this.course = course;
        // this.courseDialog = true;
        this.$nextTick(() => {
          this.courseDialog = true;
        });
      } catch (err) {
        this.processing = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
    closeCourseDialog() {
      this.courseDialog = false;
      this.$nextTick(() => {
        this.course = null;
      });
    },
    // close course dialog
    closeCourse(group) {
      const vm = this;
      this.courseAlertDialog = false;
      this.$set(this.subgroup, 'show', false);
      this.closeCount++;
      if (this.closeCount < 3) {
        this.closeInterval = setInterval(() => {
          vm.courseAlertDialog = true;
          vm.$set(this.subgroup, 'show', true);

          clearInterval(vm.closeInterval);
        }, 30000);
      } else {
        clearInterval(vm.closeInterval);
        // set in cookie
        let hiddenCourses = this.$cookies.get('hidden-sub-courses');
        if (hiddenCourses) {
          if (!hiddenCourses.includes(this.subgroup.course_id)) {
            hiddenCourses.push(this.subgroup.course_id);
          }
        } else {
          hiddenCourses = [this.subgroup.course_id];
        }
        this.$cookies.set('hidden-sub-courses', hiddenCourses, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
        // mark as close
        this.markAsClose();
      }
      if (this.closeCount >= 3) {
        clearInterval(vm.closeInterval);
      }
    },
    // mark as close
    async markAsClose() {
      try {
        await this.$axios.$get(
          `api/training/course-mark-as-close/${this.subgroup.course_id}`
        );
      } catch (e) {}
    },

    // get card class based on post type
    getPostClass(type) {
      switch (type) {
        case 'idea':
          return 'primary lighten-4 idea-post';
        case 'question':
          return 'secondary lighten-5 question-post';
      }
    },
    // toggle map filter options
    toggleMapFilterOptions(name) {
      if (name === 'cx-brainstorm-group-index-slug-maps') {
        this.showMapOptions = true;
      } else {
        this.showMapOptions = false;
      }
    },
    // get taxonomy
    async getTaxonomy() {
      this.loading = true;
      try {
        const { group, sharedGroups } = await this.$axios.$get(
          'api/get-taxonomy',
          {
            params: { group: this.$route.params.group },
          }
        );
        this.loading = false;
        this.group = group;
        this.sharedGroups = sharedGroups;
      } catch (e) {}
    },
    // get sub taxonomy
    async getSubTaxonomy() {
      try {
        const { subgroup } = await this.$axios.$get(
          'api/get-subgroup-taxonomy',
          {
            params: {
              group: this.$route.params.group,
              journey: this.$route.params.slug,
            },
          }
        );
        // get hidden courses ids
        const hiddenCourses = this.$cookies.get('hidden-sub-courses');
        if (hiddenCourses) {
          this.subgroup = Object.assign(
            {},
            { ...subgroup, show: !hiddenCourses.includes(subgroup.course_id) }
          );
        } else {
          this.subgroup = Object.assign({}, { ...subgroup, show: true });
        }

        this.courseAlertDialog = !!this.subgroup.course_id;
      } catch (e) {}
    },

    // get image posts
    async getImagesPosts() {
      this.loading_image_post = true;
      try {
        const { data } = await this.$axios.$get('api/get-posts-media', {
          params: {
            type: 'images',
            limit: 5,
            group: this.$route.params.group,
            subgroup: this.$route.params.slug,
          },
        });
        this.loading_image_post = false;
        this.images_post = data;
      } catch (e) {}
    },
    // get video posts
    async getVideosPosts() {
      this.loading_video_post = true;
      try {
        const { data } = await this.$axios.$get('api/get-posts-media', {
          params: {
            type: 'videos',
            limit: 5,
            group: this.$route.params.group,
            subgroup: this.$route.params.slug,
          },
        });
        this.loading_video_post = false;
        this.videos_post = data;
      } catch (e) {}
    },
    // get document posts
    async getDocumentsPosts() {
      this.loading_document_post = true;
      try {
        const { data } = await this.$axios.$get('api/get-posts-media', {
          params: {
            type: 'documents',
            limit: 5,
            group: this.$route.params.group,
            subgroup: this.$route.params.slug,
          },
        });
        this.loading_document_post = false;
        this.documents_post = data;
      } catch (e) {}
    },
    // follow sub group
    async followTaxonomy() {
      this.following = true;
      try {
        if (this.loggedIn) {
          await this.$axios.$get(`api/follow-taxonomy/${this.subgroup.id}`);
          this.following = false;
          await this.getFollowerTaxonomy();
        } else {
          this.following = false;
          this.$store.commit(
            'APP_NETWORK_ERROR',
            'Please sign in to use this service.'
          );
        }
      } catch (e) {
        this.following = false;
      }
    },
    // get followers of this page
    async getFollowerTaxonomy() {
      this.following_loading = true;
      try {
        const { members } = await this.$axios.$get(
          `api/follower-taxonomy/${this.subgroup.id}`
        );
        this.following_loading = false;
        this.members = members;
      } catch (e) {
        this.following_loading = false;
      }
    },
    // get most active users
    async getActiveUsers() {
      this.loading_user = true;
      try {
        this.users = await this.$axios.$get(`api/get-active-users`);
        this.loading_user = false;
      } catch (e) {
        this.loading_user = false;
      }
    },
    // get popular posts
    async getPopularPosts() {
      this.loading_popular_post = true;
      try {
        this.popular_posts = await this.$axios.$get('api/get-popular-posts', {
          params: {
            limit: 10,
          },
        });
        this.loading_popular_post = false;
      } catch (e) {}
    },
    backToCxBrainStorm() {
      this.$router.push('/cx-brainstorm');
    },
    backToJournery() {
      this.backToJourneryBtn = false;
      this.backMapsBtn = false;
      this.$router.push(
        `/cx-brainstorm/${this.$route.params.group}/${this.$route.params.slug}`
      );
    },
    backToMaps() {
      this.backToJourneryBtn = true;
      this.backMapsBtn = false;
      this.$router.push(
        `/cx-brainstorm/${this.$route.params.group}/${this.$route.params.slug}/maps`
      );
    },
    singleMapClicked() {
      this.backToJourneryBtn = false;
      this.backMapsBtn = true;
    },
    async updateSubgroup() {
      await this.getSubTaxonomy();
      await this.getFollowerTaxonomy();
    },
  },
};
</script>

<style scoped>
.sticky-top {
  position: sticky !important;
  top: 4rem !important;
}
.sticky-top-8 {
  position: sticky !important;
  top: 7.5rem !important;
}
.sticky-top-30 {
  position: sticky !important;
  top: 28.9rem !important;
}

@media only screen and (max-width: 959px) {
  .sticky-top {
    position: sticky !important;
    top: 3.5rem !important;
  }
  .sticky-top-8 {
    position: static !important;
    top: 0rem !important;
  }
}

@media only screen and (max-width: 600px) {
  .sticky-top-30 {
    position: static !important;
    top: 0rem !important;
  }
}

@media (min-width: 960px) and (max-width: 1263px) {
  .sticky-top {
    position: sticky !important;
    top: 3.95rem !important;
  }
  .sticky-top-11 {
    position: sticky !important;
    top: 11.1rem !important;
  }
}
</style>
