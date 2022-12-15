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
    socket.emit('ack:prejoin', code in games);
};

const registerPlayer = function (code, username) {
    const socket = this;

    //check if code exists
    if (!(code in games)) {
        socket.emit('ack:join', 0);
        return;
    }

    //username checks
    username = username.trim();
    if (username.length > 16) username = username.substring(0, 17);
    for (const p of games[code].players){
        if (p.username === username){
            socket.emit('ack:join', 0);
            return;
        }
    }

    //register player obj
    games[code].players.push({
        id: socket.id,
        username: username
    });

    //emit join events
    socket.emit('ack:join', games[code]);
    socket.to(code).emit('player-join', username);
    socket.join(code);
};

const destroyGame = function (code) {
    const socket = this;
    io.to(code).emit('end', code);
    games[code].players.forEach((element) => {
       io.sockets.sockets.get(element.id).leave(code);
    });
    delete games[code];
}

const clientDisconnect = function () {
    const socket = this;
    const rooms = Array.from(socket.rooms);
    const code = rooms.find((element) => element in games)
    //not joined a game
    if (code === undefined) return;

    try {
        if (games[code].hostsocket === socket.id) {
            destroyGame(code);
            return;
        }
        const player = games[code].players.find((element) => element.id === socket.id);
        io.to(code).emit('player-leave', player.username);
        games[code].players.splice(games[code].players.indexOf(player), 1);
    } catch (err){
        console.log('Attempted to destroy a game that already was gone.');
    }
}

const kickPlayer = function (code, username) {
    const socket = this;
    for (const player of games[code].players) {
        if (player.username === username){
            io.to(player.id).emit('end');
            io.sockets.sockets.get(player.id).leave(code);
            io.to(code).emit('player-leave', username);
            games[code].players.splice(games[code].players.indexOf(player), 1);
            break;
        }
    }
}

export {
    init,
    registerPlayer,
    attemptGameJoin,
    createGame,
    clientDisconnect,
    kickPlayer
}