<template>
  <div class="h-100">
    <v-card
      flat
      class="d-flex flex-column w-100 h-100 pa-0 hide-scrollbar"
      tile
    >
      <v-card-title class="primary">
        <span
          class="white--text flex-grow-1 text-center pointer"
          @click="step = 1"
          >{{ course.title }}</span
        >
        <v-btn v-if="showClose" icon dark @click="(step = 1), $emit('close')">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text
        style="flex: 1"
        class="pb-0 w-100 h-100 overflow-auto hide-scrollbar"
      >
        <v-slide-x-reverse-transition>
          <v-container
            v-if="step === 1"
            class="d-flex justify-center h-100 hide-scrollbar"
          >
            <v-card
              flat
              color="grey lighten-4"
              class="overflow-auto custom-scrollbar px-2 my-5 w-100 h-100"
            >
              <v-card-text class="text-center mt-6">
                <v-card-title class="justify-center">
                  <h3 class="mb-3 display-1">Welcome, Hannan!</h3>
                </v-card-title>
                <v-card-subtitle class="headline">
                  <span class="font-weight-bold py-2">Coures Title:</span>
                  Improve your own confidence
                </v-card-subtitle>
              </v-card-text>
              <v-card-text>
                <h2 class="h6 mb-3">Description:</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Labore adipisci nam obcaecati laboriosam repellendus. Minus
                  quas rem atque quo obcaecati itaque iusto hic illo vero error,
                  eaque illum adipisci et? Quos delectus similique velit! Veniam
                  odit eligendi quasi vitae aspernatur, laboriosam modi dolorem
                  eum praesentium incidunt quia dolores quod facere. Odio
                  quaerat harum dolor necessitatibus? Ipsam ea nobis pariatur
                  officiis aliquam magnam nam sit laudantium reprehenderit
                  deleniti! Cum sequi quo repudiandae vitae, magnam, recusandae
                  quibusdam doloremque labore natus dolores accusantium atque
                  asperiores laudantium fuga dignissimos quos placeat, aliquid
                  tempore consequatur sed officia? Numquam tempore aliquid
                  animi? Dolorem, qui officiis ut ipsum modi minus beatae porro
                  temporibus nobis magni! Magnam, aut unde in eos quaerat
                  laborum facere dolorem facilis eum ipsum!
                </p>
              </v-card-text>
              <div class="course-progress-inner">
                <div class="course-progress-bar">
                  <span class="course-progress" />
                </div>
                <span class="course-progress-count">20%</span>
              </div>
              <!-- Unit Item -->
              <v-card max-width="1000" class="my-5 mx-auto" flat outlined>
                <div
                  class="d-flex justify-start align-center px-5"
                  style="border-bottom: 1px solid rgb(225 221 219) !important"
                >
                  <v-avatar
                    color="grey lighten-4"
                    style="border: 1px solid #888 !important"
                    size="40"
                  >
                    <v-icon color="green" class="pa-2">
                      {{ mdiCheck }}
                    </v-icon>
                  </v-avatar>
                  <v-card-title> unit-1: Course Overview </v-card-title>
                </div>
                <v-card-text class="pb-0">
                  <div
                    class="completed-unit-message d-flex justify-space-between"
                  >
                    <div class="course-complete-avater">
                      <img
                        src="~/assets/images/icons/reading-avater.jpg"
                        alt="avater"
                      />
                    </div>
                    <div class="content">
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Sed molestias qui nobis veniam consectetur numquam vel
                        distinctio, officia rerum aliquid vitae labore optio
                        ipsum earum.
                      </p>
                      <span class="green--text font-weight-bold">Complete</span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <!-- Unit Item complete-->
              <v-card max-width="1000" class="my-5 mx-auto" flat outlined>
                <div
                  class="d-flex justify-start align-center px-5"
                  style="border-bottom: 1px solid rgb(225 221 219) !important"
                >
                  <v-avatar
                    color="grey lighten-4"
                    style="border: 1px solid #888 !important"
                    size="40"
                  >
                    1
                  </v-avatar>
                  <v-card-title> unit-1: Course Overview </v-card-title>
                </div>
                <v-card-text class="pb-0">
                  <v-list width="100%" class="units pb-0">
                    <v-list-item-group>
                      <v-list-item
                        v-for="(lesson, index) in lessons"
                        :key="index"
                        style="
                          border-bottom: 1px solid rgb(225 221 219) !important;
                        "
                      >
                        <v-list-item-content>
                          <v-list-item-title>Lesson 2.2</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <!-- this button show after completed unit -->
                          <v-btn v-if="index === 2" text color="success">
                            Complete
                          </v-btn>
                          <v-btn v-else flat depressed color="primary">
                            Start Lesson
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-card>
          </v-container>
        </v-slide-x-reverse-transition>
        <v-slide-x-reverse-transition v-if="step === 2">
          <CourseIndex
            :course="course.id"
            :points="course.total_points"
            @show="openCourseStudy($event.unit, $event.lesson)"
          />
        </v-slide-x-reverse-transition>
        <v-slide-x-reverse-transition>
          <v-container v-if="step === 3" class="pa-0 h-100">
            <CourseStudy
              :course="course.id"
              :users="course.users"
              :unit-no="studyUnit"
              :lesson-no="studyLesson"
              :points="course.total_points"
            />
          </v-container>
        </v-slide-x-reverse-transition>
      </v-card-text>

      <v-card-actions class="container" flat>
        <v-btn
          text
          class="pre_btn"
          :disabled="step < 2"
          color="warning"
          @click="step--"
        >
          Previous
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="step < 2"
          class="next_btn"
          text
          :disabled="step > 1"
          color="success"
          @click="step++"
        >
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import {
  mdiPencil,
  mdiPlusCircle,
  mdiClose,
  mdiCircleMedium,
  mdiChevronDown,
  mdiChevronUp,
  mdiCheck,
} from '@mdi/js';

export default {
  name: 'CoursePage',
  props: {
    course: {
      type: Object,
      require: true,
      default: null,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      step: 1,
      studyLesson: 0,
      studyUnit: 1,
      collapsed: true,
      lessons: [
        { name: 'hello' },
        { name: 'hello' },
        { name: 'hello' },
        { name: 'hello' },
        { name: 'hello' },
      ],
      mdiChevronDown,
      mdiChevronUp,
      mdiPencil,
      mdiPlusCircle,
      mdiClose,
      mdiCircleMedium,
      mdiCheck,
    };
  },
  methods: {
    openCourseStudy(unit, lesson) {
      this.studyUnit = unit;
      this.studyLesson = lesson;
      this.$nextTick(() => {
        this.step = 3;
      });
    },
  },
};
</script>
