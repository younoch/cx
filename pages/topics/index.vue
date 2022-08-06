<template>
  <v-container>Redirecting...</v-container>
</template>
<script>
export default {
  name: 'CxTopics',

  created() {
    this.$router.push('/topics/digital-transformation');
  },
};
</script>
