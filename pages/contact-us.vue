<template>
  <v-container id="page" class="py-sm-16 py-10">
    <v-row>
      <v-col>
        <h1 class="text-h2 text-center mb-2">Contact Us</h1>
        <p class="text-center">
          To learn more about CXBrainstorm.com
          <br />(Advisory, Sponsorship and Advertisement Opportunities)
        </p>
      </v-col>
    </v-row>
    <v-row justify="center" class="pb-16">
      <v-col cols="12" md="8">
        <v-card outlined>
          <validation-observer ref="contactForm" v-slot="{ handleSubmit }">
            <v-form @submit.prevent="handleSubmit(sendMessage)">
              <v-card-text>
                <b-text
                  v-if="!isLoggedIn"
                  v-model="contact.name"
                  rules="required"
                  label="Your Name"
                  vid="name"
                  outlined
                />
                <b-email
                  v-if="!isLoggedIn"
                  v-model="contact.email"
                  rules="required|email"
                  label="Your Email"
                  vid="email"
                  outlined
                />

                <b-text-area
                  v-model="contact.message"
                  rules="required|min:10"
                  label="Your Message"
                  vid="message"
                  outlined
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn :loading="loading" color="primary" type="submit">
                  Send message
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card>
      </v-col>
    </v-row>
    <v-footer fixed height="auto" class="py-2 mt-6 flex-column align-center">
      <ul>
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
</template>

<script>
import { mdiCircleMedium } from '@mdi/js';

export default {
  name: 'ContactPage',
  auth: false,
  data() {
    const defaultForm = Object.freeze({
      name: '',
      email: '',
      message: '',
    });
    return {
      contact: Object.assign({}, defaultForm),
      loading: false,
      mdiCircleMedium,
    };
  },
  head: {
    title: 'Contact Us',
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
    user() {
      return this.$auth.user;
    },
    isLoggedIn() {
      return this.$auth.loggedIn;
    },
  },
  mounted() {
    if (this.$auth.loggedIn) {
      this.contact = Object.assign(
        {},
        {
          name: this.user.name,
          email: this.user.email,
          message: '',
        }
      );
    }
  },
  methods: {
    async sendMessage() {
      this.loading = true;
      try {
        await this.$axios.$post('api/contact', this.contact);
        this.loading = false;
        this.$router.push('/');

        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Message Sent Successfully'
        );
      } catch (e) {
        this.loading = false;
        this.$refs.contactForm.setErrors(e.response.data.errors);
      }
    },
  },
};
</script>
