<template>
  <v-container class="mb-10">
    <v-row>
      <!-- Units & lesson sidebar -->
      <v-col cols="12" lg="3" md="4" :sm="drawerStatus ? 12 : 4">
        <v-card flat outlined class="rounded-lg overflow-hidden mt-10">
          <template v-if="false">
            <v-skeleton-loader class="mt-5" type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
          </template>
          <!-- units -->

          <v-expansion-panels v-else v-model="activeUnitIndex" accordion>
            <v-expansion-panel
              v-for="(unit, unitIndex) in units"
              :key="'unit' + unitIndex"
            >
              <v-expansion-panel-header>
                <v-btn
                  v-if="unit.id == $route.params.unit"
                  color="primary"
                  width="100%"
                  class="rounded-pill px-5"
                  outlined
                >
                  <span class="font-weight-medium text--secondary"
                    >{{ unit.title }}
                  </span>
                </v-btn>

                <span v-else class="font-weight-medium text--secondary"
                  >{{ unit.title }}
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list v-model="activeLessonId" nav dense class="px-0">
                  <v-list-item
                    v-for="lessonItem in unit.lessons"
                    :key="lessonItem.id"
                    :class="activeLessonId === lessonItem.id ? 'greyLight' : ''"
                  >
                    <v-list-item-icon class="mr-0 align-center">
                      <v-icon
                        v-if="lessonItem.userProgress === 'completed'"
                        color="success"
                        size="14"
                      >
                        {{ mdiCheck }}
                      </v-icon>
                      <v-icon
                        v-else
                        size="14"
                        :color="
                            lessonProgress(lessonItem.userProgress)
                              ? ''
                              : 'primary',
                          "
                      >
                        {{
                          lessonProgress(lessonItem.userProgress)
                            ? mdiCheckboxBlankCircleOutline
                            : mdiLockOutline
                        }}
                      </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <nuxt-link
                        :to="`/courses/${course.id}/units/${unit.id}/lessons/${lessonItem.id}/${lessonItem.slug}`"
                      >
                        <v-list-item-title class="text-wrap">
                          <div
                            class="d-flex justify-space-between text--secondary"
                          >
                            {{ lessonItem.title }}
                            <div
                              v-if="
                                activeLessonId === lessonItem.id &&
                                lessonProgress(lessonItem.userProgress)
                              "
                              class="text-center"
                            >
                              <v-chip x-small class="ml-1">
                                You're here
                              </v-chip>
                            </div>
                          </div>
                        </v-list-item-title>
                      </nuxt-link>

                      <!-- <v-list-item-subtitle
                          @click="bookmark(unitIndex, lessonItem.id)"
                        >
                          <div
                            class="d-flex justify-space-between align-center"
                          >
                            <span>12:12</span>
                            <v-icon
                              v-if="!lessonItem.isBookmark"
                              size="14"
                              color="primary"
                              >{{ mdiBookmarkOutline }}</v-icon
                            >
                            <v-icon v-else size="14" color="primary">{{
                              mdiBookmark
                            }}</v-icon>
                          </div>
                        </v-list-item-subtitle> -->
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-divider />
          </v-expansion-panels>
        </v-card>
      </v-col>
      <!-- Content wrapper -->
      <v-col cols="12" lg="6" md="8" :sm="drawerStatus ? 12 : 8">
        <template v-if="lessonLoading">
          <v-skeleton-loader
            height="340"
            class="my-5"
            type="table-heading, list-item-two-line, image, table-tfoot"
          />
        </template>
        <template v-else>
          <v-card class="rounded-lg overflow-hidden mt-3" flat outlined>
            <v-row>
              <v-col cols="12" md="7">
                <v-card-text>
                  <h2 class="mb-3">
                    {{ courseInfo.title }}
                  </h2>
                  <p class="pb-0">
                    {{ courseInfo.welcomeText }}
                  </p>
                </v-card-text>
              </v-col>
              <v-col cols="12" md="5">
                <v-card-text>
                  <v-img
                    class="rounded-sm"
                    :src="
                      require('assets/images/courses/course-module-thumb.jpg')
                    "
                  />
                </v-card-text>
              </v-col>
            </v-row>
            <!-- progress bar -->
            <div class="course-progress-inner">
              <div class="course-progress-bar">
                <span
                  class="course-progress"
                  :style="{
                    width:
                      userTotalPersentage > 100
                        ? 100
                        : userTotalPersentage + '%',
                  }"
                />
              </div>
              <span class="course-progress-count"
                >{{
                  userTotalPersentage > 100 ? 100 : userTotalPersentage
                }}%</span
              >
            </div>
            <v-divider class="my-4" />
            <template v-if="lessonLoading">
              <v-skeleton-loader type="image, article" />
            </template>
            <!-- content area -->
            <template v-else>
              <v-card-text v-if="lessonProgress(lesson.userProgress)">
                <div v-html="lessonContent" />
              </v-card-text>
              <template v-else>
                <v-card
                  min-height="400"
                  class="text-center d-flex align-center justify-center"
                >
                  <div>
                    <v-icon size="50">
                      {{ mdiLockOutline }}
                    </v-icon>
                    <h3 class="text--text">This Lesson is Lock</h3>
                  </div>
                </v-card>
              </template>
            </template>
          </v-card>
          <!-- paginations -->
          <v-row v-if="lesson.contents.length > 1">
            <v-col cols="12">
              <div class="text-center mt-5">
                <v-pagination
                  v-model="pageIndex"
                  :length="lesson.contents.length"
                  circle
                  @input="updatePage"
                />
              </div>
            </v-col>
          </v-row>
        </template>
      </v-col>
      <!-- Related courses sidebar -->
      <v-col cols="12" lg="3" class="d-none d-lg-block">
        <v-card
          color="background"
          flat
          class="rounded-lg overflow-hidden mt-10"
        >
          <v-card-title>Related Courses</v-card-title>
          <template v-if="false">
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
          </template>
          <v-list v-else color="background" three-line class="py-0">
            <template v-for="(course, i) in relatedCourses">
              <v-list-item :key="'course' + i" :to="`/courses/${course.id}`">
                <v-list-item-avatar width="90" height="60" class="rounded-sm">
                  <v-img v-if="course.image" :src="course.image" />
                  <video v-else controls :src="course.promoVideo" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <span class="text-uppercase text--secondary text-caption"
                    >course</span
                  >
                  <v-list-item-title class="text-wrap">
                    {{ course.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ course.users }} learners
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider :key="'courseDivider' + i" />
            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <!-- Quetion inner -->
    <v-row justify="center">
      <template v-if="lessonLoading">
        <v-card width="50%" height="300">
          <v-row>
            <v-col cols="12" sm="3">
              <v-card flat width="300">
                <v-skeleton-loader type="article"></v-skeleton-loader>
              </v-card>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card flat width="300">
                <v-skeleton-loader type="article"></v-skeleton-loader>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </template>
      <template v-else>
        <v-col
          v-if="lessonProgress(lesson.userProgress)"
          cols="12"
          lg="6"
          md="8"
          :sm="drawerStatus ? 12 : 8"
        >
          <v-card v-if="lesson.questions.length > 0" flat class="my-5">
            <v-toolbar flat>
              <v-spacer />
              <v-toolbar-title>
                <h4 class="text-center font-weight-medium">Questions</h4>
              </v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-divider />
            <div
              class="d-flex flex-column ml-md-13 ml-sm-5 justify-center pt-5"
            >
              <v-card
                v-for="(question, index) in lesson.questions"
                :key="'quetion' + index"
                flat
                max-width="800"
                class="justify-center"
              >
                <h3 class="float-left h-4 font-weight pl-4">
                  Question {{ index + 1 }}
                </h3>
                <v-card-text>
                  <v-radio-group
                    v-model="question.userAnswer"
                    :disabled="lesson.userProgress === 'completed'"
                  >
                    <template #label>
                      <h4 class="mb-3">
                        {{ question.title }}
                      </h4>
                    </template>
                    <v-radio
                      v-for="(option, i) in question.answers"
                      :key="'option' + i"
                      :value="i"
                      @click="addToQuestions(option)"
                    >
                      <template #label>
                        <div>{{ option.title }}</div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-card-text>
              </v-card>
            </div>
          </v-card>

          <div class="text-right mt-8">
            <v-btn
              v-if="
                lesson.userProgress !== 'completed' && questionAnswer.length > 0
              "
              color="primary"
              class="px-10 text-capitalize"
              rounded
              elevation="1"
              @click="submitAnswer()"
            >
              {{ lesson.questions.length > 0 ? 'Submit' : 'Continue' }}
            </v-btn>
          </div>
        </v-col>
      </template>
    </v-row>

    <!-- Action bottons -->
    <v-row v-if="units.length > 0" class="mt-8">
      <v-col cols="6">
        <div v-if="units[0].lessons[0].id !== activeLessonId" class="text-left">
          <v-btn
            color="primary"
            class="
              px-6
              text-capitalize
              font-weight-bold
              text-subtitle-1
              whiteBackground
            "
            rounded
            outlined
            elevation="3"
            @click="getPrevLesson"
          >
            Previews
          </v-btn>
        </div>
      </v-col>
      <v-col cols="6">
        <div
          v-if="
            units[units.length - 1].lessons[
              units[units.length - 1].lessons.length - 1
            ].id !== activeLessonId ||
            (lesson.questions && lesson.questions.length === 0)
          "
          class="text-right"
        >
          <v-btn
            color="primary"
            elevation="3"
            class="
              px-10
              text-capitalize
              font-weight-bold
              text-subtitle-1
              whiteBackground
            "
            rounded
            outlined
            @click="
              lesson.questions && lesson.questions.length === 0
                ? submitAnswer()
                : getNextLesson()
            "
          >
            Next
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-8" />

    <!-- Random Related course -->
    <v-row>
      <v-col cols="9" class="pb-0" md="10">
        <h2 class="font-weight-medium text-sm-h5 subtitle-1">
          Other courses you might be interested in
        </h2>
      </v-col>
      <v-col cols="3" md="2" class="pb-0">
        <v-card-actions>
          <v-spacer />
          <v-icon @click="SlideCarousel('prev', 'randomCoursesCarosel')">
            {{ mdiChevronLeftCircleOutline }}
          </v-icon>
          <v-icon @click="SlideCarousel('next', 'randomCoursesCarosel')">
            {{ mdiChevronRightCircleOutline }}
          </v-icon>
        </v-card-actions>
      </v-col>
      <v-container class="px-3">
        <carousel
          ref="randomCoursesCarosel"
          :pagination-enabled="false"
          :scroll-per-page="true"
          :per-page-custom="[
            [280, 1],
            [415, 3],
            [769, 5],
            [1800, 7],
          ]"
        >
          <slide
            v-for="(course, index) in randomCourses"
            :key="'randomCourse' + index"
          >
            <v-card
              :to="`/courses/${course.id}`"
              flat
              class="mr-5 carousel-slide-item"
            >
              <template slot="progress">
                <v-progress-linear
                  color="deep-purple"
                  height="10"
                  indeterminate
                />
              </template>

              <v-img
                v-if="course.image || !course.promoVideo"
                height="100"
                :src="course.image"
                max-width="336"
                min-width="100%"
              />
              <video
                v-if="!course.image && course.promoVideo"
                controls
                height="100"
                width="auto"
                class="width-full"
                :src="course.promoVideo"
              />

              <v-card-title :title="course.title" class="body-2 px-1 py-1">
                {{ course.title ? course.title.substring(0, 25) : '' }}...
              </v-card-title>
              <v-card-text class="px-1 py-1">
                <div>By: {{ course.createdBy }}</div>
              </v-card-text>
            </v-card>
          </slide>
        </carousel>
      </v-container>
    </v-row>

    <!-- 30 minutes or less -->
    <v-row>
      <v-col cols="9" md="10" class="pb-0">
        <h2 class="font-weight-medium text-sm-h5 subtitle-1">
          Most Popular Courses
        </h2>
      </v-col>
      <v-col cols="3" md="2" class="pb-0">
        <v-card-actions>
          <v-spacer />
          <v-icon @click="SlideCarousel('prev', 'MostPopularCoursesCarosel')">
            {{ mdiChevronLeftCircleOutline }}
          </v-icon>
          <v-icon @click="SlideCarousel('next', 'MostPopularCoursesCarosel')">
            {{ mdiChevronRightCircleOutline }}
          </v-icon>
        </v-card-actions>
      </v-col>
      <v-container class="px-3">
        <carousel
          ref="MostPopularCoursesCarosel"
          :pagination-enabled="false"
          :scroll-per-page="true"
          :per-page-custom="[
            [280, 1],
            [415, 3],
            [769, 5],
            [1800, 7],
          ]"
        >
          <slide
            v-for="(course, index) in mostPopularCourses"
            :key="'randomCourse' + index"
          >
            <v-card
              :to="`/courses/${course.id}`"
              flat
              class="mr-5 carousel-slide-item"
            >
              <template slot="progress">
                <v-progress-linear
                  color="deep-purple"
                  height="10"
                  indeterminate
                />
              </template>

              <v-img
                v-if="course.image || !course.promoVideo"
                height="100"
                :src="course.image"
                max-width="336"
                min-width="100%"
              />
              <video
                v-if="!course.image && course.promoVideo"
                controls
                height="100"
                width="auto"
                class="width-full"
                :src="course.promoVideo"
              />

              <v-card-title :title="course.title" class="body-2 px-1 py-1">
                {{ course.title ? course.title.substring(0, 25) : '' }}...
              </v-card-title>
              <v-card-text class="px-1 py-1">
                <div>By: {{ course.createdBy }}</div>
              </v-card-text>
            </v-card>
          </slide>
        </carousel>
      </v-container>
    </v-row>

    <!-- congratulation message popup -->
    <v-dialog
      v-model="courseCompleted.completed"
      content-class="rounded-xl"
      max-width="340"
      persistent
    >
      <v-card>
        <div class="welcome-img">
          <img
            src="~/assets/images/icons/congratulation.png"
            alt="welcome avater"
          />
        </div>

        <v-card-title class="text-h5 pt-7 justify-center">
          Congratulation!
        </v-card-title>
        <v-card
          height="200"
          class="text-center overflow-auto custom-scrollbar"
          v-html="courseCompleted.congratulationMessage"
        />

        <v-card-actions class="justify-center pb-5">
          <v-btn
            class="ma-2 welcome-skip-btn rounded-xl"
            color="blue darken-2"
            @click="courseComplete"
          >
            <span class="white--text">Continue</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import {
  mdiLockOutline,
  mdiCheckboxBlankCircleOutline,
  mdiBookmarkOutline,
  mdiBookmark,
  mdiCheck,
  mdiChevronLeftCircleOutline,
  mdiChevronRightCircleOutline,
} from '@mdi/js';
export default {
  name: 'SingleCourse',
  data() {
    return {
      courseInfo: {},
      activeUnitIndex: 0,
      activeLessonId: 0,
      activeUnit: null,
      prevUnit: null,
      nextUnit: null,
      previousLesson: null,
      nextLesson: null,
      pageIndex: 1,
      activePage: 0,
      courseCompleted: {},
      loading: true,
      lessonLoading: true,
      questionAnswer: [],
      lesson: {},
      mdiLockOutline,
      mdiCheckboxBlankCircleOutline,
      mdiBookmarkOutline,
      mdiBookmark,
      mdiCheck,
      mdiChevronLeftCircleOutline,
      mdiChevronRightCircleOutline,
      drawerStatus: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    ...mapState('tranning', [
      'units',
      'course',
      'passPercentage',
      'totalPoints',
      'relatedCourses',
      'randomCourses',
      'mostPopularCourses',
    ]),
    ...mapGetters('tranning', ['userPoints', 'getTotalPersentageWithoutScore']),
    ...mapState('notification', ['notifications']),
    userTotalPersentage() {
      return Math.ceil(
        this.totalPoints > 0
          ? (this.userPoints / this.totalPoints) * this.passPercentage
          : this.getTotalPersentageWithoutScore
      );
    },
    lessonContent() {
      const content = this.lesson.contents[this.activePage];
      return content ? content.content : '';
    },
  },
  created() {
    this.$nuxt.$on('drawer-state', (value) => {
      this.drawerStatus = value;
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('drawer-state');
  },
  async mounted() {
    if (this.units.length > 0) {
      try {
        const { course } = await this.$axios.$get(
          `api/training/course/${this.$route.params.course}/start`
        );
        this.courseInfo = course;
        this.loading = false;
        this.getLesson();
        this.findPrevNextLesson();
      } catch (error) {
        console.log(error);
      }
    } else {
      this.$router.push(`/courses/${this.$route.params.course}`);
    }

    if (this.relatedCourses.length === 0) {
      this.getRelatedCourses();
    }
    if (this.randomCourses.length === 0) {
      this.getRandomCourses();
    }
    if (this.mostPopularCourses.length === 0) {
      this.getMostPopulars();
    }
  },
  methods: {
    async getRandomCourses() {
      try {
        const res = await this.$axios.$get(`api/training/random/course`);
        this.$store.commit('tranning/SET_RANDOM_COURSES', res.data);
      } catch (error) {
        console.log(error);
      }
    },

    addToQuestions(question) {
      this.questionAnswer.push(question);
    },

    async getMostPopulars() {
      try {
        const res = await this.$axios.$get(`api/training/most-popular/course`);
        this.$store.commit('tranning/SET_MOST_POPULAR_COURSES', res.data);
      } catch (error) {
        console.log(error);
      }
    },

    async getRelatedCourses() {
      try {
        const res = await this.$axios.$get(
          `api/training/related/course/${this.$route.params.course}`
        );
        this.$store.commit('tranning/SET_RELATED_COURSES', res.data);
      } catch (error) {
        console.log(error);
      }
    },

    async getLesson() {
      const lessonId = this.$route.params.id;
      try {
        const { data } = await this.$axios.$get(
          `api/training/lessons/${lessonId}`
        );
        this.lessonLoading = false;
        this.lesson = data;
      } catch (error) {}
    },
    updatePage() {
      this.activePage = this.pageIndex - 1;
    },
    getNextLesson() {
      const activeUnitLastLessonId =
        this.activeUnit.lessons[this.activeUnit.lessons.length - 1].id;

      if (activeUnitLastLessonId === this.activeLessonId) {
        this.$router.push(
          `/courses/${this.courseInfo.id}/units/${this.nextUnit.id}/lessons/${this.nextUnit.lessons[0].id}/${this.nextUnit.lessons[0].slug}`
        );
      } else {
        this.$router.push(
          `/courses/${this.$route.params.course}/units/${this.activeUnit.id}/lessons/${this.nextLesson.id}/${this.nextLesson.slug}`
        );
      }
    },
    getPrevLesson() {
      const activeUnitFastLessonId = this.activeUnit.lessons[0].id;

      if (activeUnitFastLessonId === this.activeLessonId) {
        this.$router.push(
          `/courses/${this.courseInfo.id}/units/${this.prevUnit.id}/lessons/${
            this.prevUnit.lessons[this.prevUnit.lessons.length - 1].id
          }/${this.prevUnit.lessons[this.prevUnit.lessons.length - 1].slug}`
        );
      } else {
        this.$router.push(
          `/courses/${this.$route.params.course}/units/${this.activeUnit.id}/lessons/${this.previousLesson.id}/${this.previousLesson.slug}`
        );
      }
    },
    async submitAnswer() {
      try {
        const res = await this.$axios.$post(
          `api/training/course/${this.$route.params.course}/${this.$route.params.id}/answers`,
          this.lesson.questions
        );

        this.courseCompleted.congratulationMessage =
          res.courseUser.congratulationMessage;
        this.courseCompleted.completed = res.courseUser.completed;

        this.$store.commit('CRUD_SUCCESS_NO_ACTION', res.message);
        this.$store.commit('tranning/UPDATE_USER_POINT', res.courseUser.score);
        this.$store.commit('tranning/UPDATE_USER_LESSON_STATUS', {
          lessonId: this.$route.params.id,
          status: 'completed',
        });

        //  complete need to update notification
        if (res.courseUser.completed) {
          this.courseNotificationMarkAsRead(this.$route.params.course);
        }

        const activeUnitLastLessonId =
          this.activeUnit.lessons[this.activeUnit.lessons.length - 1].id;

        const lessonId =
          activeUnitLastLessonId === this.activeLessonId
            ? this.nextUnit.lessons[0].id
            : this.nextLesson.id;

        if (lessonId) {
          const response = await this.$axios.$get(
            `api/training/lessons/${lessonId}/progress`
          );
          this.$store.commit('tranning/UPDATE_LESSON_STATUS', response.data);
          this.getNextLesson();
        }
      } catch (error) {
        console.log(error);
      }
    },
    courseNotificationMarkAsRead(courseId) {
      this.notifications
        .filter((item) => {
          if (item.data.course !== undefined) {
            if (Number(item.data.course.id) === Number(courseId)) {
              return item;
            } else {
              return null;
            }
          } else {
            return null;
          }
        })
        .forEach(async (notification) => {
          await this.$axios.$get(
            `api/notification/mark-as-read/${notification.id}`
          );
          this.$store.commit(
            'notification/MARK_POST_NOTIFICATION_READ',
            notification.id
          );
        });
    },
    findPrevNextLesson() {
      this.activeUnitIndex = this.units.findIndex(
        (_unit) => _unit.id === +this.$route.params.unit
      );

      if (this.activeUnitIndex > -1) {
        this.activeUnit = this.units[this.activeUnitIndex];
        this.nextUnit = this.units[this.activeUnitIndex + 1];
        this.prevUnit = this.units[this.activeUnitIndex - 1];

        const index = this.activeUnit.lessons.findIndex(
          (_lesson) => _lesson.id === +this.$route.params.id
        );

        if (index > -1) {
          this.activeLessonId = this.activeUnit.lessons[index].id;
          this.previousLesson = this.activeUnit.lessons[index - 1];
          this.nextLesson = this.activeUnit.lessons[index + 1];
        }
      }
    },
    courseComplete() {
      this.courseCompleted = {};
      this.$router.push('/cx-brainstorm');
    },
    lessonProgress(userProgress) {
      return ['completed', 'inProgress'].includes(userProgress);
    },

    async bookmark(unitIndex, lessonId) {
      try {
        await this.$axios.$get(
          `api/training/course/${this.$route.params.course}/${lessonId}/bookmark`
        );

        this.$store.commit('tranning/UPDATE_LESSON_BOOKMARK', {
          unitIndex,
          lessonId,
        });
      } catch (error) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          error.response && error.response.data.message
        );
      }
    },
    SlideCarousel(value, caroselName) {
      const carousel = this.$refs[caroselName];
      const currentPage = carousel.currentPage;
      const pageCount = carousel.pageCount;
      if (value === 'prev') {
        currentPage !== 0
          ? carousel.goToPage(currentPage - 1)
          : carousel.goToPage(pageCount - 1);
      } else {
        currentPage < pageCount - 1
          ? carousel.goToPage(currentPage + 1)
          : carousel.goToPage(0);
      }
    },
  },
};
</script>