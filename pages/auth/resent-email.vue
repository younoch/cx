<template>
  <v-container class="h-100">
    <v-row class="h-100" justify="center" align="center">
      <v-col cols="12" sm="6" md="4">
        <v-card class="elevation-2 pa-3" min-height="300">
          <validation-observer ref="form" v-slot="{ handleSubmit, reset }">
            <v-form
              @submit.prevent="handleSubmit(onSubmit)"
              @reset.prevent="reset"
            >
              <v-card-title class="justify-center">
                Resend Email Confirmation Link
              </v-card-title>
              <v-divider />
              <v-card-text>
                <b-text
                  v-model="email"
                  rules="required|email"
                  :prepend-icon="mdiEmail"
                  label="Email"
                  type="email"
                  vid="email"
                  required
                />
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
                  Resend
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
import { mdiEmail } from '@mdi/js';

export default {
  name: 'ResentEmail',
  auth: 'guest',
  components: { VueRecaptcha },
  data() {
    return {
      email: '',
      loading: false,
      site_key: this.$config.googleRecaptchaSiteKey,
      mdiEmail,
    };
  },
  head() {
    return {
      title: 'Resend Verification Link',
    };
  },
  methods: {
    async onSubmit() {
      await this.$refs.recaptcha.execute();
    },
    // captch verified
    async onCaptchaVerified() {
      await this.$refs.recaptcha.reset();
      await this.sendEmail();
    },
    // catch expired
    async onCaptchaExpired() {
      await this.$refs.recaptcha.reset();
    },
    // send verification token into email
    async sendEmail() {
      this.loading = true;
      try {
        const { message } = await this.$axios.$get(
          `api/auth/email/resend/${this.email}`
        );
        this.loading = false;
        this.email = '';
        this.$router.replace('/auth/login');
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
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
  },
};
</script>
