import database from "../../database.js";
import {create_maze} from "./lib/create-maze.js";

let io;
const games = {};

/*
    IMPORTANT THINGS TO REMEMBER:
    player-answer will always be emitted to the room regardless of game mode. This consists of the username and the score
 */

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
        players: [],
        answers: [],
        started: false,
        mode: ''
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
        socket.emit('ack:join', "This game does not exist.");
        return;
    }

    //username checks
    username = username.trim();
    if (username.length > 16) username = username.substring(0, 17);
    for (const p of games[code].players){
        if (p.username === username){
            socket.emit('ack:join', "This username is taken.");
            return;
        }
    }

    //if game already started
    if (games[code].started){
        socket.emit('ack:join', 'This game already started.');
        return;
    }

    //register player obj
    games[code].players.push({
        id: socket.id,
        username: username
    });

    //emit join events
    socket.emit('ack:join', games[code]);
    io.to(games[code].code).emit('player-join', username);
    socket.join(games[code].code);
};

const destroyGame = function (code) {
    const socket = this;
    io.to(code).emit('end', code);
    games[code].players.forEach((element) => {
       io.sockets.sockets.get(element.id).leave(code);
    });
    //clear game loop
    if (games[code].tick){
        clearInterval(games[code].tick);
    }
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
        if (player.score !== 0) return;
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

const gameStart = async function (code, mode) {
    games[code].mode = mode;
    io.to(code).emit('game-start', mode);
    if (mode === 'maze') {
        //put maze first to "prevent" race conditions
        games[code].maze = create_maze(20, 20);
        games[code].players.forEach((p) => {
            //this is cell position
            p.cx = 1;
            p.cy = 1;

            //this is viewport position
            p.x = 0;
            p.y = 0;
        });

        games[code].maze[1][1].background = Math.floor(Math.random() * 3) + 1;

        games[code].tick = setInterval(() => {
            io.to(code).emit('maze:tick', JSON.stringify(games[code].players));
        }, 20);
    }

    games[code].started = true;
}

const classicPlayerAnswer = function (code, correct, time) {
    const socket = this;
    let username = games[code].players.find((element) => element.id === socket.id).username
    if (!(socket.id in games[code].answers)) {
        games[code].answers[socket.id] = {
            id: socket.id,
            username: username,
            score: 0
        };
    }
    if (correct){
        let points;
        if (time < 800){
            points = 1000;
        } else {
            points = Math.ceil(1000 * (Math.pow(1.02, -1 * time / 1000)));
        }

        games[code].answers[socket.id].score += points;
    }

    io.to(games[code].code).emit('answer', username, games[code].answers[socket.id].score);
}

const fetchCellData = function(code, obj) {
    const socket = this;
    mazeSendCellData(socket, code, obj);
}

const mazeMove = function (code, obj){
    const socket = this;
    if (games[code] === undefined) return;
    let player = games[code].players.find((element) => element.id === socket.id);
    let index = games[code].players.indexOf(player);
    player.cx = obj.x;
    player.cy = obj.y;
    games[code].players[index] = player;
    mazeSendCellData(socket, code, obj);
}

const mazeSendCellData = function (socket, code, obj) {
    if (games[code] === undefined) return;

    if (!('background' in games[code].maze[obj.y][obj.x])){
        games[code].maze[obj.y][obj.x].background =  Math.floor(Math.random() * 3) + 1;
    }
    if (!('walls' in games[code].maze[obj.y][obj.x])){
        let walls = {};
        if (games[code].maze[obj.y][obj.x - 1].filled === true) {
            walls.left = true;
        }
        if (games[code].maze[obj.y][obj.x + 1].filled === true) {
            walls.right = true;
        }
        if (games[code].maze[obj.y - 1][obj.x].filled === true) {
            walls.up = true;
        }
        if (games[code].maze[obj.y + 1][obj.x].filled === true) {
            walls.down = true;
        }
        games[code].maze[obj.y][obj.x].walls = walls;
    }
    games[code].maze[obj.y][obj.x].x = obj.x;
    games[code].maze[obj.y][obj.x].y = obj.y;
    socket.emit('maze:cell', {
        walls: games[code].maze[obj.y][obj.x].walls,
        background: games[code].maze[obj.y][obj.x].background,
        x: obj.x,
        y: obj.y
    });
}

const mazeTick = function(code, x, y){
    const socket = this;
    if (games[code] === undefined) return;
    const player = games[code].players.find((element) => element.id === socket.id);
    player.x = x;
    player.y = y;
}

const mazePlayerAnswer = function (code, correct, time) {
    const socket = this;
    let username = games[code].players.find((element) => element.id === socket.id).username
    if (!(socket.id in games[code].answers)) {
        games[code].answers[socket.id] = {
            id: socket.id,
            username: username,
            score: 0
        };
    }
    if (correct){
        let points;
        if (time < 800){
            points = 1000;
        } else {
            points = Math.ceil(1000 * (Math.pow(1.02, -1 * time / 1000)));
        }

        games[code].answers[socket.id].score += points;
    }

    socket.emit('ack:maze:answer', games[code].answers[socket.id].score);
    io.to(games[code].code).emit('answer', username, games[code].answers[socket.id].score);
}

export {
    init,
    registerPlayer,
    attemptGameJoin,
    createGame,
    clientDisconnect,
    kickPlayer,
    classicPlayerAnswer,
    gameStart,
    fetchCellData,
    mazeTick,
    mazeMove,
    mazePlayerAnswer
}