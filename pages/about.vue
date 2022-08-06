<template>
  <v-container id="page" class="py-sm-16 py-10">
    <v-row align="center" class="pb-16">
      <v-col cols="12" sm="6">
        <h1>Hi, and welcome to the CXBrainstorm</h1>
        <p>
          An innovation passionate collective of business and technology
          professionals striving to improve CX across industries globally
        </p>
        <p>
          A global brainstorming and best practice exchange platform for
          customer experience heroes who Live CX every day!
        </p>
        <p>
          CXBrainstorm.com is designed to facilitate the improvement of CX
          offered by organisations across industries around the world. It is the
          new way to network, exchange best practices, collaborate over ideas,
          and innovate CX - throughout customer's lifecycle and touchpoints
          (IVR, Mobile, Web, Retail, etc.).
        </p>
        <p>
          If you are passionate about CX then join CXBrainstorm.com today and
          become part of a global revolution.
        </p>
      </v-col>
      <v-col cols="12" sm="6">
        <v-dialog max-width="608">
          <template #activator="{ on }">
            <v-card class="player" v-on="on">
              <v-img
                :src="require('~/assets/images/home/video2.jpg')"
                aspect-ratio="1.5"
              >
                <v-icon size="60" color="primary">
                  {{ mdiPlayCircle }}
                </v-icon>
              </v-img>
            </v-card>
          </template>
          <v-card>
            <v-card-title class="primary justify-center">
              Live CX The Global CX Brainstorm
            </v-card-title>
            <v-divider />
            <v-card-text>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/ujSt8-sdG4s"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </v-card-text>
          </v-card>
        </v-dialog>
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
import { mdiPlayCircle, mdiCircleMedium } from '@mdi/js';
export default {
  name: 'AboutPage',
  auth: false,
  data: () => ({
    mdiPlayCircle,
    mdiCircleMedium,
  }),
  head: {
    title: 'About Us',
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
};
</script>
