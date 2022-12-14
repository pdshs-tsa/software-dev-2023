// socket-handler.js
import { Server } from "socket.io";
import {instrument} from "@socket.io/admin-ui";
import * as gameHandler from './handler/handleGames';

export default function injectSocketIO(server) {
    //initalize io socket instance
    const io = new Server(server, {
        cors: {
            origin: ["https://admin.socket.io"],
            credentials: true
        }
    });

    //initialize admin panel
    instrument(io, {
        auth: {
            type: "basic",
            username: "admin",
            password: "$2a$12$HVuKd/Mz9M32kQriJd2PqeHzKcX2Rbp.X8ZaGfDzBd0Ksjqu7AeHK" //password
        },
        mode: "development",
    });

    //init handlers
    gameHandler.init(io);

    const onConnection = (socket) => {
        socket.on('host', gameHandler.createGame);
        socket.on('prejoin', gameHandler.attemptGameJoin);
        socket.on('join', gameHandler.registerPlayer);
        socket.on('disconnect', gameHandler.clientDisconnect);
    }

    // Socket.IO stuff goes here
    io.on('connection', (socket) => {
        onConnection(socket);
    });

    console.log('SocketIO initialized');
}