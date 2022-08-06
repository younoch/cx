<template>
  <v-switch
    v-model="status"
    color="primary"
    true-value="active"
    false-value="inactive"
    class="text-capitalize pt-0"
    :label="status"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: 'ActiveInactiveDialog',
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
