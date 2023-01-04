import io from "socket.io-client";
let socket1;

socket1 = io({
    transports: ['websocket'],
    upgrade: false
});

export const socket = socket1;