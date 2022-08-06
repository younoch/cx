<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :width="500"
    :style="{ zIndex: options.zIndex }"
    content-class="ma-sm-4 ma-1"
    @keydown.esc="cancel"
  >
    <v-card class="rounded-lg">
      <div
        class="d-flex align-center justify-space-between primary white--text"
      >
        <v-card-title class="font-weight-regular py-2 font-18"
          >Add a note</v-card-title
        >
        <v-btn icon class="ma-0 mr-2" @click="dialog = false">
          <v-icon size="30" class="white--text">{{ mdiClose }}</v-icon>
        </v-btn>
      </div>
      <v-divider />

      <v-card-text class="px-4 pb-0">
        <v-textarea
          v-model.trim="connectionNotes"
          counter
          maxlength="300"
          auto-grow
          name="connectNote"
          label="Type here"
          class="border1--text"
          hide-details
          @change="emitGetConnectionNote()"
        />
        <small v-if="required" class="error--text">The field is required</small>
      </v-card-text>
      <v-card-actions class="py-2">
        <v-spacer />
        <v-btn
          class="text-capitalize rounded-pill px-4 text--text"
          outlined
          @click.native="sendWithoutNote"
        >
          Send Without Note
        </v-btn>

        <v-btn
          class="px-8 text-capitalize"
          rounded
          color="primary"
          dark
          @click.native="sendWithNote"
          >Send</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiClose } from '@mdi/js';
export default {
  name: 'ConnectionNotePopUp',
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    connectionNotes: '',
    required: false,
    options: {
      color: 'primary',
      width: 800,
      zIndex: 200,
    },
    mdiClose,
  }),
  methods: {
    open(options) {
      this.dialog = true;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    sendWithNote() {
      if (this.connectionNotes) {
        this.resolve(true);
        this.dialog = false;
        this.connectionNotes = '';
        this.required = false;
      } else {
        this.required = true;
      }
    },
    sendWithoutNote() {
      this.resolve();
      this.dialog = false;
      this.required = false;
    },
    emitGetConnectionNote() {
      this.$emit('emitGetConnectionNote', this.connectionNotes);
    },
  },
};
</script>
