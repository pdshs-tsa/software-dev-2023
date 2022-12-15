import io from "socket.io-client";

const socket1 = io('http://localhost:5173', {
    transports: ['websocket'],
    upgrade: false
});

console.log("loaded");

export const socket = socket1;