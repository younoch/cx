<template>
  <v-card class="image-upload overflow-hidden">
    <v-card-title class="justify-space-between primary white--text">
      <div>
        <v-icon left>
          {{ mdiAccountMultiple }}
        </v-icon>
        Adjust your privacy settings
      </div>
      <v-btn icon dark class="ma-0" @click.stop="$emit('close', '')">
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text
      :loading="processing"
      style="
        height: 280px !important;
        min-height: 280px !important;
        overflow: auto;
        position: relative;
      "
      class="pa-0"
    >
      <v-row class="px-6 py-3" align="center">
        <h6>Anyone</h6>
        <p>Your connections and anyoune who follow you.</p>
      </v-row>
      <v-row class="px-6 py-3" align="center">
        <h6>Connections only</h6>
        <p>Your connections on CXBrainstorm</p>
      </v-row>
      <v-row class="px-6 py-3" align="center">
        <h6>Business Gruops</h6>
        <p>Pick a group from the list</p>
        <v-menu bottom right transition="scale-transition" origin="top left">
          <template #activator="{ on }">
            <v-chip pill v-on="on">
              <v-avatar left>
                <v-img src="https://cdn.vuetifyjs.com/images/john.png" />
              </v-avatar>
              John Leider
            </v-chip>
          </template>
          <v-card width="300">
            <v-list light>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img src="https://cdn.vuetifyjs.com/images/john.png" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>John Leider</v-list-item-title>
                  <v-list-item-subtitle>
                    john@vuetifyjs.com
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="menu = false">
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-list>
              <v-list-item @click="() => {}">
                <v-list-item-action>
                  <v-icon>mdi-briefcase</v-icon>
                </v-list-item-action>
                <v-list-item-subtitle>john@gmail.com</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-row>
      <v-row class="px-6 py-3" align="center">
        <h6>Customer journey pages</h6>
        <p>Pick a journey page from the list</p>
        <v-menu
          v-model="businessGroups"
          bottom
          right
          transition="scale-transition"
          origin="top left"
        >
          <template #activator="{ on }">
            <v-chip pill v-on="on">
              <v-avatar left>
                <v-img src="https://cdn.vuetifyjs.com/images/john.png" />
              </v-avatar>
              John Leider
            </v-chip>
          </template>
          <v-card width="300">
            <v-list light>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img src="https://cdn.vuetifyjs.com/images/john.png" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>John Leider</v-list-item-title>
                  <v-list-item-subtitle>
                    john@vuetifyjs.com
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="menu = false">
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-list>
              <v-list-item @click="() => {}">
                <v-list-item-action>
                  <v-icon>mdi-briefcase</v-icon>
                </v-list-item-action>
                <v-list-item-subtitle>john@gmail.com</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-row>
      <v-row class="px-6 py-3" align="center">
        <h6>Hot Topics</h6>
        <p>Pick a topics from the list</p>
        <v-menu
          v-model="businessGroups"
          bottom
          right
          transition="scale-transition"
          origin="top left"
        >
          <template #activator="{ on }">
            <v-chip pill v-on="on">
              <v-avatar left>
                <v-img src="https://cdn.vuetifyjs.com/images/john.png" />
              </v-avatar>
              John Leider
            </v-chip>
          </template>
          <v-card width="300">
            <v-list light>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img src="https://cdn.vuetifyjs.com/images/john.png" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>John Leider</v-list-item-title>
                  <v-list-item-subtitle>
                    john@vuetifyjs.com
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="menu = false">
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-list>
              <v-list-item @click="() => {}">
                <v-list-item-action>
                  <v-icon>mdi-briefcase</v-icon>
                </v-list-item-action>
                <v-list-item-subtitle>john@gmail.com</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn outlined @click.stop="$emit('close', '')"> Cancel </v-btn>
      <v-btn class="secondary" @click.stop="resetImage"> Reset </v-btn>
      <v-btn
        :loading="processing"
        class="primary"
        @click.prevent="savePostImage()"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mdiDelete, mdiCloudUpload, mdiClose } from '@mdi/js';
// eslint-disable-next-line no-unused-vars
import Cropper from 'cropperjs';

export default {
  name: 'PostImageUploader',
  props: {
    postPrivacy: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    privacyGroup: '',
    privacySubGroup: '',
    processing: false,
    mdiCloudUpload,
    mdiDelete,
    mdiClose,
  }),
  computed: {
    processImageUrl() {
      if (this.postImage) {
        return this.postImage;
      }
      return this.processImage;
    },
  },
  mounted() {
    this.$refs.uploadImage.click();
  },
  methods: {
    // update image
    uploadImage(event) {
      this.processing = true;
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadFile = file;
        this.processImage = URL.createObjectURL(file);
        this.$nextTick(() => {
          // eslint-disable-next-line no-new
          new Cropper(this.$refs.editImage, {
            aspectRatio: 1.78,
            checkCrossOrigin: false,
          });
          this.processing = false;
        });
      };
    },
    savePostImage() {
      this.processing = true;
      this.$refs.editImage.cropper.getCroppedCanvas().toBlob((blob) => {
        const editImage = new File([blob], this.uploadFile.name, {
          type: this.uploadFile.type,
          lastModified: new Date(),
        });
        this.postFile = editImage;
        this.$nextTick(() => {
          this.$emit('update', this.postFile);
          this.processing = false;
        });
      }, this.uploadFile.type);
    },
    resetImage() {
      this.$refs.editImage.cropper.reset();
    },
    // remove image
    removeImage() {
      this.uploadFile = '';
      this.processImage = '';
      this.postFile = '';
      this.$emit('remove', '');
    },
  },
};
</script>
