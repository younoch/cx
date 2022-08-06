<template>
  <v-card>
    <v-card-text>
      <v-text-field
        v-model="title"
        label="Add Section Title"
        outlined
        autofocus
        hide-details
        @keydown.enter="addSection()"
        @keydown.esc="closeSectionBox"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn outlined @click.stop="closeSectionBox"> Cancel </v-btn>
      <v-btn :loading="creating" class="primary" @click.prevent="addSection()">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'SectionBox',
  props: {
    stepId: {
      type: Number,
      required: true,
      default: 0,
    },
    mapId: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  data() {
    return {
      creating: false,
      title: '',
    };
  },

  methods: {
    // add new Section
    async addSection() {
      this.creating = true;
      try {
        const { message, answer } = await this.$axios.$post(
          'api/openjourney/map/steps/answers/add',
          {
            ordering: 0,
            map_id: this.mapId,
            step_id: this.stepId,
            title: this.title,
          }
        );
        this.creating = false;
        this.title = '';
        this.closeSectionBox();
        this.$parent.map.steps
          .find((step) => step.id === answer.step_id)
          .answers.push(answer);
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.creating = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
    closeSectionBox() {
      this.title = '';
      this.$parent.sectionStepId = 0;
      this.$parent.sectionBoxOpen = false;
    },
  },
};
</script>
