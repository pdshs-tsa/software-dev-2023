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
        //pregame events
        socket.on('host', gameHandler.createGame); //create game
        socket.on('prejoin', gameHandler.attemptGameJoin); //check if code is here
        socket.on('join', gameHandler.registerPlayer); //attempt to join game
        socket.on('disconnecting', gameHandler.clientDisconnect); //client disconnect, either player or host
        socket.on('kick', gameHandler.kickPlayer); //host kick player
        socket.on('player-answer', gameHandler.playerAnswer); //on player answer
        socket.on('game-start', gameHandler.gameStart); //on game start
    }

    io.on('connection', (socket) => {
        onConnection(socket);
    });

    console.log('SocketIO initialized');
}