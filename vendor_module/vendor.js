'use strict'; 
require('dotenv').config();

const io = require('socket.io-client');
const host = "http://localhost:3000";
const capsConnectionSocket = io.connect('http://localhost:3000/caps');
const faker = require('faker');

capsConnectionSocket.emit('join', process.env.STORENAME)

console.log('Before set-interval');

setInterval(() => {
    console.log('Before fakeorder');
    const storeName = process.env.STORENAME;
    const storeId = process.env.STORE_ID;
    const orderId = faker.random.uuid();
    const customerName = faker.name.firstName();
    const customerAddress = faker.address.streetAddress();

    const fakeOrder = {
        storeName: storeName,
        storeId: storeId,
        orderId: orderId,
        customerName: customerName,
        customerAddress: customerAddress
    };
    console.log(fakeOrder, 'After SetInterval');
    capsConnectionSocket.emit('pickup', fakeOrder);
}, 500);


capsConnectionSocket.on('delivered', (pickupPayload) => {
    console.log('Thank you for delivering ' + pickupPayload.orderId );
});

