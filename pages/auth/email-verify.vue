<template>
  <v-container class="h-100">
    <v-row class="h-100" justify="center" align="center">
      <v-col cols="12" sm="6" md="4">
        <v-card class="elevation-2 pa-3" min-height="300">
          <v-card-title class="justify-center">
            Email Confirmation
          </v-card-title>
          <v-divider />
          <v-card-text>
            <template v-if="success">
              <v-alert :value="true" type="success">
                {{ message }}
              </v-alert>
              <v-btn nuxt to="/auth/login" block class="primary">
                Log In
              </v-btn>
            </template>
            <template v-else>
              <v-alert :value="true" type="error">
                {{ message }}
              </v-alert>
              <v-btn nuxt to="/auth/resent-email" block class="primary">
                Resent Confirmation Link
              </v-btn>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ConfirmEmail',
  auth: 'guest',
  async asyncData({ app, query }) {
    try {
      const data = await app.$axios.$get(query.queryURL);
      return {
        message: data.message,
        status: data.status,
        success: true,
        error: false,
      };
    } catch (e) {
      return {
        message: e.response.data.message,
        status: e.response.status,
        success: false,
        error: true,
      };
    }
  },
  head() {
    return {
      title: 'Email Verification',
    };
  },
};
</script>
