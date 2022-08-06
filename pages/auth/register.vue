<template>
  <div class="register__container">
    <!-- cookies message -->
    <div v-if="cookies" class="cookies__dialog">
      <v-container>
        <div class="d-flex justify-start align-start">
          <span class="mr-3">
            <v-icon color="whiteBackground" size="20">{{
              mdiAlertCircleOutline
            }}</v-icon>
          </span>
          <div class="cookeis__dialog-content">
            <p
              class="font-14 whiteBackground--text mb-0 pt-1"
              :class="$vuetify.theme.isDark ? '' : ''"
            >
              CXBrainstorm.com will import your Google contacts so you could
              invite them to join you at CXBrainstorm and collaborate with you
              over innovations and ideas.
            </p>
            <div class="text-left">
              <v-btn
                color="whiteBackground"
                class="text-capitalize mt-4"
                small
                depressed
                @click="cookies = false"
                >manage preferences</v-btn
              >
              <v-btn
                color="whiteBackground"
                class="text-capitalize mt-4"
                small
                depressed
                @click="acceptCookies"
                >accept cookies</v-btn
              >
            </div>
          </div>
        </div>
      </v-container>
    </div>
    <v-container id="login">
      <v-row justify="center" align="center" class="h-100 pb-16">
        <v-col cols="12" md="8" lg="6">
          <v-card rounded="lg" outlined>
            <v-card-title
              class="py-3 line-height-24"
              style="word-break: break-word"
            >
              Create your CXBrainstorm account
            </v-card-title>
            <v-divider />
            <validation-observer
              ref="registerForm"
              v-slot="{ handleSubmit }"
              tag="div"
            >
              <v-form @submit.prevent="handleSubmit(onSubmit)">
                <v-card-text class="pb-0">
                  <v-row class="py-0 pt-3">
                    <v-col cols="12" md="6" class="py-0 pb-1">
                      <b-text
                        ref="firstName"
                        v-model="data.first_name"
                        class="login-input"
                        rules="required"
                        label="First Name"
                        dense
                        outlined
                        vid="first_name"
                        height="30"
                      />
                    </v-col>
                    <v-col cols="12" md="6" class="py-0 pb-1">
                      <b-text
                        v-model="data.last_name"
                        class="login-input"
                        rules="required"
                        label="Last Name"
                        dense
                        outlined
                        vid="last_name"
                        height="30"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-1 pt-0">
                      <b-email
                        v-model="data.email"
                        class="login-input mb-3"
                        rules="required|email"
                        label="Email"
                        vid="email"
                        outlined
                        dense
                        height="30"
                      />
                    </v-col>
                    <v-col cols="12" class="py-0 mb-1">
                      <b-password
                        v-model="data.password"
                        class="login-input mb-3"
                        rules="required|min:8"
                        label="Password"
                        vid="password"
                        outlined
                        dense
                        height="30"
                      />
                    </v-col>
                  </v-row>

                  <p class="text-center font-14 mb-2">
                    By siging up, you confirmed that you've read and accepted
                    our
                    <nuxt-link to="/terms-of-use" class="primary--text"
                      >Term of Service</nuxt-link
                    >
                    and
                    <nuxt-link to="/privacy-policy" class="primary--text"
                      >Privacy Policy</nuxt-link
                    >
                  </p>
                </v-card-text>
                <v-card-actions>
                  <vue-recaptcha
                    ref="recaptcha"
                    size="invisible"
                    class="z-index-5"
                    :sitekey="site_key"
                    :load-recaptcha-script="true"
                    @verify="onCaptchaVerified"
                    @expired="onCaptchaExpired"
                  />
                  <v-btn :loading="loading" color="primary" type="submit" block>
                    Create
                  </v-btn>
                </v-card-actions>
              </v-form>
            </validation-observer>
            <v-card-text class="text-center pt-3">
              <p class="ma-0">Or</p>
              <p class="mb-5">Register with your social account</p>
              <v-row>
                <v-col cols="12" md="6">
                  <v-btn
                    :loading="facebook_login"
                    class="facebook white--text"
                    min-width="245"
                    @click="loginWithFacebook"
                  >
                    <v-icon left>
                      {{ mdiFacebook }}
                    </v-icon>
                    Sign Up with Facebook
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn
                    :loading="linkedin_login"
                    class="linkedin white--text"
                    min-width="245"
                    @click="loginWithLinkedin"
                  >
                    <v-icon left>
                      {{ mdiLinkedin }}
                    </v-icon>
                    Sign Up with Linkedin
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-btn
                    :loading="google_login"
                    class="google white--text"
                    min-width="245"
                    @click="loginWithGoogle"
                  >
                    <v-icon left>
                      {{ mdiGoogle }}
                    </v-icon>
                    Sign Up with Google
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn
                    :loading="twitter_login"
                    class="twitter white--text"
                    min-width="245"
                    @click="loginWithTwitter"
                  >
                    <v-icon left>
                      {{ mdiTwitter }}
                    </v-icon>
                    Sign Up with Twitter
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" lg="6">
          <div class="auth-text">
            <v-img
              :src="require(`~/assets/images/icons/travelicon.png`)"
              max-width="182"
              contain
            />
            <h2 class="text-md-h2 mb-2 text-xs-h4">Be a CX Hero!</h2>
            <ul>
              <li>
                Join the world’s first contextualized customer experience
                professional community
              </li>
              <li>
                Help improve and innovate customer experience practices globally
              </li>
              <li>
                Grow your network and prospects, find jobs – connect and network
                with the best in your industry
              </li>
            </ul>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-footer fixed height="auto" class="py-2 mt-6 flex-column align-center">
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
    </v-container>
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
  mdiCircleMedium,
  mdiAlertCircleOutline,
} from '@mdi/js';

import VueRecaptcha from 'vue-recaptcha';

export default {
  name: 'AuthRegister',
  auth: 'guest',
  components: { VueRecaptcha },
  data() {
    const defaultForm = Object.freeze({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    });
    return {
      data: Object.assign({}, defaultForm),
      loading: false,
      site_key: this.$config.googleRecaptchaSiteKey,
      facebook_login: false,
      linkedin_login: false,
      twitter_login: false,
      google_login: false,
      cookies: false,
      mdiEmail,
      mdiLock,
      mdiFacebook,
      mdiLinkedin,
      mdiTwitter,
      mdiGoogle,
      mdiCircleMedium,
      mdiAlertCircleOutline,
    };
  },
  head: {
    title: 'Register',
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
  mounted() {
    const email = this.$route.query.email;
    if (email) {
      this.data.email = email;
    }
    setTimeout(() => {
      this.$refs.firstName.$parent.$el['1'].focus();
    });
    this.readCookie();
  },
  methods: {
    acceptCookies() {
      this.$cookies.set('cx-accept-cookies', 'yes', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
      this.cookies = false;
    },
    readCookie() {
      const cookieRes = this.$cookies.get('cx-accept-cookies');
      if (cookieRes === 'yes') {
        this.cookies = false;
      } else {
        this.cookies = true;
      }
    },
    async onSubmit() {
      await this.$refs.recaptcha.execute();
    },
    // captch verified
    async onCaptchaVerified() {
      await this.$refs.recaptcha.reset();
      await this.register();
    },
    // catch expired
    async onCaptchaExpired() {
      await this.$refs.recaptcha.reset();
    },
    async register() {
      this.loading = true;
      try {
        this.data.name = `${this.data.first_name} ${this.data.last_name}`;
        const token = this.$route.query.token;
        if (token) {
          this.data.token = token;
        }
        const { message } = await this.$axios.$post(
          'api/auth/register',
          this.data
        );

        this.loading = false;
        this.data = Object.assign({}, this.defaultForm);
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
        this.$router.push('/auth/login');
        this.$nextTick(() => {
          this.$refs.registerForm.reset();
        });
      } catch (err) {
        this.loading = false;
        if (err.response.status === 422) {
          const { errors } = err.response.data;
          this.$refs.registerForm.setErrors(errors);
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
