<template>
  <validation-provider
    v-slot="{ errors, valid, dirty }"
    :name="$attrs.label"
    :rules="rules"
    :vid="vid"
  >
    <v-text-field
      v-model="innerValue"
      type="email"
      :error-messages="errors"
      :success="valid && dirty"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </validation-provider>
</template>

<script>
export default {
  name: 'BEmail',
  props: {
    vid: {
      type: String,
      default: 'name',
    },
    rules: {
      type: [Object, String],
      default: '',
    },
    // must be included in props
    value: {
      type: null,
      default: null,
    },
  },
  data: () => ({
    innerValue: '',
  }),
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit('input', newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
};
</script>
