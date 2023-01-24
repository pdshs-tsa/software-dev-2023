// socket-handler.js
import { Server } from "socket.io";
import * as gameHandler from './handler/handleGames.js';
import { instrument } from "@socket.io/admin-ui";

export default function injectSocketIO(server) {
    //initalize io socket instance
    const io = new Server(server, {
        cors: {
            origin: ["https://admin.socket.io"],
            credentials: true,
        }
    });

    instrument(io, {
        auth: {
            type: "basic",
            username: "admin",
            password: "$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS" // "changeit" encrypted with bcrypt
        },
        mode: "development"
    })

    //init handlers
    gameHandler.init(io);

    const onConnection = (socket) => {
        //pregame events
        socket.on('host', gameHandler.createGame); //create game
        socket.on('prejoin', gameHandler.attemptGameJoin); //check if code is here
        socket.on('join', gameHandler.registerPlayer); //attempt to join game
        socket.on('disconnecting', gameHandler.clientDisconnect); //client disconnect, either player or host
        socket.on('kick', gameHandler.kickPlayer); //host kick player
        socket.on('game-start', gameHandler.gameStart); //on game start

        socket.on('classic:answer', gameHandler.classicPlayerAnswer); //on player answer

        socket.on('maze:cell', gameHandler.fetchCellData); //fetch cell data for maze
        socket.on('maze:tick', gameHandler.mazeTick); //update player position
        socket.on('maze:move', gameHandler.mazeMove); //on cell move
        socket.on('maze:answer', gameHandler.mazePlayerAnswer);
        socket.on('maze:poi', gameHandler.mazePoiInteract); //on poi interact
    }

    io.on('connection', (socket) => {
        onConnection(socket);
    });

    console.log('SocketIO initialized');
}