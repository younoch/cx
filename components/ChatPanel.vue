<template>
  <div class="chat-panel">

    <ChatMessages />

    <SingleChatWindow
      v-for="(singleChatUser, index) in singleChatUsers"
      :key="index"
      :chat-user="singleChatUser"
      :chat-index="index"
    />
  </div>
</template>

<script>
export default {
  name: 'ChatPanel',
  computed: {
    singleChatUsers() {
      return this.$store.state.chat.singleChatUsers;
    },
  },

};
</script>
