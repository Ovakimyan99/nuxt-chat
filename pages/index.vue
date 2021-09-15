<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card min-width="400">
        <v-snackbar v-model="snackbar" :timeout="6000" top>
          {{message}}
          <v-btn color="pink" flat @click="snackbar = false">Закрыть</v-btn>
        </v-snackbar>
        <v-card-title><h1>Nuxt чат</h1></v-card-title>
        <v-card-text>
          <v-form lazy-validation v-model="valid" ref="form">
            <v-text-field v-model="name" :counter="16" :rules="nameRules" label="Ваше имя" required></v-text-field>
            <v-text-field v-model="room" :rules="roomRules" label="Введите комнату" required></v-text-field>
            <v-btn :disabled="!valid" color="primary" @click="submit">Войти</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'
import socket from '../plugins/socket'
export default {
  layout: 'empty',
  head: {
    title: 'Добро пожаловать в uxt чат'
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    }
  },
  data () {
    return {
      valid: true,
      name: '',
      snackbar: false,
      message: '',
      nameRules: [
        v => !!v || 'Введите имя',
        v => (v && v.length <= 16) || 'имя не должно превышать 16 символов'
      ],
      room: '',
      roomRules: [
        v => !!v || 'Введите комнату'
      ]
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    submit () {
      if (this.$refs.form.validate()) {
        const user = {
          name: this.name,
          room: this.room
        }

        // Обращаемся к сокетам и емитим запрос к созданной мной "функции"
        // передаем 3 параметра: "название функции", свою инфу и cb, которая
        // возвращается только после отработки заэмиченной функции
        this.$socket.emit('userJoined', user, data => {
          // если вернули ошибку (через cb возвращаем строку), то выдаем ошибку
          if (typeof data === 'string') {
            console.error(data)
          } else {
            // если все норм, то возвращаем данные через "data"
            // задаем id пользователю через возвращаемый id socket
            user.id = data.userId
            this.setUser(user)
            this.$router.push('/chat')
          }
        })
      }
    }
  },
  mounted () {
    const {message} = this.$route.query
    if (message === 'noUser') {
      this.message = 'Введите данные'
    } else if (message === 'leftChat') {
      this.message = 'Вы вышли из чата'
    }

    this.snackbar = !!this.message
  }
};
</script>
