import database from "../../database.js";
import Generator from "maze-generation/src/Generator.js";
import Prando from "prando";

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
    console.log('called');
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
        if (player.score !== 0 && games[code].maze != null) return;
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
        games[code].maze = generateMaze(15, 15);
        games[code].players.forEach((p) => {
            //this is cell position
            p.cx = 0;
            p.cy = 0;

            //this is viewport position
            p.x = 0;
            p.y = 0;
        });

        games[code].mazemeta = new Map();

        games[code].mazemeta.set(`0 0`, {
            background: Math.floor(Math.random() * 3) + 1
        });

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
    if (!games[code].mazemeta.has(`${obj.x} ${obj.y}`)){
        games[code].mazemeta.set(`${obj.x} ${obj.y}`, {
            background: Math.floor(Math.random() * 3) + 1
        });
    }
    socket.emit('maze:cell', {
        walls: games[code].maze.cells[obj.y][obj.x].walls,
        background: games[code].mazemeta.get('0 0').background
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

const generateMaze = function (width, height) {
    const generator = new Generator(width, height);
    const p = new Prando();
    const maze = generator.generateMaze('DEPTHFIRST', p);

    for (let i = 0; i < p.nextInt(width, width * 2); i++){
        //prevent it from going over width/height
        const x = p.nextInt(1, width - 2);
        const y = p.nextInt(1, height - 2);
        if (maze.getWallStatus(x, y, 'up')){
            maze.removeWall(x, y, 'up');
        }
        if (maze.getWallStatus(x, y, 'down')){
            maze.removeWall(x, y, 'down');
        }
        if (maze.getWallStatus(x, y, 'left')){
            maze.removeWall(x, y, 'left');
        }
        if (maze.getWallStatus(x, y, 'right')){
            maze.removeWall(x, y, 'right');
        }
    }
    return maze;
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