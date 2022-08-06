<template>
  <v-app id="map">
    <AppBar v-model="drawer" />
    <v-navigation-drawer
      v-if="breakpoint.xsOnly"
      v-model="drawer"
      fixed
      app
      width="220"
      light
    >
      <v-toolbar class="secondary">
        <v-img
          :src="require('~/assets/images/logo/livecx-text.png')"
          width="100%"
          height="100%"
          :alt="title"
        />
      </v-toolbar>
      <v-list dense expand class="pb-4">
        <template v-for="(item, i) in items">
          <v-list-item
            :key="i"
            nuxt
            :to="
              item.title === 'Home' && loggedIn ? `${item.link}feed` : item.link
            "
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="'divider' + i" />
        </template>
        <template v-if="loggedIn">
          <v-list-item nuxt to="/users/notifications">
            <v-list-item-action>
              <v-icon>{{ mdiBell }}</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>
                {{ 'Notifications' }}
                <v-badge
                  v-if="unreadCount > 0"
                  color="purple"
                  :content="unreadCount"
                />
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider key="notifications" />
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <nuxt />
    </v-main>
    <v-footer height="auto" class="pa-3 justify-center">
      <span class="caption">
        &copy;{{ new Date().getFullYear() }} — <strong>{{ title }}</strong>
        . All Rights Reserved.
      </span>
      <ul>
        <li>
          <n-link to="/privacy-policy"> Privacy Policy </n-link>
        </li>
        <li>
          <n-link to="/terms-of-use"> Terms of Use </n-link>
        </li>
        <li>
          <n-link to="/contact-us"> Contact Us </n-link>
        </li>
      </ul>
    </v-footer>
    <AppFab />
    <v-snackbar
      v-if="snackbar"
      :value="snackbar.show"
      :timeout="snackbar.timeout"
      top
      :color="snackbar.color"
      @input="$store.commit('CLOSE_SNACKBAR')"
    >
      {{ snackbar.message }}
      <template #action="{ attrs }">
        <v-btn
          dark
          text
          icon
          v-bind="attrs"
          @click.native="$store.commit('CLOSE_SNACKBAR')"
        >
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <!-- <Confirm ref="confirm" /> -->
  </v-app>
</template>

<script>
import {
  mdiForum,
  mdiMusic,
  mdiHome,
  mdiMenu,
  mdiClose,
  mdiHeart,
  mdiAccount,
  mdiImage,
  mdiVideo,
  mdiFileDocument,
  mdiAccountMultiple,
  mdiFire,
  mdiMapMarkerDistance,
  mdiHeadSnowflake,
  mdiBell,
  mdiNetwork,
} from '@mdi/js';
import { mapGetters } from 'vuex';

export default {
  name: 'DefaultLayout',
  data() {
    return {
      title: 'CXBrainstorm',
      drawer: false,
      dark: false,
      isHydrated: false,
      mdiForum,
      mdiHome,
      mdiMusic,
      mdiMenu,
      mdiClose,
      mdiHeart,
      items: [
        {
          title: 'Home',
          link: '/',
          icon: mdiHome,
        },
        {
          title: 'My Network',
          link: '/my-network',
          icon: mdiNetwork,
        },
        {
          title: 'CX Brainstorm',
          link: '/cx-brainstorm',
          icon: mdiHeadSnowflake,
        },
        {
          title: 'Hot Topics',
          link: '/topics/digital-transformation',
          icon: mdiFire,
        },
        {
          title: 'Map Experiences',
          link: '/map-experiences',
          icon: mdiMapMarkerDistance,
        },
        {
          title: 'Members',
          link: '/members',
          icon: mdiAccountMultiple,
        },
        {
          title: 'Images',
          link: '/images',
          icon: mdiImage,
        },
        {
          title: 'Videos',
          link: '/videos',
          icon: mdiVideo,
        },
        {
          title: 'Documents',
          link: '/documents',
          icon: mdiFileDocument,
        },
      ],
      mdiAccount,
      mdiBell,
    };
  },
  computed: {
    snackbar() {
      return this.$store.state.snackbar;
    },
    loggedIn() {
      return this.$auth.loggedIn;
    },
    breakpoint() {
      return this.isHydrated ? this.$vuetify.breakpoint : { xsOnly: false };
    },
    ...mapGetters({
      unreadCount: 'notification/unreadCount',
    }),
  },
  mounted() {
    this.isHydrated = true;
    if (this.$vuetify.theme.dark) {
      this.dark = true;
    }
  },
  methods: {
    handleDrawerToggle() {
      this.drawer = !this.drawer;
    },
    toggleTheme(value) {
      this.$vuetify.theme.dark = value;
    },
  },
};
</script>
