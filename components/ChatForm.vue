<template>
  <v-flex xs12>
    <v-text-field label="Введите сообщения" outline v-model="text" @keydown.enter="send" />
  </v-flex>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'ChatForm',
  data: () => ({
    text: ''
  }),
  computed: {
    ...mapState(['user'])
  },
  methods: {
    send () {
      this.$socket.emit('createMessage', {
        text: this.text,
        id: this.user.id
      }, (data) => {
        if (typeof data === 'string') {
          console.error(data)
        } else {
          this.text = ''
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
