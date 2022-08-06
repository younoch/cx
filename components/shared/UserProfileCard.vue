<template>
  <v-card outlined class="mb-2 overflow-hidden rounded-lg">
    <div class="avatar">
      <v-img height="75" :src="cardData.cover_image" />
      <v-avatar class="profile mt-n2" size="80" color="gray">
        <v-img :srcset="cardData.image" :src="$store.state.defaultProfileImage" :alt="cardData.name"  />
        <!-- Image Edit -->
        <v-btn
          v-if="authUser && authUser.id === cardData.id && showEdit"
          class="mt-6 mr-n1"
          absolute
          max-width="18"
          max-height="18"
          fab
          dark
          depressed
          top
          right
          color="white"
          title="Edit"
          :loading="uploading_image"
          @click="$refs.avatar.click()"
        >
          <v-icon color="blue" size="15">{{ mdiPencilOutline }}</v-icon>
        </v-btn>
      </v-avatar>
      <!-- Background Cover Edit -->
      <v-btn
        v-if="authUser && authUser.id === cardData.id && showEdit"
        class="mt-9 mr-n2"
        absolute
        max-width="21"
        max-height="21"
        fab
        dark
        depressed
        top
        right
        color="white"
        title="Edit"
        :loading="uploading_cover"
        @click="$refs.cover.click()"
      >
        <v-icon color="primary" size="18">{{ mdiPencilOutline }}</v-icon>
      </v-btn>
    </div>
    <div class="avatar-spacer mt-n3" />
    <!-- User info edit -->
    <v-btn
      v-if="authUser && authUser.id === cardData.id && showEdit"
      class="mr-2 mt-n4"
      absolute
      max-width="10"
      max-height="10"
      fab
      dark
      depressed
      right
      color="transparent"
      title="Edit"
      :to="`/${authUser.username}/edit`"
    >
      <v-icon class="greyMuted--text" size="24">{{ mdiPencilOutline }}</v-icon>
    </v-btn>
    <!-- Edit  -->
    <div>
      <v-card-title class="justify-center pt-0 mb-2 h5 text-capitalize">
        {{ cardData.name }}
      </v-card-title>
      <v-card-subtitle class="text-center h5">
        {{ cardData.tagline }}
      </v-card-subtitle>
    </div>

    <v-divider></v-divider>

    <v-card-title class="px-1 justify-space-around greyMuted--text">
      <div class="text-body-2 body-1 d-flex justify-center align-end">
        <v-icon>{{ mdiAccountArrowLeftOutline }}</v-icon>
        <span class="pro_follow pl-1">Followers</span>
      </div>
      <v-divider vertical />
      <div class="text-body-2 body-1 d-flex justify-center align-end">
        <v-icon>{{ mdiAccountArrowRightOutline }}</v-icon>
        <span class="pro_follow pl-1">Following</span>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text
      class="py-3 d-flex justify-space-around text--text count_follows"
    >
      <n-link
        :to="`/${cardData.username}/followers`"
        class="primary--text font-weight-medium subtitle-1"
      >
        {{ cardData.followers }}
      </n-link>
      <div></div>
      <n-link
        :to="`/${cardData.username}/followings`"
        class="primary--text font-weight-medium subtitle-1 count_following"
      >
        {{ cardData.follows }}
      </n-link>
    </v-card-text>
    <input
      ref="cover"
      type="file"
      name="cover_image"
      class="edit_imput"
      @change="updateCoverImage"
    />
    <input
      ref="avatar"
      type="file"
      name="image"
      class="edit_imput"
      @change="updateAvatar"
    />
  </v-card>
</template>

<script>
import {
  mdiAccountArrowRightOutline,
  mdiAccountArrowLeftOutline,
  mdiPencilOutline,
  mdiClose,
} from '@mdi/js';

export default {
  middleware: 'auth',
  props: {
    cardData: {
      type: Object,
      required: true,
    },
    showEdit: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data() {
    return {
      loading: false,
      password_updating: false,
      show: false,
      readonly: true,
      reset_password_enabled: true,
      password_readonly: true,
      uploading_cover: false,
      uploading_image: false,
      dialog: false,
      userData: this.cardData,

      mdiAccountArrowRightOutline,
      mdiAccountArrowLeftOutline,
      mdiPencilOutline,
      mdiClose,
    };
  },
  computed: {
    authUser() {
      return this.$auth.user;
    },
  },
  methods: {
    // upload user avatar
    async updateAvatar(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      const formData = new FormData();
      formData.append('image', files[0]);
      this.uploading_image = true;
      try {
        const { user } = await this.$axios.$post(
          `api/update-user-image/${this.cardData.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        this.uploading_image = false;
        // update user
        // fetch user
        await this.$auth.fetchUser();
        this.$emit('updateUserProfile', user);
        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Profile avatar successfully updated'
        );
      } catch (err) {
        this.uploading_image = false;
        if (err.response.status === 422) {
          const { errors } = err.response.data;
          this.$refs.infoForm.setErrors(errors);
        } else {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },
    async updateCoverImage(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      const formData = new FormData();
      formData.append('cover_image', files[0]);
      this.uploading_cover = true;
      try {
        const { user } = await this.$axios.$post(
          `api/update-user-cover/${this.cardData.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        this.uploading_cover = false;
        // update user
        this.userData = user;
        // fetch user
        await this.$auth.fetchUser();
        this.$emit('updateUserProfile', user);
        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Profile cover successfully updated'
        );
      } catch (err) {
        this.uploading_cover = false;
        if (err.response.status === 422) {
          const { errors } = err.response.data;
          this.$refs.infoForm.setErrors(errors);
        } else {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },
  },
};
</script>
