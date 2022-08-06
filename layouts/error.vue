<template>
  <v-row align="center" justify="center">
    <template v-if="error.statusCode === 404">
      <v-col cols="12" md="6" class="text-md-right hidden-sm-and-down">
        <img src="~assets/images/errors/404.svg" alt="404" />
      </v-col>
      <v-col cols="12" md="6" class="text-md-left text-center">
        <h1>404</h1>
        <h2 class="my-3 headline">Sorry, page not found.</h2>
        <v-btn color="primary" nuxt to="/"> Go Home </v-btn>
      </v-col>
    </template>
    <template v-if="error.statusCode === 500">
      <v-col cols="12" md="6" class="text-md-right hidden-sm-and-down">
        <img src="~assets/images/errors/500.svg" alt="500" />
      </v-col>
      <v-col cols="12" md="6" class="text-md-left text-center">
        <h1>500</h1>
        <h2 class="my-3 headline">Sorry, the server is down.</h2>
        <v-btn color="primary" nuxt to="/"> Go Home </v-btn>
      </v-col>
    </template>
    <template v-if="error.statusCode === 403">
      <v-col cols="12" md="6" class="text-md-right hidden-sm-and-down">
        <img src="~assets/images/errors/403.svg" alt="403" />
      </v-col>
      <v-col cols="12" md="6" class="text-md-left text-center">
        <h1>403</h1>
        <h2 class="my-3 headline">Sorry, access denied.</h2>
        <v-btn color="primary" nuxt to="/"> Go Home </v-btn>
      </v-col>
    </template>
    <template v-if="error.statusCode === 400">
      <v-col cols="12" md="6" class="text-md-right hidden-sm-and-down">
        <img src="~assets/images/errors/403.svg" alt="400" />
      </v-col>
      <v-col cols="12" md="6" class="text-md-left text-center">
        <h1>400</h1>
        <h2 class="my-3 headline">Sorry, bad request.</h2>
        <v-btn color="primary" nuxt to="/"> Go Home </v-btn>
      </v-col>
    </template>
  </v-row>
</template>

<script>
export default {
  name: 'ErrorPage',
  layout: 'error-layout',
  // eslint-disable-next-line vue/require-prop-types
  props: ['error'],
};
</script>
