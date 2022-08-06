<template>
  <v-container class="h-100">
    <v-row class="h-100" justify="center" align="center">
      <v-col cols="12" sm="6" md="4">
        <v-card class="elevation-2 pa-3">
          <validation-observer ref="form" v-slot="{ handleSubmit, reset }">
            <v-form
              @submit.prevent="handleSubmit(onSubmit)"
              @reset.prevent="reset"
            >
              <v-card-title class="justify-center">
                Reset Password
              </v-card-title>
              <v-divider />
              <v-card-text>
                <b-email
                  v-model="user.email"
                  rules="required|email"
                  :prepend-icon="mdiEmail"
                  label="Email"
                  vid="email"
                  required
                />
                <validation-provider
                  v-slot="{ errors, valid, dirty }"
                  name="Password"
                  rules="required|min:8"
                  vid="password"
                >
                  <v-text-field
                    v-model="user.password"
                    :append-icon="show ? mdiEyeOff : mdiEye"
                    :type="show ? 'text' : 'password'"
                    :prepend-icon="mdiLock"
                    :error-messages="errors"
                    :success="valid && dirty"
                    label="Password"
                    @click:append="show = !show"
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors, valid, dirty }"
                  name="Confirm Password"
                  rules="confirmed:password"
                >
                  <v-text-field
                    v-model="user.password_confirmation"
                    :append-icon="show ? mdiEyeOff : mdiEye"
                    :type="show ? 'text' : 'password'"
                    :prepend-icon="mdiLock"
                    :error-messages="errors"
                    :success="valid && dirty"
                    label="Confirm Password"
                    @click:append="show = !show"
                  />
                </validation-provider>
              </v-card-text>
              <v-card-actions>
                <vue-recaptcha
                  ref="recaptcha"
                  size="invisible"
                  :sitekey="site_key"
                  :load-recaptcha-script="true"
                  @verify="onCaptchaVerified"
                  @expired="onCaptchaExpired"
                />
                <v-spacer />
                <v-btn :loading="loading" color="primary" type="submit">
                  Reset Password
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
import { mdiEmail, mdiLock, mdiEye, mdiEyeOff } from '@mdi/js';

export default {
  name: 'ResetPassword',
  auth: 'guest',
  components: { VueRecaptcha },
  data() {
    return {
      user: {
        email: '',
        password: '',
        password_confirmation: '',
        token: this.$route.params.token || '',
      },
      loading: false,
      show: false,
      site_key: this.$config.googleRecaptchaSiteKey,
      mdiEmail,
      mdiLock,
      mdiEye,
      mdiEyeOff,
    };
  },
  head() {
    return {
      title: 'Reset Password',
    };
  },
  methods: {
    async onSubmit() {
      await this.$refs.recaptcha.execute();
    },
    // captch verified
    async onCaptchaVerified() {
      await this.$refs.recaptcha.reset();
      await this.resetPassword();
    },
    // catch expired
    async onCaptchaExpired() {
      await this.$refs.recaptcha.reset();
    },
    // reset password
    async resetPassword() {
      this.loading = true;
      try {
        const { message } = await this.$axios.$post(
          `api/auth/reset-password`,
          this.user
        );
        this.loading = false;
        this.$router.replace('/auth/login');
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.loading = false;
        if (err.response && err.response.status === 422) {
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
  },
};
</script>
