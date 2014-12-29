#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var io = require('socket.io-client');


var ChatRoom = {};
ChatRoom.JOIN = 'JOIN'; // clients join chartroom
ChatRoom.SEND = 'SEND'; // client sends message to server
ChatRoom.RECV = function(uid) {
  return 'RECV' + uid;
}; // server turns message to specified client
ChatRoom.NOTE = function(uid) {
  return 'NOTE' + uid; // server sends message to specified client
};


var ChatRoomTalker = module.exports = function(crAddress, uid) {
  this.crAddress = crAddress;
  this.uid = uid;
  this.socket = io.connect(crAddress);
  this.socket.emit(ChatRoom.JOIN, this.uid);

  var that = this;
  this.socket.on(ChatRoom.RECV(uid), function(talk) {
    that.onMessage(talk.sUid, talk.message);
  });
  this.socket.on(ChatRoom.NOTE(uid), function(note) {
    var error = note;
    that.onError(error);
  });

  this.socket.on('disconnect', function() {
    console.log('Disconnect');
  });
};


ChatRoomTalker.prototype.send = function(dUid, message) {
  var talk = {
    sUid: this.uid,
    dUid: dUid,
    message: message
  };
  this.socket.emit(ChatRoom.SEND, talk);
};


ChatRoomTalker.prototype.onMessage = function(sUid, message) {
  console.log('Override ChatRoomTalker onMessage method');
  process.exit(1);
};


ChatRoomTalker.prototype.onError = function(error) {
  console.log('Override ChatRoomTalker onError method');
  process.exit(1);
};
