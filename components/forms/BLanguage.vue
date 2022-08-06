<template>
  <v-radio-group
    v-model="innerValue"
    v-bind="$attrs"
    row
    hide-details
    class="ma-0"
    v-on="$listeners"
  >
    <v-radio label="English" value="en" />
    <v-radio label="Spanish" value="es" />
    <!-- <v-radio label="বাংলা" value="bn"></v-radio> -->
  </v-radio-group>
</template>

<script>
export default {
  name: 'BLanguage',
  props: {
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
