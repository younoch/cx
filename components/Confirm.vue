<template>
  <v-dialog
    v-model="dialog"
    :width="options.width"
    :max-width="options.maxWidth"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar dark color="#AE1800" dense flat>
        <v-toolbar-title class="white--text text-center width-full">
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text v-show="!!message" class="pa-4 text-center font-18">
        {{ message }}
      </v-card-text>
      <v-card-actions class="pb-4 pt-0 d-flex justify-center">
        <v-btn
          color="text"
          outlined
          rounded
          class="px-7 text-transform-initial font-weight-bold"
          @click.native="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          class="text-right white--text px-10 text-transform-initial font-weight-bold"
          color="primary"
          rounded
          @click.native="agree"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      color: 'primary',
      maxWidth: 290,
      width: '100%',
      zIndex: 200,
    },
  }),
  methods: {
    open(title, message, options) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>
