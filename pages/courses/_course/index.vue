<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col cols="12">
        <template v-if="loading">
          <v-skeleton-loader
            class="my-5"
            type="table-heading, list-item-two-line, image, table-tfoot"
          />
        </template>
        <v-card
          v-else
          flat
          class="overflow-auto custom-scrollbar my-5"
          outlined
        >
          <v-toolbar color="primary" dark flat>
            <v-spacer />
            <v-toolbar-title>
              <h3 class="font-weight-regular">
                {{ course.title }}
              </h3>
            </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text class="text-center mt-6">
            <v-card-title class="justify-center">
              <h3 class="mb-3 display-1 font-weight-bold">
                Welcome, {{ user.name }}!
              </h3>
            </v-card-title>
            <v-card-subtitle class="headline">
              <span class="font-weight-bold py-2">Course Title:</span>
              {{ course.subtitle }}
            </v-card-subtitle>
          </v-card-text>
          <v-card-text v-if="course.description">
            <h2 class="h6 mb-3">Description:</h2>
            <div
              class="d-block course-description"
              v-html="course.description"
            />
          </v-card-text>
          <v-card-text>
            <v-row>
              <v-col
                v-if="course.image"
                class="d-flex child-flex"
                :cols="course.promoVideo ? 6 : 12"
              >
                <v-img
                  cover
                  :src="course.image"
                  :lazy-src="course.image"
                  class="grey lighten-2"
                >
                  <template #placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      />
                    </v-row>
                  </template>
                </v-img>
              </v-col>
              <v-col
                v-if="course.promoVideo"
                class="d-flex"
                :cols="course.image ? 6 : 12"
              >
                <video
                  height="300"
                  width="100%"
                  controls
                  :src="course.promoVideo"
                />
              </v-col>
            </v-row>
          </v-card-text>

          <div class="course-progress-inner mt-10">
            <div class="course-progress-bar">
              <span
                class="course-progress"
                :style="{
                  width:
                    userTotalPersentage > 100 ? 100 : userTotalPersentage + '%',
                }"
              />
            </div>
            <span class="course-progress-count"
              >{{
                userTotalPersentage > 100 ? 100 : userTotalPersentage
              }}%</span
            >
          </div>
          <!-- Unit Item complete-->
          <v-card
            v-for="(unit, index) in course.units"
            :key="index"
            max-width="1000"
            class="my-5 mx-auto"
            flat
            outlined
          >
            <div class="d-flex justify-start align-center px-5 boder-bottom-2">
              <v-avatar color="grey lighten-4 border-1" size="40">
                <v-icon
                  v-if="isThisUnitIsCompleted(unit)"
                  color="success"
                  class="pa-2"
                >
                  {{ mdiCheck }}
                </v-icon>
                <span v-else>{{ index + 1 }}</span>
              </v-avatar>
              <v-card-title>
                Unit-{{ index + 1 }}: {{ unit.title }}
              </v-card-title>
            </div>
            <!-- if unit completed -->
            <v-card-text v-if="unit.description" class="pb-0">
              <div class="completed-unit-message d-flex justify-space-between">
                <div class="content ml-0" v-html="unit.description" />
              </div>
            </v-card-text>
            <v-card-text class="pa-0">
              <v-list width="100%" class="units pt-0 pb-0">
                <v-list-item-group>
                  <v-list-item
                    v-for="(lesson, i) in unit.lessons"
                    :key="lesson.id"
                    class="border-bottom-2"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        Lesson {{ `${index + 1}:${i + 1}` }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <!-- this button show after completed unit -->
                      <v-btn
                        v-if="lesson.userProgress === 'completed'"
                        rounded
                        color="success"
                        class="
                          text-capitalize
                          font-weight-bold
                          text-subtitle-1
                          px-6
                          font-weight-black
                        "
                        @click="startCourse(unit.id, lesson)"
                      >
                        Complete
                      </v-btn>
                      <v-btn
                        v-else-if="lesson.userProgress === 'inProgress'"
                        rounded
                        outlined
                        elevation="2"
                        class="
                          text-capitalize
                          font-weight-bold
                          text-subtitle-1
                          font-weight-black
                          px-5
                        "
                        color="warning"
                        nuxt
                        @click="startCourse(unit.id, lesson)"
                      >
                        In Progress
                      </v-btn>
                      <v-btn
                        v-else
                        rounded
                        elevation="2"
                        outlined
                        class="
                          text-capitalize
                          font-weight-bold
                          text-subtitle-1
                          font-weight-black
                          px-4
                        "
                        color="primary"
                        nuxt
                        @click="startCourseWithInProgress(unit.id, lesson)"
                      >
                        Start Lesson
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-row class="mb-5">
      <v-col cols="6">
        <v-btn elevation="3" rounded>Previews</v-btn>
      </v-col>
      <v-col cols="6">
        <div class="text-right">
          <v-btn color="primary" elevation="3" class="px-6" rounded>Next</v-btn>
        </div>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { mdiCheck } from '@mdi/js';

export default {
  name: 'CoursePage',
  data() {
    return {
      loading: true,
      mdiCheck,
    };
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user ? this.$auth.user : '';
    },
    ...mapState('tranning', ['course', 'passPercentage', 'totalPoints']),
    ...mapGetters('tranning', ['userPoints', 'getTotalPersentageWithoutScore']),
    userTotalPersentage() {
      return Math.ceil(
        this.totalPoints > 0
          ? (this.userPoints / this.totalPoints) * this.passPercentage
          : this.getTotalPersentageWithoutScore
      );
    },
  },
  async mounted() {
    try {
      this.loading = false;
      await this.$store.dispatch(
        'tranning/getCourseInfo',
        this.$route.params.course
      );
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    startCourse(unitId, lesson) {
      this.$router.push(
        `/courses/${this.$route.params.course}/units/${unitId}/lessons/${lesson.id}/${lesson.slug}`
      );
    },
    async startCourseWithInProgress(unitId, lesson) {
      try {
        await this.$axios.$get(`api/training/lessons/${lesson.id}/progress`);

        this.$router.push(
          `/courses/${this.$route.params.course}/units/${unitId}/lessons/${lesson.id}/${lesson.slug}`
        );
      } catch (error) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          error.response && error.response.data.message
        );
      }
    },
    isThisUnitIsCompleted(unit) {
      let completed = false;
      unit.lessons.map((item) => {
        if (item.userProgress === 'completed') {
          completed = true;
        } else {
          completed = false;
        }
        return item;
      });
      return completed;
    },
  },
};
</script>
