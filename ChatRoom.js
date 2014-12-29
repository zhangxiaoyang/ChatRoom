#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var SocketPool = require('./SocketPool.js');


var ChatRoom = module.exports = function(io) {
  this.io = io;
  this.socketPool = new SocketPool();
};


ChatRoom.JOIN = 'JOIN'; // clients join chartroom
ChatRoom.SEND = 'SEND'; // client sends message to server
ChatRoom.RECV = function(uid) {
  return 'RECV' + uid;
}; // server turns message to specified client
ChatRoom.NOTE = function(uid) {
  return 'NOTE' + uid; // server sends message to specified client
};


ChatRoom.prototype.onJoin= function(socket) {
  var that = this;

  socket.on(ChatRoom.JOIN, function (uid) {
    that.socketPool.add(uid, socket);
    console.log('uid:' + uid + ' logined. socket:' + socket.id);
  });
};


ChatRoom.prototype.onMessage = function(socket) {
  var that = this;

  socket.on(ChatRoom.SEND, function (talk) {
    var dSocket = that.socketPool.get(talk.dUid);
    if(dSocket) {
      dSocket.emit(ChatRoom.RECV(talk.dUid), talk);
      console.log('talk sent:' + talk.sUid + '->' + talk.dUid);
    }
    else {
      var note = 'talk not sent:' + talk.sUid + '->' + talk.dUid;
      console.log(note);
      socket.emit(ChatRoom.NOTE(talk.sUid), note);
    }
  });
};


ChatRoom.prototype.onBye = function(socket) {
  var that = this;

  socket.on('disconnect', function() {
    that.socketPool.removeBySocket(socket);
  });
};


ChatRoom.prototype.start = function() {
  this.socketPool = new SocketPool();

  var that = this;
  this.io.sockets.on('connection', function (socket) {

    that.onJoin(socket);

    that.onMessage(socket);

    that.onBye(socket);
  });
};
