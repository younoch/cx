<template>
  <v-card>
    <v-card-text>
      <v-text-field
        v-model="title"
        label="Add Step Title"
        outlined
        autofocus
        hide-details
        @keydown.enter="edit ? updateStep() : addStep()"
        @keydown.esc="closeStepBox"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn outlined @click.stop="closeStepBox"> Cancel </v-btn>
      <v-btn
        :loading="creating"
        class="primary"
        @click.prevent="edit ? updateStep() : addStep()"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'StepBox',
  props: {
    mapId: {
      type: Number,
      required: true,
      default: 0,
    },
    stepId: {
      type: Number,
      required: false,
      default: 0,
    },
    stepTitle: {
      type: String,
      required: false,
      default: '',
    },
  },

  data() {
    return {
      creating: false,
      title: this.stepTitle,
    };
  },

  computed: {
    edit() {
      return !!this.stepId;
    },
  },

  watch: {
    stepTitle(title) {
      this.title = title;
    },
  },

  methods: {
    // add new Step
    async addStep() {
      this.creating = true;
      try {
        const { message, step } = await this.$axios.$post(
          `api/openjourney/map/steps/add/${this.mapId}`,
          {
            title: this.title,
            ordering: 0,
          }
        );
        this.creating = false;
        this.$parent.map.steps.push(step);
        this.closeStepBox();
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.creating = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
    // update step title
    async updateStep() {
      this.creating = true;
      try {
        const { message } = await this.$axios.$post(
          `api/openjourney/map/steps/rename/${this.stepId}`,
          {
            title: this.title,
          }
        );
        this.creating = false;
        this.$parent.map.steps.find((step) => step.id === this.stepId).title =
          this.title;

        this.closeStepBox();
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.creating = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },

    // close step title
    closeStepBox() {
      this.$parent.editStep = 0;
      this.$parent.stepBoxOpen = false;
    },
  },
};
</script>
