'use strict';

require('dotenv').config();
const uuid = require('uuid').v4;
const port = process.env.PORT || 3000;
const io = require('socket.io')(port);

const queue = {
    orders: {}
}

function logger(eventName, payload) {
    
    let currentTimestamp = Math.floor(Date.now() / 1000);
    
    console.log('EVENT { ' + 'event: ' + '\'' + eventName + '\',\n' + 'time: ' + currentTimestamp + ',\n' + ' payload: ' + JSON.stringify(payload) + '}');
}

io.on('connection', (socket1) => {
    console.log('Welcome to the HUB', socket1.id);  
    
});

const caps = io.of('/caps');

caps.on('connection', (socket) => {
    console.log('caps: You are now connected to the CAPS system', socket.id);

    // a way for vendors to join the rooms(Private spaces)
    // So that we can send them direct messages
    socket.on('join', room => {
        console.log(`${socket.id} is joining ${room}`);
        socket.join(room);
    });

    socket.on('pickup', (orderPayload) => {
        logger('pickup', orderPayload);

        queue.orders[orderPayload.orderId] = orderPayload;

        caps.emit('pickup', orderPayload);

        // socket.emit('added')
        // caps.emit('orders', { messageID: id, payload});
    });

    socket.on('received', queuedOrderPayload => {
        console.log('In the HUB - heard RECEIVED', queuedOrderPayload);
        delete queue.orders[queuedOrderPayload.orderId];
    });

    socket.on('getAll', () => {
        // 1. get all orders from queue
        console.log('In the HUB - listening to GETALL');
        Object.keys(queue.orders).forEach(orderIdKey => {
            // 2. broadcast to the client
            socket.emit(queue.orders[orderIdKey]);
        });
    })

    socket.on('in-transit', (transitPayload) => {
        logger('in-transit', transitPayload);
        caps.to(transitPayload.storeName).emit('in-transit', transitPayload);
    });

    socket.on('delivered', (deliveryPayload) => {
        logger('delivered', deliveryPayload);
        caps.to(deliveryPayload.storeName).emit('delivered', deliveryPayload);
    });
})
