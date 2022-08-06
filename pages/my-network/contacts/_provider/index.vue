<template>
  <v-container class="h-100">
    <v-row justify="center" align="center" class="h-100">
      <v-col cols="12" sm="6" lg="4">
        <v-card class="elevation-2 pa-3" min-height="300">
          <v-card-title class="justify-center">
            Importing Contacts
          </v-card-title>
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
  name: 'ContactImport',
  async mounted() {
    const provider = this.$route.params.provider;
    const code = this.$route.query.code;

    try {
      const requestData = { provider, code };

      const { message } = await this.$axios.$post(
        'api/connection/contact',
        requestData
      );

      this.$store.commit('CRUD_SUCCESS', {
        message,
        path: '/my-network/contacts',
      });
    } catch (err) {
      this.$store.commit(
        'APP_NETWORK_ERROR',
        err.response && err.response.data.message
      );
      this.$router.push('/my-network/contacts');
    }
  },
};
</script>
