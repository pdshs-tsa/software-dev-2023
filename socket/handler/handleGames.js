import database from "../../src/libs/server/database.js";

let io;
const games = {};

const init = function (inout) {
    io = inout;
}

const createGame = async function (setuuid) {
    const socket = this;
    if (socket.rooms.size !== 0) {
        for (const room of socket.rooms) {
            delete games[room];
            socket.leave(room);
        }
    }

    const code = Math.floor(100000 + Math.random() * 900000);

    const setdata = await database.getSet(setuuid);

    console.log(setdata);

    games[code] = {
        set: setdata,
        code: code,
        hostsocket: socket.id,
        players: []
    }

    socket.emit('ack:host', code);
    socket.join(code);
};

const attemptGameJoin = function (code) {
    const socket = this;
    console.log(code);
    socket.emit('ack:prejoin', code in games);
};

const registerPlayer = function (code, username) {
    const socket = this;
    if (!(code in games)) {
        socket.emit('ack:join', 0);
        return;
    }
    games[code].players.push(username);
    const gameData = games[code];
    socket.emit('ack:join', gameData);
    socket.join(code);
    socket.to(code).emit('player-join', username);
};

const destroyGame = function (code) {
    const socket = this;
    delete games[code];
    io.to(code).emit('end', code);
}

export {
    init,
    registerPlayer,
    attemptGameJoin,
    createGame
}