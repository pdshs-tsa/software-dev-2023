<script>
    import * as PIXI from 'pixi.js';
    import {onDestroy, onMount} from "svelte";
    import keyboard from '../keyboard';
    import {createEventDispatcher} from "svelte";
    import {socket} from "../../../socket/socket.js";
    import {goto} from "$app/navigation";

    const dispatch = createEventDispatcher();

    let view;
    let app;

    //how thick the walls are, 20 is a good number
    const wallThickness = 20;

    //containers
    let wallsContainer;
    let backgroundContainer;
    let questionContainer;
    let entityContainer;
    let scoreContainer;

    //sprites
    let hint;
    let player;

    //game state, normally play
    let state;

    //if the sprite can move
    let allowMovement = false;

    let currentCell = {
        x: 0,
        y: 0
    }
    let visitedCells = [];

    //score data
    let time;

    export let setData = {};
    let setIndex = 0;
    let questions = setData.data
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    //data for the current cell
    let celldata;

    //game code
    export let gameCode = 0;

    //socket events
    socket.on('maze:cell', (data) => {
       celldata = data;
       updateBackground();
    });

    socket.on('maze:tick', (players) => {
        if (entityContainer === undefined) return;
        players = JSON.parse(players);
        entityContainer.removeChildren();
        const visible = players.filter((p) => p.cx === currentCell.x && p.cy === currentCell.y && p.id !== socket.id);
        visible.forEach((p) => {
            let sprite = PIXI.Sprite.from('/maze/Cube.png');
            sprite.anchor.set(0.5);

            sprite.x = p.x;
            sprite.y = p.y;

            let nametag = new PIXI.Text(`${p.username}`, {
                fontFamily: 'Courier New',
                fontWeight: "bolder",
                fontSize: 15,
                fill: 0x000000,
                align: "left"
            });

            nametag.anchor.set(0.5);
            nametag.x = p.x;
            nametag.y = p.y - sprite.height;

            entityContainer.addChild(sprite);
            entityContainer.addChild(nametag);
        });
    });

    socket.on('ack:maze:answer', (s) => {
        scoreContainer.removeChildren();
        let score = new PIXI.Text(`Score: ${s}`, {
            fontFamily: 'Courier New',
            fontWeight: "bolder",
            fontSize: 20,
            fill: 0x000000,
            align: "left"
        });

        score.x = wallThickness * 2;
        score.y = app.screen.height - wallThickness * 2.5;
        scoreContainer.addChild(score);
    })

    //TODO: make checks for invalid game urls, this is an ok workaround
    socket.on('disconnect', () => {
        goto('/play');
    });

    onMount(async () => {
        app = await init();
        socket.emit('maze:cell', gameCode, currentCell);
    });

    onDestroy(() => {
        if (!(app instanceof PIXI.Application)) return;
        app.destroy(false, {
            children: true,
        });
        socket.disconnect();
    });

    async function init() {
        //init app/canvas
        let app = new PIXI.Application({view,
            width: 700,
            height: 700,
            antialias: true,
            backgroundColor: 0xffffff,
            resolution: window.devicePixelRatio,
        });

        PIXI.utils.clearTextureCache();
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.ROUND_PIXELS = false;
        PIXI.settings.RESOLUTION = 1;
        window.devicePixelRatio = 1;

        //load assets
        const playertexture = await PIXI.Assets.load('/maze/Cube.png');
        const hinttexture = await PIXI.Assets.load('/maze/hint.png');
        await PIXI.Assets.load('/maze/fullscreen.png');
        await PIXI.Assets.load('/maze/question-box.png');
        await PIXI.Assets.load('/maze/wall.png');

        //load backgrounds
        for (const i of ['/maze/background-1.png', "/maze/background-2.png", "/maze/background-3.png", "/maze/background-4.png"]){
            await PIXI.Assets.load(i);
        }

        //init containers
        wallsContainer = new PIXI.Container();
        backgroundContainer = new PIXI.Container();
        questionContainer = new PIXI.Container();
        entityContainer = new PIXI.Container();
        scoreContainer = new PIXI.Container();

        app.stage.addChild(backgroundContainer);
        app.stage.addChild(wallsContainer);

        //draw score
        let score = new PIXI.Text(`Score: 0`, {
            fontFamily: 'Courier New',
            fontWeight: "bolder",
            fontSize: 20,
            fill: 0x000000,
            align: "left"
        });

        score.x = wallThickness * 2;
        score.y = app.screen.height - wallThickness * 2.5;
        scoreContainer.addChild(score);
        app.stage.addChild(scoreContainer);

        //draw hint
        hint = PIXI.Sprite.from(hinttexture);
        hint.anchor.set(0.5);
        hint.visible = false;
        hint.x = app.screen.width / 2;
        hint.y = 100;
        app.stage.addChild(hint);

        //draw player
        player = PIXI.Sprite.from(playertexture);
        player.anchor.set(0.5);

        player.x = app.screen.width / 2;
        player.y = app.screen.height / 2;
        player.vx = 0;
        player.vy = 0;

        const left = keyboard("ArrowLeft"),
            right = keyboard("ArrowRight"),
            up = keyboard("ArrowUp"),
            down = keyboard("ArrowDown");

        const moveDistance = app.screen.width / 500

        left.press = () => {
            player.vx -= moveDistance;
        }
        left.release = () => {
            player.vx += moveDistance;
        }

        right.press = () => {
            player.vx += moveDistance;
        }
        right.release = () => {
            player.vx -= moveDistance;
        }

        up.press = () => {
            player.vy -= moveDistance;
        }
        up.release = () => {
            player.vy += moveDistance;
        }

        down.press = () => {
            player.vy += moveDistance;
        }
        down.release = () => {
            player.vy -= moveDistance;
        }

        app.stage.addChild(player);

        //draw entities
        app.stage.addChild(entityContainer);

        //draw questions
        app.stage.addChild(questionContainer);
        nextQuestion(app);

        //draw fullscreen
        let fullscreen = PIXI.Sprite.from('/maze/fullscreen.png');
        fullscreen.anchor.set(0.5);
        fullscreen.x = app.screen.width - wallThickness * 3;
        fullscreen.y = wallThickness * 3;
        fullscreen.interactive = true;
        fullscreen.buttonMode = true;
        fullscreen.on('pointerdown', () => {
            dispatch('fullscreen');
        });
        app.stage.addChild(fullscreen);

        //add updates
        state = play;
        app.ticker.add((delta) => state(delta));
        return app;
    }

    function play(delta) {
        if (allowMovement){
            player.x += player.vx;
            player.y += player.vy;
        }
        for (const child of wallsContainer.children){
            //this is scuffed
            const boundingBox = child.getBounds();
            if (playerTouchingSpecificWall(boundingBox.x, boundingBox.x + boundingBox.width, boundingBox.y, boundingBox.y + boundingBox.height)){
                player.x -= player.vx;
                player.y -= player.vy;
            }
        }
        if (player.y <= 10){
            currentCell.y -= 1;
            player.y = app.screen.height - 15;
            visitedCells.push(currentCell);
            socket.emit('maze:move', gameCode, currentCell)
            setTimeout(() => {
                nextQuestion(app);
                allowMovement = false;
            }, 500);
        }
        if (player.y >= app.screen.height - 10){
            currentCell.y += 1;
            player.y = 15;
            visitedCells.push(currentCell);
            socket.emit('maze:move', gameCode, currentCell)
            setTimeout(() => {
                nextQuestion(app);
                allowMovement = false;
            }, 500);
        }
        if (player.x <= 10){
            currentCell.x -= 1;
            player.x = app.screen.width - 15;
            visitedCells.push(currentCell);
            socket.emit('maze:move', gameCode, currentCell)
            setTimeout(() => {
                nextQuestion(app);
                allowMovement = false;
            }, 500);
        }
        if (player.x >= app.screen.width - 10){
            currentCell.x += 1;
            player.x = 15;
            visitedCells.push(currentCell);
            socket.emit('maze:move', gameCode, currentCell)
            setTimeout(() => {
                nextQuestion(app);
                allowMovement = false;
            }, 500);
        }

        socket.emit('maze:tick', gameCode, player.x, player.y);
    }

    function playerTouchingSpecificWall(leftBound, rightBound, upBound, downBound) {
        return (leftBound - player.width <= player.x && player.x - player.width/2 <= rightBound) && (upBound - player.height <= player.y && player.y <= downBound);
    }

    function updateBackground(){
        wallsContainer.removeChildren();
        backgroundContainer.removeChildren();
        
        const bkgSprite = PIXI.Sprite.from(`/maze/background-${celldata.background}.png`);
        bkgSprite.x = 0;
        bkgSprite.y = 0;
        bkgSprite.width = app.screen.width;
        bkgSprite.height = app.screen.height;

        backgroundContainer.addChild(bkgSprite);

        //draw walls
        for (const prop in celldata.walls) {
            if (celldata.walls[prop]){
                if (prop === 'left') {
                    let wall = PIXI.Sprite.from('/maze/wall.png');
                    wall.width = wallThickness;
                    wall.height = app.screen.height;
                    wallsContainer.addChild(wall);
                    continue;
                }
                if (prop === 'right') {
                    let wall = PIXI.Sprite.from('/maze/wall.png');
                    wall.width = wallThickness;
                    wall.height = app.screen.height;
                    wall.x = app.screen.width - wallThickness;
                    wallsContainer.addChild(wall);
                    continue;
                }
                if (prop === 'up') {
                    let wall = PIXI.Sprite.from('/maze/wall.png');
                    wall.anchor.set(0.5);
                    wall.width = wallThickness;
                    wall.height = app.screen.height;
                    wall.angle = 90;
                    wall.x = app.screen.width / 2;
                    wall.y = wallThickness / 2;
                    wallsContainer.addChild(wall);
                    continue;
                }
                if (prop === 'down') {
                    let wall = PIXI.Sprite.from('/maze/wall.png');
                    wall.anchor.set(0.5);
                    wall.width = wallThickness;
                    wall.height = app.screen.height;
                    wall.angle = 90;
                    wall.x = app.screen.width / 2;
                    wall.y = app.screen.height - wallThickness / 2;
                    wallsContainer.addChild(wall);
                }
            }
        }

        hideHint();
    }

    function nextQuestion(app) {
        if (visitedCells.includes(currentCell)) return;
        questionContainer.removeChildren();
        questionContainer.visible = false;
        let box = PIXI.Sprite.from('/maze/question-box.png');
        box.anchor.set(0.5);
        box.x = app.screen.width / 2;
        box.y = app.screen.height / 2;
        box.height = app.screen.height * 0.45;
        box.width = app.screen.width * 0.9;

        const questionText = new PIXI.Text(questions[setIndex].prompt, {
            fontFamily: 'Courier New',
            fontWeight: "bolder",
            fontSize: 18,
            fill: 0x000000,
            align: "left",
        });

        questionText.anchor.set(0.5);
        questionText.x = box.x;
        questionText.y = box.y - box.height / 4;

        questionContainer.addChild(box);
        questionContainer.addChild(questionText);

        let answers = questions[setIndex].answers
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        let positions = [{x: box.x - box.width / 4, y: box.y},
            {x: box.x + box.width / 4, y: box.y},
            {x: box.x - box.width / 4, y: box.y + box.height / 4},
            {x: box.x + box.width / 4, y: box.y + box.height / 4    }]

        for (let i = 0; i < answers.length; i++){
            const answer = new PIXI.Text(`${answers[i]}`, {
                fontFamily: 'Courier New',
                fontWeight: "bolder",
                fontSize: 18,
                fill: 0x000000,
                align: "left"
            });

            answer.anchor.set(0.5);
            answer.x = positions[i].x;
            answer.y = positions[i].y;
            answer.buttonMode = true;
            answer.interactive = true;
            answer.on('pointerdown', () => {handleAnswer(answers[i])});
            questionContainer.addChild(answer);
        }
        questionContainer.visible = true;
        time = Date.now();
    }

    function handleAnswer(selected) {
        time = Date.now() - time;
        let correct = questions[setIndex].correct;
        let toast;
        if (correct === selected){
            toast = new PIXI.Text('Correct!', {
                fontFamily: 'Courier New',
                fontWeight: "bolder",
                fontSize: 20,
                fill: 0x000000,
                align: "left"
            });
            socket.emit('maze:answer', gameCode, true, time);
            allowMovement = true;

            setTimeout(() => {
                toast.destroy();
            }, 2500);
        } else {
            toast = new PIXI.Text(`Incorrect, the answer is "${correct}"`, {
                fontFamily: 'Courier New',
                fontWeight: "bolder",
                fontSize: 20,
                fill: 0x000000,
                align: "left"
            });

            setTimeout(() => {
                toast.destroy();
                allowMovement = true;
            }, 2500);
        }
        toast.anchor.set(0.5);
        toast.x = hint.x;
        toast.y = hint.y * 2;

        setIndex++;
        if (setIndex >= questions.length){
            questions = setData.data
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
            setIndex = 0;
        }

        questionContainer.visible = false;
        app.stage.addChild(toast);
    }

    function hideHint() {
        hint.visible = false;
    }

    //TODO: replace this with an 'explored' map
    /*function showHint() {
        const solution = maze.generateSolution({
            row: currentCell.y,
            column: currentCell.x
        }, {
            row: maze.cells.length - 1,
            column: maze.cells[0].length - 1
        });

        const best = solution.toJSON()[1];
        if (best.column > currentCell.x){
            hint.angle = 0;
        }
        if (best.column < currentCell.x){
            hint.angle = 180;
        }
        if (best.row < currentCell.y){
            hint.angle = 270;
        }
        if (best.row > currentCell.y){
            hint.angle = 90;
        }
        hint.visible = true;
    }*/

</script>

<div style="display: flex; justify-content: center; align-items: center; height: 100%">
    <canvas bind:this={view}></canvas>
</div>

<svelte:window></svelte:window>

<style>
    canvas {
        margin: 0 auto;
    }
</style>
