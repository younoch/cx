<template>
  <v-dialog v-model="dialog" persistent width="350">
    <template #activator="{ on }">
      <v-btn outlined color="info" v-on="on"> Schedule </v-btn>
    </template>

    <v-card>
      <v-card-text class="pa-0">
        <v-tabs v-model="tab" fixed-tabs>
          <v-tab>
            <v-icon>{{ mdiCalendar }}</v-icon>
          </v-tab>
          <v-tab :disabled="dateSelected">
            <v-icon>{{ mdiClockOutline }}</v-icon>
          </v-tab>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-date-picker
                v-model="date"
                full-width
                v-bind="datePickerProps"
                @input="tab = 1"
              />
            </v-tab-item>
            <v-tab-item>
              <v-time-picker
                v-model="time"
                full-width
                v-bind="timePickerProps"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn outlined @click.native="clearDateTime"> Cancel </v-btn>
        <v-btn outlined color="primary" @click="getDateTime"> OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { format } from 'date-fns';
import { mdiCalendar, mdiClockOutline } from '@mdi/js';

export default {
  name: 'BDateTime',
  model: {
    prop: 'datetime',
    event: 'input',
  },
  props: {
    vid: {
      type: String,
      default: 'name',
    },
    rules: {
      type: [Object, String],
      default: '',
    },
    datetime: {
      type: [Date, String],
      default: null,
    },
    datePickerProps: {
      type: Object,
      default: null,
    },
    timePickerProps: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    date: null,
    time: null,
    dialog: false,
    tab: 0,
    mdiCalendar,
    mdiClockOutline,
  }),
  computed: {
    selectedDatetime() {
      if (this.date && this.time) {
        return this.date + ' ' + this.time;
      } else {
        return null;
      }
    },
    dateSelected() {
      return !this.date;
    },
  },
  watch: {
    datetime() {
      this.init();
    },
  },
  created() {
    if (this.datetime) {
      this.init();
    }
  },
  methods: {
    init() {
      if (!this.datetime) {
        return;
      }

      this.date = format(new Date(this.datetime), 'yyyy-MM-dd');
      this.time = format(new Date(this.datetime), 'HH:mm:ss');
    },
    clearDateTime() {
      this.resetPicker();
      this.date = null;
      this.time = null;
      this.$emit('input', null);
    },
    getDateTime() {
      this.resetPicker();
      this.$emit('input', this.selectedDatetime);
    },
    resetPicker() {
      this.dialog = false;
      this.tab = 0;
    },
  },
};
</script>
