import io from "socket.io-client";
import {hostname} from "../stores.js";

let socket1;

socket1 = io({
    transports: ['websocket'],
    upgrade: false
});

console.log("loaded");

export const socket = socket1;