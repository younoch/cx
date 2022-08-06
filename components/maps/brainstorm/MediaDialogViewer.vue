<template>
  <v-dialog
    v-if="contents"
    v-model="isImageDialogOpen"
    transition="dialog-bottom-transition"
    width="800"
    max-width="800"
    @click:outside="closeModal"
  >
    <v-card>
      <v-card-text class="pa-0">
        <v-row no-gutters>
          <v-col cols="12">
            <v-carousel v-model="activeSlide" hide-delimiters>
              <v-carousel-item
                v-for="(file, carouselIndex) in contents"
                :key="carouselIndex"
                contain
              >
                <template v-if="file.type === 'image'">
                  <v-img :src="file.data" height="100%" :contain="true" />
                </template>
                <template v-if="file.type === 'document'">
                  <div class="doc_previewer">
                    <iframe
                      :src="`https://docs.google.com/viewer?embedded=true&url=${file.data}`"
                      style="width: 100%; height: 100%"
                      frameborder="0"
                      allowfullscreen
                    >
                    </iframe>
                  </div>
                </template>
                <template v-if="file.type === 'video'">
                  <client-only>
                    <video-embed style="height: 100%" :src="file.data" />
                  </client-only>
                </template>
              </v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'MediaDialogViewer',
  props: {
    isActive: {
      type: Number,
      default: 0,
    },
    contents: {
      type: Array,
      default: null,
    },
    dialogOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isImageDialogOpen: false,
      activeSlide: 0,
    };
  },
  watch: {
    dialogOpen(value) {
      this.isImageDialogOpen = value;
    },
    isActive(value) {
      this.activeSlide = value;
    },
  },
  methods: {
    closeModal() {
      this.isImageDialogOpen = false;
      this.activeSlide = 0;
      this.$emit('closeMediaDialogModal');
    },
  },
};
</script>


<style scoped>
</style>