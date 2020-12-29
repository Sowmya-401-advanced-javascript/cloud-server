'use strict';

require('dotenv').config();
const io = require('socket.io-client');
const host = "http://localhost:3000";
const capsConnectionSocket = io.connect('http://localhost:3000/caps');

capsConnectionSocket.emit('join', process.env.STORENAME)

capsConnectionSocket.on('pickup', (pickupPayload) => {
  
  setTimeout(() => {
    console.log('picked up ' + pickupPayload.orderId );
    capsConnectionSocket.emit('in-transit', pickupPayload)
  }, 1500);

  setTimeout(() => {
    console.log('delivered ' + pickupPayload.orderId);
    capsConnectionSocket.emit('delivered', pickupPayload);
  }, 3000);
});
