<template>
  <div id="profile">
    <v-container class="my-6">
      <v-row>
        <v-col cols="12" md="3">
          <v-card outlined class="rounded-lg">
            <v-list dense class="py-0">
              <v-subheader
                class="px-4 body-1 heading--text"
                style="height: 36px"
                >Edit Information</v-subheader
              >
              <v-divider />
              <v-list-item
                class="greyMuted--text"
                :class="{ greyLight: editSwithch }"
                @click="editSwithch = true"
              >
                <v-list-item-icon class="mr-4">
                  <v-icon v-text="mdiInformationOutline"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-14"
                    >General Info</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                class="greyMuted--text"
                :class="{ greyLight: !editSwithch }"
                @click="editSwithch = false"
              >
                <v-list-item-icon class="mr-4">
                  <v-icon v-text="mdiLockOutline"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-14"
                    >Reset Password</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="9">
          <v-card v-if="editSwithch" flat class="overflow-hidden rounded-lg">
            <validation-observer
              ref="infoForm"
              v-slot="{ handleSubmit, reset, invalid }"
            >
              <v-form
                @submit.prevent="handleSubmit(updateInformation)"
                @reset.prevent="reset"
              >
                <v-card-title class="py-3 mb-3 primary" color="primary">
                  <span class="text-h6 white--text font-weight-regular"
                    >General Information</span
                  >
                  <v-btn
                    right
                    icon
                    absolute
                    fab
                    depressed
                    dark
                    title="close"
                    text
                    @click="redirectToProfile()"
                    ><v-icon color="white" size="35">{{
                      mdiClose
                    }}</v-icon></v-btn
                  >
                </v-card-title>
                <v-card-text class="px-0 pb-0">
                  <v-container class="pa-0">
                    <div class="px-4">
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                          md="6"
                          class="pr-xl-5 pr-lg-5 pr-md-5 pr-3"
                        >
                          <span>First Name</span>
                          <b-text
                            v-model="user.first_name"
                            dense
                            rules="required|max:50"
                            vid="first_name"
                            outlined
                            required
                            label="First Name"
                            single-line
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="6"
                          class="pl-xl-5 pl-lg-5 pl-md-5 pl-3"
                        >
                          <span>Last Name</span>
                          <b-text
                            v-model="user.last_name"
                            dense
                            vid="last_name"
                            rules="required|max:50"
                            outlined
                            required
                            label="Last Name"
                            single-line
                          />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col
                          cols="12"
                          md="6"
                          class="pr-xl-5 pr-lg-5 pr-md-5 pr-3"
                        >
                          <span>Username</span>
                          <b-text
                            v-model="user.username"
                            dense
                            required
                            vid="username"
                            rules="required|max:30"
                            outlined
                            label="username"
                            single-line
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                          class="pl-xl-5 pl-lg-5 pl-md-5 pl-3"
                        >
                          Email
                          <b-email
                            v-model="user.email"
                            dense
                            rules="required|email"
                            required
                            outlined
                            label="Email Address"
                            vid="email"
                            single-line
                          />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col
                          cols="12"
                          md="6"
                          class="pr-xl-5 pr-lg-5 pr-md-5 pr-3"
                        >
                          <span>Tagline</span>
                          <b-text-area
                            v-model="user.tagline"
                            rows="5"
                            dense
                            vid="tagline"
                            outlined
                            label="Tagline"
                            rules="required|max:50"
                            single-line
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                          class="pl-xl-5 pl-lg-5 pl-md-5 pl-3"
                        >
                          <span>Bio</span>
                          <b-text-area
                            v-model="user.bio"
                            rows="5 "
                            dense
                            vid="bio"
                            outlined
                            label="Bio"
                            rules="max:220"
                            single-line
                          />
                        </v-col>
                      </v-row>
                      <v-divider />
                    </div>
                  </v-container>
                </v-card-text>
                <v-card-actions class="ma-2">
                  <v-spacer></v-spacer>
                  <v-btn
                    height="32"
                    class="
                      rounded-pill
                      text-capitalize text--text
                      profile-cancel
                    "
                    width="105"
                    elevation="2"
                    outlined
                    @click="redirectToProfile()"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    height="32"
                    :loading="loading"
                    class="primary white--text rounded-pill text-capitalize"
                    width="105"
                    type="submit"
                    :disabled="invalid"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-form>
            </validation-observer>
          </v-card>
          <v-card v-else flat class="overflow-hidden rounded-lg">
            <validation-observer
              ref="form"
              v-slot="{ handleSubmit, reset, invalid }"
            >
              <v-form
                @submit.prevent="handleSubmit(updateUserPassword)"
                @reset.prevent="reset"
              >
                <v-card-title class="py-3 mb-3 primary" color="primary">
                  <span class="text-h6 white--text font-weight-regular"
                    >Reset Password</span
                  >
                  <v-btn
                    right
                    icon
                    absolute
                    fab
                    depressed
                    dark
                    title="close"
                    text
                    @click="redirectToProfile()"
                    ><v-icon color="white" size="40">{{
                      mdiClose
                    }}</v-icon></v-btn
                  >
                </v-card-title>
                <v-card-text class="px-0 pb-0">
                  <v-container class="px-0">
                    <div class="px-4">
                      <v-row>
                        <v-col cols="12" sm="6" md="6" class="pr-5">
                          <span>Password</span>
                          <b-password
                            ref="password"
                            v-model="user.password"
                            dense
                            rules="required|min:8"
                            vid="password"
                            outlined
                            required
                            label="Password"
                            single-line
                          />
                        </v-col>
                        <v-col cols="12" sm="6" md="6" class="pl-5">
                          <span>Confirm Password</span>
                          <b-password
                            v-model="user.password_confirmation"
                            dense
                            rules="required|confirmed:password"
                            vid="password_confirmation"
                            outlined
                            required
                            label="Confirmed Password"
                            single-line
                          />
                        </v-col>
                      </v-row>

                      <v-divider />
                    </div>
                  </v-container>
                </v-card-text>
                <v-card-actions class="ma-2">
                  <v-spacer></v-spacer>
                  <v-btn
                    height="32"
                    class="
                      rounded-pill
                      text-capitalize text--text
                      profile-cancel
                    "
                    width="105"
                    elevation="2"
                    outlined
                    @click="redirectToProfile()"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    height="32"
                    :loading="loading"
                    class="primary white--text rounded-pill text-capitalize"
                    width="105"
                    type="submit"
                    :disabled="invalid"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-form>
            </validation-observer>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {
  mdiAccount,
  mdiEmail,
  mdiPencil,
  mdiCloseCircle,
  mdiLock,
  mdiTextAccount,
  mdiTag,
  mdiAccountBox,
  mdiImageEdit,
  mdiImageEditOutline,
  mdiClose,
  mdiInformationOutline,
  mdiLockOutline,
} from '@mdi/js';

export default {
  name: 'EditSingleUser',
  middleware: 'auth',
  async asyncData({ app, params, router }) {
    try {
      const { data } = await app.$axios.$get(`api/get-user/${params.username}`);
      return {
        user: data,
      };
    } catch (e) {
      router.push('/');
    }
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
      editSwithch: true,
      mdiAccount,
      mdiEmail,
      mdiPencil,
      mdiCloseCircle,
      mdiLock,
      mdiTextAccount,
      mdiTag,
      mdiAccountBox,
      mdiImageEdit,
      mdiImageEditOutline,
      mdiClose,
      mdiInformationOutline,
      mdiLockOutline,
    };
  },
  computed: {
    authUser() {
      return this.$auth.user;
    },
  },
  mounted() {},
  methods: {
    // get user object
    async getUser() {
      try {
        const { data } = await this.$axios.$get(`api/user/${this.authUser.id}`);
        this.user = data;
        this.user.password = '';
        this.user.password_confirmation = '';
      } catch (e) {}
    },
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
          `api/update-user-image/${this.user.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        this.uploading_image = false;
        // update user
        this.user = user;
        // fetch user
        await this.$auth.fetchUser();
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
    // upload user cover photo
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
          `api/update-user-cover/${this.user.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        this.uploading_cover = false;
        // update user
        this.user = user;
        // fetch user
        await this.$auth.fetchUser();
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
    // update info into server
    async updateInformation() {
      this.loading = true;
      try {
        const { user } = await this.$axios.$patch(
          `api/update-user-info/${this.user.id}`,
          this.user
        );

        // update user
        this.user = user;
        await this.$auth.fetchUser();

        this.loading = false;
        this.readonly = true;
        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Profile Successfully updated'
        );
        this.$router.push(`/${this.user.username}/edit`);
      } catch (err) {
        this.loading = false;
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
    // update password into server
    async updateUserPassword() {
      this.password_updating = true;
      try {
        const { user } = await this.$axios.$patch(
          `api/update-user-password/${this.user.id}`,
          this.user
        );
        this.password_updating = false;
        this.password_readonly = true;
        // update user
        this.user = user;

        this.$router.push('/');

        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Password successfully updated'
        );
        this.$refs.form.reset();
      } catch (err) {
        this.loading = false;
        if (err.response.status === 422) {
          const { errors } = err.response.data;
          this.$refs.form.setErrors(errors);
        } else {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },

    // redirect to profile
    redirectToProfile() {
      this.$router.push(`/${this.authUser.username}`);
    },
  },
};
</script>
