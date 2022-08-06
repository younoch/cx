<template>
  <div id="brainstorm" class="cx-brainstorm">
    <v-container class="cx-brainstorm-container">
      <v-row class="flex-grow-0">
        <v-col class="text-center">
          <h2 class="text-xs-h4 text-md-h2 text--text">
            The Global CX Brainstorm
          </h2>
          <p class="text-subtitle-1 greyMuted--text">
            The world’s first contextualised customer experience best practices
            exchange and networking platform.
          </p>
        </v-col>
      </v-row>
      <template v-if="loading">
        <v-row class="flex-grow-0 w-100">
          <v-col v-for="(n, i) in 4" :key="i">
            <v-skeleton-loader
              :loading="loading"
              transition="fade-transition"
              type="card"
            />
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row class="flex-grow-0">
          <v-col
            v-for="(group, i) in groups"
            :key="i"
            cols="12"
            :sm="drawerStatus? 6: 4"
            :md="drawerStatus? 4: 3"
            lg="3"
            class="relative"
          >
            <v-card
              :to="
                group.subgroup_slug
                  ? `/cx-brainstorm/${group.subgroup_slug}`
                  : '/cx-brainstorm'
              "
              outlined
              rounded="lg"
            >
              <v-img :src="group.image" class="cx__img" :alt="group.title">
                <template #placeholder>
                  <v-skeleton-loader type="image" />
                </template>
              </v-img>
              <v-card-title class="justify-center heading--text py-2">
                <h3>{{ group.title }}</h3>
              </v-card-title>
              <v-divider />
              <!-- card footer -->
              <v-row class="pa-2">
                <v-col cols="3" lg="3" class="group__footer-item pb-1">
                  <div class="cx__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                          <rect class="cx__icon-cls-1" width="24" height="24" />
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
                  <span class="mb-8 ml-n1">{{
                    group.counts.discussions_count
                  }}</span>
                </v-col>
                <v-col cols="3" lg="3" class="group__footer-item pb-1">
                  <div class="cx__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                          <rect class="cx__icon-cls-1" width="24" height="24" />
                          <path
                            class="cx__icon-cls-2"
                            d="M13.34.05A9.31,9.31,0,0,0,4,8.89L1.49,12.25a.69.69,0,0,0,.56,1.08H4v4A2.66,2.66,0,0,0,6.7,20H8v4h9.29V17.72a9.28,9.28,0,0,0-4-17.67m1.33,14.61H12V13.33h2.66v1.33m2.12-6a4,4,0,0,1-1.46,1.43V12h-4V10.11A4,4,0,0,1,9.89,4.7a4,4,0,1,1,6.9,4Z"
                          />
                        </g>
                      </g>
                    </svg>
                  </div>
                  <span class="mb-8 ml-n1">{{ group.counts.ideas_count }}</span>
                </v-col>

                <v-col cols="3" lg="3" class="group__footer-item pb-1">
                  <div class="cx__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                          <rect class="cx__icon-cls-1" width="24" height="24" />
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
                  <span class="mb-8 ml-n1">{{
                    group.counts.questions_count
                  }}</span>
                </v-col>
                <v-col cols="3" lg="3" class="group__footer-item pb-1">
                  <div class="cx__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                          <rect class="cx__icon-cls-1" width="24" height="24" />
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
                  <span class="mb-8 ml-n1">{{ group.counts.maps_count }}</span>
                </v-col>
              </v-row>
            </v-card>
            <template v-if="$auth.loggedIn && group && group.show">
              <v-expand-x-transition>
                <v-card
                  v-if="group.course_id"
                  class="popover transition-scale"
                  rounded="lg"
                >
                  <v-card-title class="primary white--text py-1 px-3">
                    <div>Learning Opportunity</div>
                    <v-spacer />
                    <v-btn icon dark @click="close(group)">
                      <v-icon>{{ mdiClose }}</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text class="greyMuted--text py-2">
                    <template v-if="group.mandatory_course">
                      You have been assigned a mandatory training course that
                      must be completed by
                      <span class="red--text">{{
                        group.course_deadline | toFormattedDateString
                      }}</span
                      >. Click
                      <nuxt-link
                        :to="`/courses/${group.course_id}`"
                        class="font-18"
                      >
                        here
                      </nuxt-link>
                      to view your course.
                    </template>
                    <template v-else>
                      We have got a fantastic course for you to attend. Click
                      <nuxt-link
                        :to="`/courses/${group.course_id}`"
                        class="font-18"
                      >
                        here
                      </nuxt-link>
                      to view your course.
                    </template>
                  </v-card-text>
                </v-card>
              </v-expand-x-transition>
            </template>
          </v-col>
        </v-row>
      </template>
    </v-container>
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
  </div>
</template>

<script>
import {
  mdiClose,
  mdiMap,
  mdiHeadLightbulb,
  mdiAccountQuestion,
  mdiCommentEdit,
} from '@mdi/js';
import { mapState } from 'vuex';

export default {
  name: 'BrainStorm',

  data() {
    return {
      courseDialog: false,
      course: null,
      mdiClose,
      mdiMap,
      mdiHeadLightbulb,
      mdiAccountQuestion,
      mdiCommentEdit,
      drawerStatus: true
    };
  },
  head() {
    return {
      title: 'CX Brainstorm',
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.group.loading,
      groups: (state) => state.group.groups,
    }),
  },
    created() {
    this.$nuxt.$on('drawer-state', (value) => {
      this.drawerStatus = value
    })
  },
  beforeDestroy(){
    this.$nuxt.$off('drawer-state')
},

  async mounted() {
    await this.$store.dispatch('group/getListGroups');
  },
  methods: {
    async openCourseDialog(courseId) {
      const { course } = await this.$axios.$get(
        `api/training/course/${courseId}`
      );
      this.course = course;
      this.$nextTick(() => {
        this.courseDialog = true;
      });
    },
    // close popup
    close(group) {
      this.$store.dispatch('group/markAsClose', group);
    },

    closeCourseDialog() {
      this.courseDialog = false;
      this.$nextTick(() => {
        this.course = null;
      });
    },
    // get list group
    async getListGroups() {
      this.loading = true;
      try {
        const { data } = await this.$axios.$get('api/get-groupList');
        this.groups = data;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
  },
};
</script>
