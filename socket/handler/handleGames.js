const database = require("../../src/libs/server/database.js")

let io;
const games = new Map();

const init = function (inout) {
    io = inout;
}

const createGame = async function (setuuid) {
    const socket = this;
    const code = Math.floor(100000 + Math.random() * 900000);
    const setdata = await database.getSet(setuuid);

    games.set(code, {
        set: setdata,
        code: code,
        hostsocket: socket.id,
        players: []
    });

    socket.emit('ack:host', code);
    socket.join(code);
};

const attemptGameJoin = function (code) {
    const socket = this;
    socket.emit('ack:prejoin', games.has(code));
};

const registerPlayer = function (code, username) {
    const socket = this;
    if (!games.has(code)) socket.emit('ack:join', 0);
    games.get(code).players.push(username);
    const gameData = games.get(code);
    socket.emit('ack:join', gameData);
    socket.join(code);
    socket.to(code).emit('player-join', username);
};

export {
    init,
    registerPlayer,
    attemptGameJoin,
    createGame
}