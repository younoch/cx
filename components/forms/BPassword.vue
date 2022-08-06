<template>
  <validation-provider
    v-slot="{ errors, valid, dirty }"
    :name="$attrs.label"
    :rules="rules"
    :vid="vid"
  >
    <v-text-field
      v-model="innerValue"
      :append-icon="show ? mdiEyeOff : mdiEye"
      :type="show ? 'text' : 'password'"
      :error-messages="errors"
      :success="valid && dirty"
      v-bind="$attrs"
      v-on="$listeners"
      @click:append="show = !show"
    />
  </validation-provider>
</template>

<script>
import { mdiEye, mdiEyeOff } from '@mdi/js';

export default {
  name: 'BPassword',
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
    show: false,
    mdiEye,
    mdiEyeOff,
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
