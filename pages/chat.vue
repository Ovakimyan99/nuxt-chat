<template>
  <div class="c-wrap">
    <div class="c-chat" ref="chat">
      <message-app
        v-for="m in messages"
        :key="m.text + Math.random()"
        :name="m.name"
        :text="m.text"
        :owner="m.id === user.id"
      />
    </div>
    <div class="c-form">
      <chat-form-app />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MessageApp from '../components/Message'
import ChatFormApp from '../components/ChatForm'
export default {
  name: 'chat',
  middleware: ['chat'],
  components: {
    MessageApp,
    ChatFormApp
  },
  head () {
    return {
      title: `Комната ${this.user.room}`
    }
  },
  computed: mapState(['user', 'messages']),
  watch: {
    messages () {
      setTimeout(() => {
        if (this.$refs.chat) {
          this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
        }
      })
    }
  }
}
</script>

<style scoped>
.c-wrap {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.c-form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  padding: 1rem;
  background: #212121;
}

.c-chat {
  position: absolute;
  bottom: 80px;
  right: 0;
  left: 0;
  top: 0;
  padding: 1rem;
  overflow-y: auto;
}
</style>
