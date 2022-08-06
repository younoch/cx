<template>
  <v-container class="py-0">
    <v-switch
      v-model="status"
      color="primary"
      true-value="active"
      false-value="inactive"
      class="text-capitalize"
      :label="status"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </v-container>
</template>

<script>
export default {
  name: 'ActiveInactive',
  props: {
    value: {
      type: String,
      default: 'active',
    },
  },
  data: () => ({
    status: 'active',
  }),
  watch: {
    // Handles internal model changes.
    status(newVal) {
      this.$emit('input', newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.status = newVal;
    },
  },
  created() {
    if (this.value) {
      this.status = this.value;
    }
  },
};
</script>
