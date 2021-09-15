const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const m = (name, text, id) => ({name, text, id})
const users = require('./users')()

io.on('connection', socket => {
  socket.on('userJoined', (data, cb) => {
    if (!data.name || !data.room) {
      return cb('сука, взломать хочешь?')
    }

    // подключаем человека к определенной комнате
    socket.join(data.room)
    users.remove(socket.id)
    users.add({
      id: socket.id,
      name: data.name,
      room: data.room
    })
    cb({userId: socket.id})
    io.to(data.room).emit('updateUsers', users.getByRoom(data.room))
    socket.emit('newMessage', m('admin', `Добро пожаловать ${data.name}`))
    // broadcast - вызывает для всех, кроме текущего. to(data.room) - соединяем с определенной комнатой
    socket.broadcast
      .to(data.room)
      .emit('newMessage', m('admin', `Пользователь ${data.name} зашел`))
  })

  // Обращаемся через front к "on('func name')"
  socket.on('createMessage', (data, cb) => {
    if (!data.text) {
      return cb('Текст не может быть пустым. Лээ, сука, ты чо, чорт?')
    }

    const user = users.get(data.id)
    if (user) {
      io.to(user.room).emit('newMessage', m(user.name, data.text, user.id))
    }
    cb()
  })

  socket.on('userLeft', async (data, cb) => {
    const user = await users.remove(data)
    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      io.to(user.room).emit(
        'newMessage',
        m('admin', `Пользователь ${user.name} вышел.`)
      )
    }
    cb()
  })

  socket.on('disconnect', () => {
    const user = users.remove(socket.id)
    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      io.to(user.room).emit(
        'newMessage',
        m('admin', `Пользователь ${user.name} вышел.`)
      )
    }
  })
})

module.exports = {
  app,
  server
}
