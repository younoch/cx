<template>
  <v-card v-if="unit" width="100%" max-width="1000" class="gradient mt-5" flat>
    <v-card-title> Lesson {{ unitIndex }}: {{ unit.title }} </v-card-title>
    <v-card-subtitle>
      Available | once you start the course | Estimated time:
      <!-- {{ lesson.estimated_time }} -->
    </v-card-subtitle>
    <v-card-text class="pb-0">
      <v-list
        width="100%"
        class="units pb-0"
        style="
          background-image: linear-gradient(135deg, #21dbaa, #00b4ef, #0768dd);
          background-size: cover;
        "
      >
        <v-list-item-group>
          <v-hover
            v-for="(lesson, index) in unit.lessons.slice(0, clip)"
            :key="index"
            v-slot="{ hover }"
          >
            <v-list-item class="px-0 unit__item">
              <v-list-item-avatar>
                {{ `${unitIndex}.${index}` }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ `${lesson.title}` }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  v-show="hover"
                  small
                  color="primary"
                  @click.stop="$emit('open', { lesson: index })"
                >
                  Start Lesson
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-hover>
          <v-list-item class="unit__reveal">
            <v-list-item-content class="text-center">
              <span
                v-if="collapsed"
                class="white--text"
                @click="collapsed = false"
              >
                See all lesson items
                <v-icon class="white--text">{{ mdiChevronDown }}</v-icon>
              </span>
              <span v-else class="white--text" @click="collapsed = true">
                See less items
                <v-icon class="white--text">{{ mdiChevronUp }}</v-icon>
              </span>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
export default {
  name: 'MapUnits',
  props: {
    unit: {
      type: Object,
      require: true,
      default: null,
    },
    unitIndex: {
      type: Number,
      require: true,
      default: null,
    },
  },
  data() {
    return {
      collapsed: true,
      mdiChevronDown,
      mdiChevronUp,
    };
  },
  computed: {
    clip() {
      return this.collapsed ? 4 : this.unit.lessons.length;
    },
  },
};
</script>
