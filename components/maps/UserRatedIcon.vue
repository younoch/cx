<template>
  <div class="user-rated-icon" :class="userRating.class">
    <v-icon :size="size">
      {{ userRating.icon }}
    </v-icon>
  </div>
</template>

<script>
import {
  mdiEmoticonAngryOutline,
  mdiEmoticonConfusedOutline,
  mdiEmoticonNeutralOutline,
  mdiEmoticonExcitedOutline,
  mdiEmoticonHappyOutline,
} from '@mdi/js';
export default {
  name: 'UserRatedIcon',
  props: {
    rating: {
      type: [String, Number],
      default: '3',
    },
    size: {
      type: Number,
      default: 152,
    },
  },
  computed: {
    userRating() {
      switch (this.rating) {
        case '1':
          return {
            icon: mdiEmoticonAngryOutline,
            class: 'angry',
          };
        case '2':
          return {
            icon: mdiEmoticonConfusedOutline,
            class: 'confused',
          };
        case '3':
          return {
            icon: mdiEmoticonNeutralOutline,
            class: 'neutral',
          };
        case '4':
          return {
            icon: mdiEmoticonHappyOutline,
            class: 'happy',
          };
        case '5':
          return {
            icon: mdiEmoticonExcitedOutline,
            class: 'excited',
          };
        default:
          return {
            icon: mdiEmoticonHappyOutline,
            class: 'excited',
          };
      }
    },
  },
};
</script>
