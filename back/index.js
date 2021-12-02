const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const User = require("./models/User");
const Messages = require("./models/Messages");
const app = express();
const mongoose = require('mongoose');
const user = require('./routes/user');
require('express-ws')(app);

const port = 8000;

const appHttp = express();

appHttp.use(cors());
appHttp.use(express.json());
appHttp.use('/users', user);


const run = async () => {
    await mongoose.connect('mongodb://localhost/chat');

    appHttp.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

run();

const portWs = 8001;

app.use(cors());

const activeConnections = {};

app.ws('/chat', async function (ws, req) {
    const userToken = req.query.token;

    console.log(req.query);

    if (!userToken) {
        ws.close();
        return
    }

    const user = await User.findOne({token: userToken});

    if (!user) {
        ws.close();
        return
    }

    activeConnections[user.id] = {ws: ws, user: user};

    console.log(`Client connected! id=${user.id}`);

    ws.on('message', msg => {
        const message = JSON.parse(msg);

        let data = JSON.stringify({type: 'NEW_MESSAGE', message: message.data});

        if (message.type === 'CREATE_MESSAGE') {
            Messages.create({title: message.data.message, author: user.id});
            Object.keys(activeConnections).forEach(key => {
                const connection = activeConnections[key];
                connection.ws.send(data);
            });
        } else {
            console.log('Unknown type', message.type)
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected! id=${user.id}`);
        delete activeConnections[user.id];
        const activeUsers = [];

        Object.keys(activeConnections).forEach(key => {
            const user = activeConnections[key].user;
            activeUsers.push(user);
        });

        Object.keys(activeConnections).forEach(key => {
            const connection = activeConnections[key];
            connection.ws.send(JSON.stringify({type: 'ONLINE_USERS', onlineUsers: activeUsers}));
        });
    });

    const activeUsers = [];

    Object.keys(activeConnections).forEach(key => {
        const user = activeConnections[key].user;
        activeUsers.push(user);
    });

    const lastMessages = await Messages.find().populate('author', 'username').sort({_id: 1}).limit(30);

    ws.send(JSON.stringify({type: 'LAST_MESSAGES', messages: lastMessages}));


    Object.keys(activeConnections).forEach(key => {
        const connection = activeConnections[key];
        connection.ws.send(JSON.stringify({type: 'ONLINE_USERS', onlineUsers: activeUsers}));
    });
});


app.listen(portWs, () => {
    console.log(`Server started on ${portWs} port!`);
});