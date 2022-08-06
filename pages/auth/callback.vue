<template>
  <v-container class="h-100">
    <v-row justify="center" align="center" class="h-100">
      <v-col cols="12" sm="6" md="4">
        <v-card class="elevation-2 pa-3" min-height="300">
          <v-card-title class="justify-center"> Social Login </v-card-title>
          <v-divider />
          <v-card-text class="d-flex align-center flex-column">
            <v-progress-circular
              :size="70"
              :width="7"
              color="primary"
              indeterminate
            />
            <p class="text-subtitle-2 mt-4">Please Wait...</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'SocialLogin',
  auth: 'guest',
  async mounted() {
    const provider = this.$auth.$storage.getUniversal('social');
    const code = this.$route.query.code;
    const oauthToken = this.$route.query.oauth_token;
    const oauthVerifier = this.$route.query.oauth_verifier;
    const auth = this.$auth;

    try {
      let requestData = { provider, code };
      if (provider === 'twitter') {
        requestData = {
          provider,
          oauthToken,
          oauthVerifier,
          oauthTokenSecret:
            this.$auth.$storage.getUniversal('oauthTokenSecret'),
        };
      }
      const token = await this.$axios.$post('api/auth/social', requestData);
      // set auth token
      setTimeout(async () => {
        this.$auth.$storage.removeUniversal('social');
        this.$auth.$storage.removeUniversal('oauthTokenSecret');
        await auth.setStrategy('local');
        setTimeout(async () => {
          await auth.setUserToken(token);
          const authId = this.$auth.user.id;
          await this.$store.dispatch('online/joinOnline');
          await this.$store.dispatch('notification/joinToChannel', authId);
          await this.$store.dispatch('notification/getNotifications');
          await this.$router.push('/feed');
        });
      });
      this.$store.commit('LOGIN_SUCCESS', 'Successfully Logged In');
    } catch (err) {
      this.$store.commit(
        'APP_NETWORK_ERROR',
        err.response && err.response.data.message
      );
      this.$router.push('/auth/login');
    }
  },
};
</script>
