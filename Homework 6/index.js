const http = require('http');

const server = http.createServer((request, response) => {});
const io = require("socket.io")(server, {
    cors: {
        origin: "*", // как выяснилось, CORS хрома не работает с localhost :(
        methods: ["GET", "POST"]
    }
});
server.listen(3000, 'localhost');

let users = {}

io.on('connection', function (client) {
    client.on("set username", (data) => {
        users[client.id] = data.name;
        sendMessageToAll(`${data.name} теперь с нами!`);
    });

    client.on('disconnect', () => {
        let name = users[client.id];
        delete users[client.id];
        sendMessageToAll(`${name} ушёл от нас :(`);

    });

    client.on('reconnect', () => {
       sendMessageToAll(`${users[client.id]}  переподключается.`);
    });

    client.on('send message', (data) => {
        sendMessageToAll(`${users[client.id]}: ${data.message}`);
    });
});

function sendMessageToAll(text) {
    io.emit('message', {text: text, online: Object.keys(users).length});
}

