<template>
  <div style="height: calc(100% - 60px)">
    <v-container
      id="login"
      class="h-100 py-0 d-flex justify-center align-center"
    >
      <v-row justify="center" align="center" class="h-100 my-0">
        <v-col cols="12" md="8" lg="6">
          <v-row>
            <v-col cols="12" class="d-flex justify-center">
              <v-img
                :src="isDark ? '/logo-dark.svg' : '/logo-light.svg'"
                max-width="230"
                width="auto"
                height="80"
                contain
                align-center
              >
              </v-img>
            </v-col>
          </v-row>
          <v-row justify="center" class="mt-0" align="center">
            <v-col cols="12">
              <div class="login__header">
                <h2 class="login__header-title">The Global CX Brainstorm</h2>
                <p class="login__header-desc">
                  Help improve and co-innovate world’s customer experience.
                  Collaborate with the customer experience and digital
                  professionals from around the world, and exchange contextual
                  best practices across 8 major industries:
                </p>
                <ul class="login__links">
                  <li>Telecom,</li>
                  <li>Banking,</li>
                  <li>Insurance,</li>
                  <li>Retail,</li>
                  <li>Utility,</li>
                  <li>Travel,</li>
                  <li>Government,</li>
                  <li class="text--text">and</li>
                  <li>Healthcare</li>
                </ul>
              </div>
            </v-col>
          </v-row>
          <v-row justify="center" align="center">
            <v-col cols="12" md="7" xl="6" class="mb-3">
              <v-card outlined class="rounded-lg">
                <validation-observer
                  ref="loginForm"
                  v-slot="{ handleSubmit }"
                  tag="div"
                >
                  <v-form
                    class="px-6 pt-6"
                    @submit.prevent="handleSubmit(onSubmit)"
                  >
                    <v-card-text class="pa-0">
                      <b-text
                        ref="username"
                        v-model="data.username"
                        class="login-input mb-3"
                        rules="required"
                        label="Email"
                        vid="username"
                        outlined
                        dense
                        height="30"
                      />
                      <b-password
                        v-model="data.password"
                        class="login-input mb-3"
                        rules="required|min:6"
                        vid="password"
                        label="Password"
                        outlined
                        dense
                      />
                      <p class="my-2">
                        <n-link
                          to="/auth/forgot-password"
                          class="primary--text caption-md"
                        >
                          Forgot Password?
                        </n-link>
                      </p>
                    </v-card-text>
                    <v-card-actions class="pa-0">
                      <vue-recaptcha
                        ref="recaptcha"
                        class="z-index-5"
                        size="invisible"
                        :sitekey="site_key"
                        :load-recaptcha-script="true"
                        @verify="onCaptchaVerified"
                        @expired="onCaptchaExpired"
                      />
                      <v-btn
                        :loading="loading"
                        class="rounded-pill subtitle-1-md text-capitalize py-5"
                        color="primary"
                        type="submit"
                        block
                      >
                        Log in
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </validation-observer>
                <div class="d-flex align-center px-6 pt-6 pb-2">
                  <hr class="flex-grow-1" />
                  <span class="mx-2 caption-md">Or</span>
                  <hr class="flex-grow-1" />
                </div>

                <div class="px-4 w-100 d-flex justify-space-between mb-2">
                  <v-btn
                    :loading="facebook_login"
                    text
                    fab
                    @click.stop="loginWithFacebook"
                  >
                    <v-img
                      class="
                        cursor-pointer
                        d-inline-block
                        flex-grow-0
                        elevation-3
                        rounded-pill
                      "
                      :src="`/socials/facebook.png`"
                      width="36"
                    />
                  </v-btn>
                  <v-btn
                    :loading="google_login"
                    text
                    fab
                    @click.stop="loginWithGoogle"
                  >
                    <v-img
                      class="
                        cursor-pointer
                        d-inline-block
                        flex-grow-0
                        elevation-3
                        rounded-lg
                      "
                      :src="`/socials/google.png`"
                      width="36"
                    />
                  </v-btn>
                  <v-btn
                    :loading="twitter_login"
                    text
                    fab
                    @click.stop="loginWithTwitter"
                  >
                    <v-img
                      class="
                        cursor-pointer
                        d-inline-block
                        flex-grow-0
                        elevation-3
                        rounded-pill
                      "
                      :src="`/socials/twitter.png`"
                      width="36"
                    />
                  </v-btn>
                  <v-btn
                    :loading="linkedin_login"
                    text
                    fab
                    @click.stop="loginWithLinkedin"
                  >
                    <v-img
                      class="
                        cursor-pointer
                        d-inline-block
                        flex-grow-0
                        elevation-3
                        rounded-pill
                      "
                      :src="`/socials/linkedin.png`"
                      width="36"
                    />
                  </v-btn>
                </div>
                <p class="mt-2 py-1 text-center text--text font-14">
                  Don't have an account?
                  <n-link to="/auth/register" class="primary--text"
                    >Sign up
                  </n-link>
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-footer height="auto" class="py-2 mt-0 flex-column align-center">
      <ul class="footer__links">
        <li>
          <n-link class="greyMuted--text px-1" to="/about"> About </n-link>
        </li>
        <li>
          <v-icon size="10">{{ mdiCircleMedium }}</v-icon>
        </li>
        <li>
          <n-link class="greyMuted--text px-1" to="/contact-us">
            Contact Us
          </n-link>
        </li>
        <li>
          <v-icon size="10">{{ mdiCircleMedium }}</v-icon>
        </li>

        <li>
          <n-link class="greyMuted--text px-1" to="/privacy-policy">
            Privacy Policy
          </n-link>
        </li>
        <li>
          <v-icon size="10">{{ mdiCircleMedium }}</v-icon>
        </li>
        <li>
          <n-link class="greyMuted--text px-1" to="/terms-of-use">
            Terms of Use
          </n-link>
        </li>
      </ul>
      <p class="caption greyMuted--text mb-0">
        &copy;{{ year }}—
        <strong class="primary--text">OMNIXCO LTD </strong>
        . All Rights Reserved.
      </p>
    </v-footer>
  </div>
</template>

<script>
import {
  mdiEmail,
  mdiLock,
  mdiFacebook,
  mdiLinkedin,
  mdiTwitter,
  mdiGoogle,
  mdiAlertOutline,
  mdiCircleMedium,
} from '@mdi/js';
import VueRecaptcha from 'vue-recaptcha';

export default {
  name: 'AuthLogin',
  auth: 'guest',
  components: { VueRecaptcha },
  data() {
    const defaultForm = Object.freeze({
      username: '',
      password: '',
    });
    return {
      isHydrated: false,
      data: Object.assign({}, defaultForm),
      loading: false,
      site_key: this.$config.googleRecaptchaSiteKey,
      facebook_login: false,
      linkedin_login: false,
      twitter_login: false,
      google_login: false,
      mdiEmail,
      mdiLock,
      mdiFacebook,
      mdiLinkedin,
      mdiTwitter,
      mdiGoogle,
      mdiAlertOutline,
      mdiCircleMedium,
    };
  },
  head: {
    title: 'Login',
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
    state() {
      return this.isHydrated ? this.$auth.$state : { redirect: null };
    },
    isDark() {
      return this.isHydrated ? this.$vuetify.theme.dark : false;
    },
  },
  mounted() {
    this.isHydrated = true;
    setTimeout(() => {
      this.$refs.username.$parent.$el['1'].focus();
    });
  },
  methods: {
    async onSubmit() {
      await this.$refs.recaptcha.execute();
    },
    // captch verified
    async onCaptchaVerified() {
      await this.$refs.recaptcha.reset();
      await this.login();
    },
    // catch expired
    async onCaptchaExpired() {
      await this.$refs.recaptcha.reset();
    },
    async login() {
      this.loading = true;
      try {
        await this.$auth.loginWith('local', { data: this.data });
        const authId = this.$auth.user.id;
        await this.$store.dispatch('online/joinOnline');
        await this.$store.dispatch('notification/joinToChannel', authId);
        await this.$store.dispatch('notification/getNotifications');
        this.loading = false;
        this.$store.commit('LOGIN_SUCCESS', 'Successfully logged in.');
      } catch (err) {
        this.loading = false;
        if (err.response && err.response.status === 422) {
          const { errors } = err.response.data;
          this.$refs.loginForm.setErrors(errors);
        } else if (err.response && err.response.status === 403) {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );

          this.$router.push('/auth/resent-email');
        } else {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },
    async loginWithFacebook() {
      this.facebook_login = true;
      try {
        this.$auth.$storage.setUniversal('social', 'facebook');
        await this.$auth.loginWith('facebook');
        this.facebook_login = false;
      } catch (e) {}
    },
    async loginWithLinkedin() {
      this.linkedin_login = true;
      try {
        this.$auth.$storage.setUniversal('social', 'linkedin');
        await this.$auth.loginWith('linkedin');
        this.linkedin_login = false;
      } catch (e) {}
    },
    async loginWithTwitter() {
      this.twitter_login = true;
      try {
        const { oauthToken, oauthTokenSecret } = await this.$axios.$get(
          'api/auth/twitter'
        );
        this.$auth.$storage.setUniversal('social', 'twitter');
        this.$auth.$storage.setUniversal('oauthTokenSecret', oauthTokenSecret);
        this.twitter_login = false;
        const url = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;

        window.location.replace(url);
      } catch (e) {
        this.twitter_login = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          'Something went wrong, please try again later'
        );
      }
    },
    async loginWithGoogle() {
      this.google_login = true;
      try {
        this.$auth.$storage.setUniversal('social', 'google');
        await this.$auth.loginWith('google');
        this.google_login = false;
      } catch (e) {
        this.google_login = false;
      }
    },
  },
};
</script>
<style scoped>
.sticky-bottom {
  position: sticky !important;
  bottom: 0 !important;
}
</style>
