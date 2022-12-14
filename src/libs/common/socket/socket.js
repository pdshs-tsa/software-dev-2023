import io from "socket.io-client";

const socket1 = io('http://localhost:5173');

console.log("loaded");

export const socket = socket1;