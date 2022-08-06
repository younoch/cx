export default {
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s - ' + process.env.APP_NAME,
    title: 'Home',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Help improve and co-innovate world’s customer experience. Collaborate with the customer experience and digital professionals from around the world, and exchange contextual best practices.',
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'fb:app_id',
        property: 'fb_app_id',
        content: process.env.FACEBOOK_CLIENT_ID,
      },
      {
        hid: 'og:image',
        name: 'og:image',
        property: "og:image",
        content: "https://cxbrainstorm.com/logo.png"
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },


  /*
    ** Public runtime config variables
  */

  publicRuntimeConfig: {
    appName: process.env.APP_NAME,
    appURL: process.env.APP_URL,
    apiURL: process.env.API_BASE_URL,
    googleRecaptchaSiteKey: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
    tinyMceApiKey: process.env.TINYMCE_API_KEY,
    googleMeasurementId: process.env.GOOGLE_MEASUREMENT_ID,
    googleAdsenseId: process.env.GOOGLE_ADSENSE_ID,
  },

  /*
   ** Private runtime config variables
   */
  privateRuntimeConfig: {},

  /*
   ** Router config
   */
  router: {
    middleware: ['auth'],
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'Followers',
          path: '/:username/followers',
          component: resolve(__dirname, 'pages/users/-followers.vue'),
        },
        {
          name: 'Followings',
          path: '/:username/followings',
          component: resolve(__dirname, 'pages/users/-followings.vue'),
        },
        {
          name: 'Profile',
          path: '/:username',
          component: resolve(__dirname, 'pages/users/-index.vue'),
        },
        {
          name: 'EditProfile',
          path: '/:username/edit',
          component: resolve(__dirname, 'pages/users/-edit.vue'),
        }
      );
    },
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#58C6E2', height: '4px' },

  /*
   ** Global CSS
   */
  css: ['~/assets/styles/app.scss'],

  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    // global filters
    '~/plugins/filters',
    // axios
    '~/plugins/axios',
    // vee-validate
    '~/plugins/vee-validate',
    // vue carousel
    '~/plugins/vue-carousel.client',
    // v-video-embed
    '~/plugins/v-video-embed.client',
    // medium editor
    '~/plugins/medium-editor.client',
    // theme detector
    '~/plugins/theme-detect.client',
    // for emoji chat
    '~/plugins/emoji-mart-vue.client',
    // for vue-drag-resize
    '~/plugins/vue-drag-resize.client',
    // For Google Analytics
    '~/plugins/gt.client'
  ],

  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: [
    '~/components',
    '~/components/forms',
    '~/components/headers',
    '~/components/maps',
    '~/components/maps/brainstorm',
    '~/components/maps/brainstorm/types',
    '~/components/posts',
    '~/components/subgroups',
    '~/components/shared',
  ],

  // serverMiddleware: ['~/middleware/headers'],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/laravel-echo',
    '@nuxtjs/pwa',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // auth
    '@nuxtjs/auth-next',
    // vue social share
    'vue-social-sharing/nuxt',
    // cookie
    'cookie-universal-nuxt',
    // google adsense
    '@nuxtjs/google-adsense',
    // social module
    '~/modules/social',
  ],

  // Google adsense
  'google-adsense': {
    id: process.env.GOOGLE_ADSENSE_ID,
    pageLevelAds: true,
    includeQuery: true,
    overlayBottom: true,
  },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    credentials: false,
    proxy: true,
    debug: process.env.NODE_ENV !== 'production',
  },

  // Set axios proxy
  proxy: {
    '/api/': {
      target: process.env.API_BASE_URL,
      pathRewrite: { '^/api/': '/' },
    },
  },

  /*
   ** Authentication options.
   */
  auth: {
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      callback: '/auth/callback',
      home: '/feed',
    },
    resetOnError: true,
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/me', method: 'get' },
        },
        token: {
          property: false,
          maxAge: 7200,
        },
      },
      facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID,
        endpoints: {
          authorization: 'https://www.facebook.com/v12.0/dialog/oauth',
          userInfo: false,
        },
        scope: ['public_profile', 'email'],
        responseType: 'code',
        codeChallengeMethod: '',
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        endpoints: {
          userInfo: false,
        },
        responseType: 'code',
        accessType: 'offline',
        grantType: 'authorization_code',
        codeChallengeMethod: '',
        scope: ['openid', 'profile', 'email'],
      },
      linkedin: {
        scheme: 'oauth2',
        clientId: process.env.LINKEDIN_CLIENT_ID,
        endpoints: {
          authorization: 'https://www.linkedin.com/oauth/v2/authorization',
          userInfo: false,
        },
        scope: ['r_liteprofile', 'r_emailaddress'],
        responseType: 'code',
        codeChallengeMethod: '',
      },
    },
    plugins: ['~/plugins/auth.client.js'],
  },

  // oauth 2
  social: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      authorization: 'https://accounts.google.com/o/oauth2/auth',
      responseType: 'code',
      accessType: 'offline',
      grantType: 'authorization_code',
      codeChallengeMethod: '',
      redirectUri: process.env.GOOGLE_CONTACT_REDIRECT_URL,
      scope: ['https://www.googleapis.com/auth/contacts.readonly'],
    },
  },

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: false,
    optionsPath: './vuetify.options.js',
    treeShake: true,
  },

  /**
   * Laravel Echo
   */
  echo: {
    broadcaster: 'pusher',
    key: process.env.PUSHER_APP_KEY,
    wsHost: process.env.WEBSOCKET_HOST,
    wsPort: process.env.WEBSOCKET_PORT,
    wssPort: process.env.WEBSOCKET_PORT,
    forceTLS: process.env.NODE_ENV === 'production',
    encrypted: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/api/auth/broadcasting',
    authModule: true,
    connectOnLogin: true,
    disconnectOnLogout: true,
    plugins: ['~/plugins/echo.js'],
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: process.env.APP_NAME,
      background_color: '#58C6E2',
      theme_color: '#58C6E2',
    },
    meta: {
      theme_color: '#58C6E2',
      ogSiteName: process.env.APP_NAME,
    },
    workbox: {
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: '/api/.*',
          strategyOptions: {
            cacheName: 'api-cache',
          },
        },
      ],
    },
  },

  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    extractCSS: true,
    transpile: ['vee-validate/dist/rules', 'lodash-es'],
  },
};
