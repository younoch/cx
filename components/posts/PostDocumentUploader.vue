<template>
  <v-card
    class="overflow-hidden h-100"
    :loading="processing"
    :scrollable="false"
  >
    <v-card-title class="justify-space-between primary white--text">
      <div v-if="processFiles.length && editing === false">
        Save post Documents
      </div>
      <div v-else-if="editing">Adjust your Document</div>
      <div v-else>Upload Documents</div>
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
          @remove="removeFile($event.index, $event.type)"
        />
      </template>
      <template v-else>
        <div class="d-flex align-center justify-center w-100 h-100">
          <input
            id="uploadDocument"
            ref="uploadDocument"
            type="file"
            name="uploadDocument"
            multiple
            accept=".pdf, .xls, .xlsx, .doc, .docx, .ppt, .pptx"
            style="display: none"
            @change="uploadFiles($event)"
          />
          <label
            for="uploadDocument"
            class="d-flex flex-column justify-center align-center w-100 h-100"
            style="cursor: pointer"
          >
            <v-icon large>{{ mdiCloudUpload }}</v-icon>
            <h3>Upload Documents</h3>
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
      <v-btn v-show="editing" class="secondary" @click.prevent="resetDocument">
        Reset
      </v-btn>
      <v-btn
        v-if="editing"
        :loading="processing"
        class="primary"
        @click.prevent="editFeature === '' ? saveDocument : updateDocument"
      >
        Save
      </v-btn>
      <v-btn
        v-else
        :loading="processing"
        class="primary"
        @click.prevent="savePostFiles"
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

export default {
  name: 'PostDocumentUploader',
  filters: {
    isFile(index) {
      return !!(
        this.uploadedFiles.length &&
        this.uploadedFiles[index].constructor.name === 'File'
      );
    },
  },
  data: () => ({
    carousel: false,
    postFiles: [],
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
      if (this.editFeature) {
        return this.editFeature;
      }
      return this.editFile;
    },
  },
  mounted() {
    this.$refs.uploadDocument.click();
  },
  methods: {
    // update image
    uploadFiles(event) {
      const uploadedFiles = Array.from(event.target.files);
      uploadedFiles.forEach(async (file, index) => {
        if (file.size > 5120 * 1024) {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            'File size should not exceed 5MB.'
          );
          return false;
        }
        const { location, name } = await this.uploadFile(file);
        this.processFiles.push({
          data: location,
          type: 'document',
          name,
        });
      });
    },

    async uploadFile(file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const uploadeFile = await this.$axios.$post(
          `api/common/asset`,
          formData
        );
        return uploadeFile;
      } catch (err) {
        this.processing = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
    getFileExtenstion(filename) {
      return filename.split('.').pop();
    },

    getFileName(filepath) {
      return filepath.split('/').pop();
    },
    // remove document
    async removeFile(index) {
      const source = this.processFiles[index].data;
      await this.$axios.$post(`api/common/asset-file`, {
        source,
      });
      this.processFiles.splice(index, 1);
    },
    savePostFiles() {
      this.processing = true;
      this.$emit('save', { files: this.processFiles });
      this.$nextTick(() => {
        this.processing = false;
        this.processFiles = [];
      });
    },
  },
};
</script>
