#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var ChatRoomTalker = require('./ChatRoom-talker.js');


// Uploader
var uploader = new ChatRoomTalker('http://127.0.0.1:8099', 'uploader');
uploader.onError = function(error) {
  console.log('uploader error:' + error);
};
uploader.onMessage = function(sUid, message) {
  console.log('uploader receive message from ' + sUid + ':' + message);
  uploader.send(sUid, 'Hello, my name is uploader');
};


// Downloader
var downloader = new ChatRoomTalker('http://127.0.0.1:8099', 'downloader');
downloader.onError = function(error) {
  console.log('downloader error:' + error);
};
downloader.onMessage = function(sUid, message) {
  console.log('downloader receive message from ' + sUid + ':' + message);
};


downloader.send('uploader', 'Hi, I am downloader');
