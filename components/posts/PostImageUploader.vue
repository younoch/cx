<template>
  <v-card
    class="overflow-hidden h-100"
    :loading="processing"
    :scrollable="false"
  >
    <v-card-title class="justify-space-between primary white--text">
      <div v-if="processFiles.length && editing === false">
        Save post photos
      </div>
      <div v-else-if="editing">Adjust your photo</div>
      <div v-else>Upload photos</div>
      <v-btn icon dark class="ma-0" @click.stop="$emit('close', '')">
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text
      :loading="processing"
      style="min-height: 300px; height: 300px; overflow: auto"
      class="pa-0"
    >
      <template v-if="processFiles.length && !editing">
        <PostFeatures
          id="postFeatures"
          :post-features="processFiles"
          :post-editable="true"
          @edit="editImage($event.index, $event.type)"
          @remove="removeImage($event.index, $event.type)"
        />
      </template>
      <template v-else-if="editing && processFile">
        <img
          id="editImage"
          ref="editImage"
          crossorigin="anonymous"
          :src="processFile"
          alt=""
          style="max-width: 100%"
        />
      </template>
      <template v-else>
        <div class="w-100 h-100 d-flex align-center justify-center">
          <input
            id="uploadImage"
            ref="uploadImage"
            type="file"
            name="uploadImage"
            multiple
            accept="image/*"
            style="display: none"
            @change="uploadFiles($event)"
          />
          <label
            for="uploadImage"
            class="d-flex flex-column justify-center align-center w-100 h-100"
            style="cursor: pointer"
          >
            <v-icon large>{{ mdiCloudUpload }}</v-icon>
            <h3>Upload Photos</h3>
          </label>
        </div>
      </template>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        v-if="editing"
        outlined
        @click.prevent="editFileIndex > -1 ? closeEdit() : $emit('cancel', '')"
      >
        Cancel
      </v-btn>
      <v-btn v-else outlined @click.prevent="$emit('close', '')">
        Cancel
      </v-btn>
      <v-btn v-show="editing" class="secondary" @click.prevent="resetImage()">
        Reset
      </v-btn>
      <v-btn
        v-if="editing"
        :loading="processing"
        class="primary"
        @click.prevent="
          Object.keys(editFeature).length !== 0 ? updateImage() : saveImage()
        "
      >
        Save
      </v-btn>
      <v-btn
        v-else
        :loading="processing"
        class="primary"
        @click.prevent="savePostFiles()"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import {
  mdiDelete,
  mdiCloudUpload,
  mdiClose,
  mdiPencil,
  mdiArrowRight,
} from '@mdi/js';
import Cropper from 'cropperjs';

export default {
  name: 'PostImageUploader',
  filters: {},
  props: {
    editFeature: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    carousel: false,
    processFiles: [],
    editing: false,
    editFile: null,
    editFileIndex: -1,
    processing: false,
    mdiCloudUpload,
    mdiDelete,
    mdiClose,
    mdiPencil,
    mdiArrowRight,
  }),
  computed: {
    processFile() {
      if (Object.keys(this.editFeature).length > 0)
        // if ('id' in this.editFeature) return this.editFeature.data;
        return this.editFeature.data;
      else return this.editFile.data;
    },
  },
  mounted() {
    if (Object.keys(this.editFeature).length > 0) {
      this.editing = true;
      this.$nextTick(() => {
        // eslint-disable-next-line no-new
        new Cropper(this.$refs.editImage, {
          aspectRatio: 1.78,
          checkCrossOrigin: false,
        });
      });
    } else {
      this.$refs.uploadImage.click();
    }
  },
  methods: {
    // update image
    uploadFiles(event) {
      const uploadedFiles = Array.from(event.target.files);
      uploadedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.processFiles.push({
            data: reader.result,
            type: 'image',
            name: file.name,
            base64: true,
          });
        };
      });
    },
    editImage(index) {
      this.processing = true;
      this.editFile = this.processFiles[index];
      this.editFileIndex = index;
      this.editing = true;
      this.$nextTick(() => {
        // eslint-disable-next-line no-new
        new Cropper(this.$refs.editImage, {
          aspectRatio: 1.78,
          checkCrossOrigin: false,
        });
        this.processing = false;
      });
    },
    getFileExtenstion(filename) {
      return filename.split('.').pop();
    },

    getFileName(filepath) {
      return filepath.split('/').pop();
    },
    saveImage() {
      this.processing = true;
      const targetFile = this.processFiles[this.editFileIndex];
      const editedFile = this.$refs.editImage.cropper
        .getCroppedCanvas()
        .toDataURL(targetFile.type);
      if (editedFile) {
        targetFile.data = editedFile;
        this.processFiles.splice(this.editFileIndex, 1, targetFile);
      }
      this.$nextTick(() => {
        this.closeEdit();
      });
    },
    updateImage() {
      this.processing = true;
      const targetFile = this.editFeature;

      const editedFile = this.$refs.editImage.cropper
        .getCroppedCanvas()
        .toDataURL(`image/${this.getFileExtenstion(targetFile.name)}`);
      if (editedFile) {
        targetFile.data = editedFile;
        targetFile.base64 = true;
        this.$emit('update', {
          feature: targetFile,
        });
      }
      this.$nextTick(() => {
        this.closeEdit();
      });
    },
    // remove image
    removeImage(index) {
      this.processFiles.splice(index, 1);
    },
    closeEdit(callback = null) {
      this.$refs.editImage.cropper.destroy();
      this.editing = false;
      this.editFileIndex = -1;
      this.editFile = null;
      this.processing = false;
      // return callback ? callback() : false;
    },
    savePostFiles() {
      this.processing = true;
      this.$emit('save', { files: this.processFiles });
      this.$nextTick(() => {
        this.processing = false;
        this.processFiles = [];
        // .then((res) => {
        //   this.processing = false;
        // });
      });
    },
    resetImage() {
      this.$refs.editImage.cropper.reset();
    },
  },
};
</script>
