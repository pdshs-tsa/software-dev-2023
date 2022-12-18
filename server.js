// server.js
import http from "http";
import { handler } from './build/handler.js'; // <- Import SvelteKit handlers
import injectSocketIO from "./socket/socket-handler.js"; // The SocketIO stuff (see next step)
import express from 'express';

const app = express();
const server = http.createServer(app);

// Inject SocketIO
injectSocketIO(server)

// SvelteKit handlers
app.use(handler);

console.log('called');

server.listen(5999, () => {
    console.log('Running on http://localhost:5999');
});