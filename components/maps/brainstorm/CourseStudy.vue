<template>
  <div fluid class="pa-0 w-100 h-100 d-flex flex-column">
    <div
      class="progress-status-bar d-flex w-100"
      style="position: sticky; top: 0px; border-bottom: 2px solid grey"
    >
      <div class="ranking width300 d-flex align-center px-1">
        <div class="w-100">
          <div class="text-center">Your ranking</div>
          <div class="d-flex justify-space-between mt-2">
            <div
              style="
                border-right: 1px solid grey;
                width: 50%;
                text-align: center;
              "
            >
              <strong>{{ topTenRanking }}</strong>
              <p class="mb-0">Top 10</p>
            </div>
            <div style="width: 50%; text-align: center">
              <strong>{{ users.length }}</strong>
              <p class="mb-0">Total Enrollments</p>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="courseUser"
        class="progress d-flex align-center px-1"
        style="flex: 1"
      >
        <div class="w-100" style="flex: 1">
          <p class="mb-1">
            Your score: {{ courseUser.score }} / {{ courseUser.points }} ({{
              courseUser.progress
            }}%)
          </p>
          <v-progress-linear
            v-model="courseUser.progress"
            color="success"
            striped
            height="10"
            :value="courseUser.progress"
          >
            <small>
              <strong>{{ Math.ceil(courseUser.progress) }}%</strong>
            </small>
          </v-progress-linear>
        </div>
        <v-img
          src="/assets/images/icons/certificate.png"
          max-width="80"
          style="margin-left: 20px; margin-top: 20px"
        />
      </div>
    </div>
    <div class="course-study py-1 w-100 d-flex overflow-auto" style="flex: 1">
      <div class="course-index d-flex flex-column" :class="dynamicWidth">
        <div class="navigation-toggle">
          <v-btn
            v-if="lessonsNavigationDrawer"
            text
            @click="lessonsNavigationDrawer = !lessonsNavigationDrawer"
          >
            <span>Lessons Navigator</span>
            <v-icon>{{ mdiChevronDoubleLeft }}</v-icon>
          </v-btn>
          <v-tooltip v-else right>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                text
                v-on="on"
                @click="lessonsNavigationDrawer = !lessonsNavigationDrawer"
              >
                <v-icon>
                  {{
                    lessonsNavigationDrawer
                      ? mdiChevronDoubleLeft
                      : mdiChevronDoubleRight
                  }}
                </v-icon>
              </v-btn>
            </template>
            <span>Lessons Navigator</span>
          </v-tooltip>
        </div>
        <v-navigation-drawer
          v-model="lessonsNavigationDrawer"
          style="flex: 1; box-shadow: unset"
          class="overflow-auto lessons-drawer pa-2"
          :class="lessonsNavigationDrawer ? '' : 'd-none'"
          width="100%"
          permanent
          :mini-variant="!lessonsNavigationDrawer"
          color="grey lighten-3"
        >
          <v-expansion-panels v-model="panel" multiple>
            <v-expansion-panel
              v-for="(unit, unitIndex) in units"
              :key="unitIndex"
              elevation="0"
            >
              <v-expansion-panel-header class="pa-1">
                <v-list-item-avatar class="mr-0" style="max-width: 40px">
                  {{ `${unitIndex + 1}` }}
                </v-list-item-avatar>
                {{ `${unit.title}` }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list nav dense class="py-0 pr-0">
                  <v-list-item-group>
                    <v-list-item
                      v-for="(lesson, lessonIndex) in unit.lessons"
                      :key="lessonIndex"
                      class="px-0"
                      @click="
                        studyLesson = units[unitIndex].lessons[lessonIndex]
                      "
                    >
                      <v-list-item-content class="mx-3">
                        <v-list-item-title>
                          {{ `${unitIndex}.${lessonIndex} ${lesson.title}` }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-navigation-drawer>
      </div>
      <div
        v-if="studyLesson"
        class="course-content h-100 w-100 px-2"
        style="flex: 1"
      >
        <v-tabs-items v-model="contentTab">
          <v-tab-item
            v-for="(content, contentIndex) in studyLesson.contents"
            :key="contentIndex"
          >
            <v-card flat>
              <template v-if="content.type === 'document'">
                <div class="player-wrapper w-100 h-100">
                  <div class="player">
                    <iframe
                      :src="`https://docs.google.com/viewer?embedded=true&url=${content.content}`"
                      style="width: 100%; height: 100%"
                      frameborder="0"
                      allowfullscreen
                    />
                  </div>
                </div>
              </template>
              <template v-else-if="content.type === 'video'">
                <client-only>
                  <video-embed class="w-100" :src="content.content" />
                </client-only>
              </template>
              <template v-else-if="content.type === 'text'">
                <div v-html="content.content" />
              </template>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
        <v-tabs v-model="contentTab" centered>
          <v-tabs-slider color="primary" />
          <v-tab
            v-for="(content, contentIndex) in studyLesson.contents"
            :key="contentIndex"
          >
            {{ contentIndex + 1 }}
          </v-tab>
        </v-tabs>
        <v-subheader>Questions</v-subheader>
        <div v-if="studyLesson.questions" class="px-5">
          <validation-observer
            ref="form"
            v-slot="{ handleSubmit, passed, reset, dirty }"
          >
            <v-form
              @reset.prevent="reset"
              @submit.prevent="handleSubmit(submitAnswer)"
            >
              <div
                v-for="(question, questionIndex) in studyLesson.questions"
                :key="questionIndex"
              >
                <h4>{{ question.title }}</h4>
                <validation-provider rules="required">
                  <v-radio-group
                    v-model="question.userAnswer"
                    class="px-5"
                    :disabled="!!studyLesson.userScore"
                  >
                    <v-radio
                      v-for="(answer, answerIndex) in question.answers"
                      :key="answerIndex"
                      :label="answer.title"
                      :value="answerIndex"
                    />
                  </v-radio-group>
                </validation-provider>
              </div>
              <div v-if="!studyLesson.userScore">
                <v-spacer />
                <v-btn
                  type="submit"
                  :loading="processing"
                  class="primary"
                  :disabled="!(dirty && passed)"
                  left
                >
                  Update
                </v-btn>
              </div>
            </v-form>
          </validation-observer>
        </div>
      </div>
    </div>
    <!-- welcome message popup -->
    <v-dialog
      v-model="congratulationPopUp"
      style="border-radious: 30px"
      content-class="rounded-xl"
      max-width="350"
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
        <v-card-text class="text-center">
          Thanks for being such a premium member in our community
        </v-card-text>

        <v-card-actions class="justify-center pb-5">
          <v-btn
            class="ma-2 welcome-skip-btn rounded-xl"
            color="primary"
            @click="congratulationPopUp = false"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  mdiChevronDown,
  mdiChevronUp,
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
} from '@mdi/js';

export default {
  name: 'CourseStudy',
  props: {
    course: {
      type: Number,
      require: true,
      default: null,
    },
    unitNo: {
      type: Number,
      require: true,
      default: null,
    },
    lessonNo: {
      type: Number,
      require: true,
      default: null,
    },
    points: {
      type: Number,
      require: true,
      default: 0,
    },
    users: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      contentTab: null,
      processing: false,
      courseUser: null,
      units: null,
      studyLesson: null,
      progress: 30,
      lessonsNavigationDrawer: true,
      topTenRanking: 0,
      panel: [0],
      congratulationPopUp: false,
      mdiChevronDown,
      mdiChevronUp,
      mdiChevronDoubleLeft,
      mdiChevronDoubleRight,
    };
  },
  computed: {
    dynamicWidth() {
      return this.lessonsNavigationDrawer ? 'width300' : 'width50';
    },
    user() {
      return this.$auth.user;
    },
  },
  async mounted() {
    const { courseUser } = await this.$axios.$get(
      `api/training/course/${this.course}/start`
    );
    this.courseUser = courseUser;
    this.congratulationPopUp = courseUser.passed;
    const { data } = await this.$axios.$get(
      `api/training/course/${this.course}/units`
    );
    this.units = data;
    this.studyLesson = this.units[this.unitNo].lessons[this.lessonNo];

    this.checkUserInTopTen();
  },
  methods: {
    async submitAnswer() {
      this.processing = false;
      try {
        const { message, courseUser, userScore } = await this.$axios.$post(
          `api/training/course/${this.course}/${this.studyLesson.id}/answers`,
          this.studyLesson.questions
        );
        this.studyLesson.userScore = userScore;
        this.courseUser = courseUser;
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.processing = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
    checkUserInTopTen() {
      const userIndex = this.users.findIndex(
        (user) => user.id === this.$auth.user.id
      );
      if (userIndex <= 9) {
        this.topTenRanking = userIndex + 1;
      } else {
        this.topTenRanking = 0;
      }
    },
  },
};
</script>
