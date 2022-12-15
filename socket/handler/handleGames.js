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
    if (!(code in games)) {
        socket.emit('ack:join', 0);
        return;
    }
    games[code].players.push({
        id: socket.id,
        username: username
    });
    const gameData = games[code];
    socket.emit('ack:join', gameData);
    socket.join(code);
    socket.to(code).emit('player-join', username);
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
    if (code === null) return;

    try {
        if (games[code].hostsocket === socket.id) {
            destroyGame(code);
            return;
        }
        io.to(code).emit('player-leave', games[code].players.find((element) => element.id === socket.id).username);
    } catch (err){
        console.log('Attempted to destroy a game that already was gone.');
    }
}

const kickPlayer = function (code, username) {
    const socket = this;
    console.log(games[code]);
    for (const player of games[code].players) {
        if (player.username === username){
            io.to(player.id).emit('end');
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