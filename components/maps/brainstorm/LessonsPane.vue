<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-navigation-drawer v-model="drawer">
          <v-expansion-panels>
            <v-expansion-panel v-for="(lesson, i) in course" :key="i">
              <v-expansion-panel-header>
                {{ `${lesson.lesson_no} ${lesson.lesson_title}` }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <LessonsPane
                  :lesson="lesson"
                  @study="openCourseStudy(index, $event.index)"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-navigation-drawer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';

export default {
  name: 'LessonsPane',
  props: {
    course: {
      type: Object,
      require: true,
      default: null,
    },
    lessonId: {
      type: Number,
      require: true,
      default: null,
    },
    unitId: {
      type: Number,
      require: true,
      default: null,
    },
  },
  data() {
    return {
      more: 4,
      mdiChevronDown,
      mdiChevronUp,
    };
  },
};
</script>
