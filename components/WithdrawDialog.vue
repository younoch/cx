<template>
  <v-dialog
    v-model="dialog"
    persistent
    transition="dialog-top-transition"
    max-width="400"
  >
    <v-card class="rounded-lg overflow-hidden" flat outlined>
      <v-card-title class="d-flex justify-space-between align-center py-3 pl-5 pr-3">
        <h4 class="font-weight-regular">Withdraw invitation</h4>
        <v-btn icon @click="cancleDialog">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="py-6 px-5">
        <p class="font-18 mb-0">
          If you withdraw now, you won't be able to respond to this person for
          up to 3 weeks.
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end py-3 px-5">
        <v-btn
          class="text-capitalize px-4"
          color="primary"
          outlined
          rounded
          @click="cancleDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          class="text-capitalize px-4 ml-4"
          rounded
          color="primary"
          @click="setWithdraw"
        >
          Withdraw
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiClose } from '@mdi/js';
export default {
  name: 'WithdrawDialog',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    dataObject: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      mdiClose,
    };
  },

  watch: {
    show(data) {
      this.dialog = data;
    },
  },

  methods: {
    async setWithdraw() {
      try {
        await this.$axios.$post(
          `api/connection/withdraw/${this.dataObject.id}`,
          {
            userId: this.dataObject.id,
          }
        );
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', 'Successfully withdrawn');

        this.$emit('withdrawSuccess', this.dataObject.id);
      } catch (e) {
        console.log(e);
      }
    },
    cancleDialog() {
      this.dialog = false;
      this.$emit('closeWithdraw');
    },
  },
};
</script>
