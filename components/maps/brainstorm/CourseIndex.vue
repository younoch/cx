<template>
  <v-container
    class="d-flex overflow-auto justify-center h-100 w-100 hide-scrollbar"
    style="max-width: 1000px"
  >
    <div v-if="units" class="w-100 d-flex flex-column">
      <template v-for="(unit, index) in units">
        <Units
          :key="index"
          :unit="unit"
          :unit-index="index"
          @open="$emit('show', { unit: index, lesson: $event.lesson })"
        />
      </template>
    </div>
  </v-container>
</template>
<script>
export default {
  props: {
    course: {
      type: Number,
      require: true,
      default: null,
    },
  },
  data() {
    return {
      units: null,
    };
  },
  async mounted() {
    const { data } = await this.$axios.$get(
      `api/training/course/${this.course}/units`
    );
    this.units = data;
  },
};
</script>
