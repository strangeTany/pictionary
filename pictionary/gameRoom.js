const colyseus = require('colyseus');

exports.MyRoom = class extends colyseus.Room {

  onInit(options) {
    this.guessWord;
    this.pack;
    this.drawer;
    this.guessed = false
    this.gameState = false
  }

  onCreate(options) {
    this.pack = options.pack

    this.onMessage("type", (client, message) => {
      // handle "type" message.
    });

  }

  onJoin(client, options) {
    client.username = options.username
    client.score = 0
    let usernames = []
    let scores = []
    clients.forEach(cli => {
      usernames.push(cli.username)
      scores.push(cli.score)
    });
    if(this.clients.length == 1){
      this.drawer = client.username
    }
    this.state.message.push(`${client.id} joined`)
    this.broadcast(JSON.stringify({
      'usernames': usernames,
      'scores': scores,
      'drawer': this.drawer
    }))
  }

  onMessage(client, data) {
    let type = data.type
    if (type == 'chat') {
      if (data.msg == this.guessWord && this.gameState) {
        if (this.guessed)
          client.score += 50
        else
          client.score += 100
        this.guessed = true
        this.broadcast({ msg: 'guessed', username: client.username, score: client.score })
      } else
        this.broadcast({ msg: data.msg, username: client.username })
    } else if (type == 'update') {
      this.broadcast({ img: data.img })
    } else if (type == 'start') {
      //TODO: get random word from pack
      this.guessWord = 'newWord'
      this.gameState = true
      client.send(this.guessWord, { type: 'ammo' })
      setTimeout(() => {
        this.gameState = false
        let newDrawer = this.clients((this.clients.findIndex(client) + 1) % this.clients.length())
        this.drawer = newDrawer.username
        this.broadcast({ word: this.guessWord, drawer: this.drawer })
        newDrawer.send('new game', {type: 'ammo'})
      }, 5000)
      this.broadcast({ state: 'start' })
    }


  }

  onLeave(client, consented) {
    if(client.username == drawer)
      this.gameState = false
      let newDrawer = this.clients((this.clients.findIndex(client) + 1) % this.clients.length())
      this.drawer = newDrawer.username
      newDrawer.send('new game', {type: 'ammo'})
  }

  onDispose() {
  }

}
