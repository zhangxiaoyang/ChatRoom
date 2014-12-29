#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var io = require('socket.io').listen(8099);
var ChatRoom = require('./ChatRoom.js');

chartroom = new ChatRoom(io);
chartroom.start();
