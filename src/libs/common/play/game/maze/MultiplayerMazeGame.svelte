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

    //ticker for sending positional data
    let moveTick;

    //containers
    let wallsContainer;
    let backgroundContainer;
    let questionContainer;
    let entityContainer;
    let scoreContainer;
    let mapContainer;
    let poiContainer;
    let poiAlertContainer;

    //if should show map
    let mapVisible = false;

    //sprites
    let player;

    //game state, normally play
    let state;

    //if the sprite can move
    let allowMovement = false;

    let currentCell = {
        x: 1,
        y: 1
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

    let selectedPOI = {};
    let poiQuestion = false;

    //data for the current cell
    let celldata;

    //game code
    export let gameCode = 0;

    //socket events
    socket.on('maze:cell', (data) => {
        celldata = data;
        updateBackground();
        if (mapVisible){
            hideMap();
            showMap();
        }
        setTimeout(() => {
            if (!(visitedCells.length === 0)) nextQuestion(app);
            if (!visitedCells.some((element) => data.x === element.x && data.y === element.y)) visitedCells.push(data);
        }, 500);
    });

    //TODO: make a time based tick system, to avoid laggy player frame rates
    socket.on('maze:tick', (player) => {
        if (entityContainer === undefined) return;
        player = JSON.parse(player);
        if (player.cx !== currentCell.x || player.cy !== currentCell.y || player.id === socket.id) {
            let index = entityContainer.children.findIndex((p) => p.name === player.id);
            if (index !== -1) {
                entityContainer.removeChildAt(index);
            }
            index = entityContainer.children.findIndex((p) => p.name === player.id + 'tag');
            if (index !== -1) {
                entityContainer.removeChildAt(index);
            }

            return;
        }

        let index = entityContainer.children.findIndex((p) => p.name === player.id);
        if (index !== -1) {
            entityContainer.removeChildAt(index);
        }
        index = entityContainer.children.findIndex((p) => p.name === player.id + 'tag');
        if (index !== -1) {
            entityContainer.removeChildAt(index);
        }

        let sprite = PIXI.Sprite.from('/maze/entity.png');
        sprite.anchor.set(0.5);

        sprite.name = player.id;
        sprite.x = player.oldx;
        sprite.y = player.oldy;
        sprite.angle = player.angle;

        if (player.scale < 0){
            sprite.scale.x *= -1;
        }

        let nametag = new PIXI.Text(`${player.username}`, {
            fontFamily: 'Courier New',
            fontWeight: "bolder",
            fontSize: 15,
            fill: 0x000000,
            align: "left"
        });

        nametag.name = player.id + 'tag';
        nametag.anchor.set(0.5);
        nametag.x = sprite.x;
        nametag.y = sprite.y - sprite.height * 0.65;

        entityContainer.addChild(nametag);
        entityContainer.addChild(sprite);

        //calculate movement
        const xdist = player.newx - player.oldx;
        const ydist = player.newy - player.oldy;
        const framesNeeded = Math.ceil((player.movetimestamp - player.cachedmovetimestamp) / 16.7);
        const xperframe = xdist / framesNeeded;
        const yperframe = ydist / framesNeeded;
        let iterations = 0;
        let interval = setInterval(async () => {
            if (iterations >= framesNeeded || !socket.connected) clearInterval(interval);
            sprite.x += xperframe;
            sprite.y += yperframe;

            nametag.x += xperframe;
            nametag.y += yperframe;

            iterations++;
        }, 16.7)
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
        clearInterval(moveTick);
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
        PIXI.settings.RESOLUTION = 3;
        window.devicePixelRatio = 3;



        //load assets
        const playertexture = await PIXI.Assets.load('/maze/player.png');
        await PIXI.Assets.load('/maze/fullscreen.png');
        await PIXI.Assets.load('/maze/question-box.png');
        await PIXI.Assets.load('/maze/wall.png');
        await PIXI.Assets.load('/maze/entity.png');

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
        mapContainer = new PIXI.Container();
        poiContainer = new PIXI.Container();
        poiAlertContainer = new PIXI.Container();

        app.stage.addChild(backgroundContainer);
        app.stage.addChild(wallsContainer);
        app.stage.addChild(poiContainer);


        //draw player
        player = PIXI.Sprite.from(playertexture);
        player.anchor.set(0.5);

        player.x = app.screen.width / 2;
        player.y = app.screen.height / 2;
        player.vx = 0;
        player.vy = 0;
        player.angle = 0;

        const left = keyboard("ArrowLeft"),
            right = keyboard("ArrowRight"),
            up = keyboard("ArrowUp"),
            down = keyboard("ArrowDown");

        const moveDistance = app.screen.width / 250;

        //angles is ugly but whatever
        left.press = () => {
            player.angle = 0;
            if (player.scale.x < 0) {
                player.scale.x *= -1;
            }
            player.vx -= moveDistance;
        }
        left.release = () => {
            if (up.isDown){
                if (player.scale.x < 0){
                    player.angle = 270;
                } else {
                    player.angle = 90;
                }
            }
            if (down.isDown){
                if (player.scale.x > 0){
                    player.angle = 270;
                } else {
                    player.angle = 90;
                }
            }
            player.vx += moveDistance;
        }

        right.press = () => {
            player.angle = 0;
            if (player.scale.x > 0) {
                player.scale.x *= -1;
            }
            player.vx += moveDistance;
        }
        right.release = () => {
            if (up.isDown){
                if (player.scale.x < 0){
                    player.angle = 270;
                } else {
                    player.angle = 90;
                }
            }
            if (down.isDown){
                if (player.scale.x > 0){
                    player.angle = 270;
                } else {
                    player.angle = 90;
                }
            }
            player.vx -= moveDistance;
        }

        up.press = () => {
            if (player.scale.x < 0){
                player.angle = 270;
            } else {
                player.angle = 90;
            }
            player.vy -= moveDistance;
        }
        up.release = () => {
            if (down.isDown){
                if (player.scale.x > 0){
                    player.angle = 270;
                } else {
                    player.angle = 90;
                }
            }
            if (right.isDown || left.isDown) player.angle = 0;
            player.vy += moveDistance;
        }

        down.press = () => {
            if (player.scale.x > 0){
                player.angle = 270;
            } else {
                player.angle = 90;
            }
            player.vy += moveDistance;
        }
        down.release = () => {
            if (up.isDown){
                if (player.scale.x < 0){
                    player.angle = 270;
                } else {
                    player.angle = 90;
                }
            }
            if (right.isDown || left.isDown) player.angle = 0;
            player.vy -= moveDistance;
        }

        app.stage.addChild(player);

        //draw entities
        app.stage.addChild(entityContainer);

        //draw poi toast
        let poiAlert = new PIXI.Text("Press enter to interact", {
            fontFamily: 'Courier New',
            fontWeight: "bolder",
            fontSize: 20,
            fill: 0x000000,
            align: "center"
        });

        poiAlert.x = app.screen.width / 2;
        poiAlert.y = app.screen.height * 0.9 - wallThickness;
        poiAlert.anchor.set(0.5);

        poiAlertContainer.addChild(poiAlert);
        app.stage.addChild(poiAlertContainer);
        poiAlertContainer.visible = false;

        //draw map
        app.stage.addChild(mapContainer);

        const map = keyboard('m');

        map.press = () => {
            mapVisible = true;
            showMap();
        }

        map.release = () => {
            mapVisible = false;
            hideMap();
        }

        //interact with poi
        const poiInteract = keyboard('Enter');

        poiInteract.press = () => {
            if (selectedPOI.x && selectedPOI.y && allowMovement){
                poiQuestion = true;
                nextQuestion(app);
            }
        }

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

        //add updates
        state = play;
        app.ticker.maxFPS = 60;
        app.ticker.add((delta) => state(delta));

        moveTick = setInterval(() => {
            socket.emit('maze:tick', gameCode, {
                x: player.x,
                y: player.y,
                angle: player.angle,
                scale: player.scale.x
            });
        }, 250);
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
            if (playerTouchingSpecificWall(boundingBox.x + wallThickness, boundingBox.x + boundingBox.width, boundingBox.y + wallThickness, boundingBox.y + boundingBox.height * 2.2)){
                player.x -= player.vx;
                player.y -= player.vy;
            }
        }
        let touchingPOI = false;
        for (const child of poiContainer.children){
            const boundingBox = child.getBounds();
            if (playerTouchingSpecificWall(boundingBox.x, boundingBox.x + boundingBox.width, boundingBox.y + wallThickness, boundingBox.y + boundingBox.height * 2.2)){
                touchingPOI = true;
                //this could break but it shouldnt
                selectedPOI = {
                    x: child.x,
                    y: child.y
                }
            }
        }
        poiAlertContainer.visible = touchingPOI;
        if (!touchingPOI) selectedPOI = {};
        if (player.y <= 10){
            currentCell.y -= 1;
            player.y = app.screen.height - 15;
            if (player.x <= wallThickness * 2) {
                player.x += wallThickness * 2;
            }
            if (player.x >= app.screen.width - wallThickness * 2) {
                player.x -= wallThickness * 2;
            }
            socket.emit('maze:move', gameCode, currentCell)
        }
        if (player.y >= app.screen.height - 10){
            currentCell.y += 1;
            player.y = 15;
            if (player.x <= wallThickness * 2) {
                player.x += wallThickness * 2;
            }
            if (player.x >= app.screen.width - wallThickness * 2) {
                player.x -= wallThickness * 2;
            }
            socket.emit('maze:move', gameCode, currentCell)
        }
        if (player.x <= 10){
            currentCell.x -= 1;
            player.x = app.screen.width - 15;
            if (player.y <= wallThickness * 2) {
                player.y += wallThickness * 2;
            }
            if (player.y >= app.screen.height - wallThickness * 2) {
                player.y -= wallThickness * 2;
            }
            socket.emit('maze:move', gameCode, currentCell)
        }
        if (player.x >= app.screen.width - 10){
            currentCell.x += 1;
            player.x = 15;
            if (player.y <= wallThickness * 2) {
                player.y += wallThickness * 2;
            }
            if (player.y >= app.screen.height - wallThickness * 2) {
                player.y -= wallThickness * 2;
            }
            socket.emit('maze:move', gameCode, currentCell)
        }
    }

    function playerTouchingSpecificWall(leftBound, rightBound, upBound, downBound) {
        return (leftBound - player.width <= player.x && player.x - player.width/2 <= rightBound) && (upBound - player.height <= player.y && player.y <= downBound);
    }

    function updateBackground(){
        wallsContainer.removeChildren();
        backgroundContainer.removeChildren();
        poiContainer.removeChildren();
        
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

        //draw poi
        for (const poi of celldata.poi) {
            const sprite = PIXI.Sprite.from('/maze/poi/' + poi.path);
            sprite.anchor.set(0.5);
            sprite.x = 50 * poi.x;
            sprite.y = 50 * poi.y;
            poiContainer.addChild(sprite);
        }
    }

    function nextQuestion(app) {
        //prevent farming points
        if (!poiQuestion && visitedCells.some((element) => element.x === currentCell.x && element.y === currentCell.y)) return;

        questionContainer.removeChildren();
        questionContainer.visible = false;
        allowMovement = false;
        let box = PIXI.Sprite.from('/maze/question-box.png');
        box.anchor.set(0.5);
        box.x = app.screen.width / 2;
        box.y = app.screen.height / 2;
        box.height = app.screen.height * 0.6;
        box.width = app.screen.width * 0.9;

        const questionText = new PIXI.Text(questions[setIndex].prompt, {
            fontFamily: 'Courier New',
            fontWeight: "bolder",
            fontSize: 17,
            fill: 0x000000,
            align: "left",
            wordWrap: true,
            wordWrapWidth: box.width - 40
        });

        questionText.anchor.set(0.5);
        questionText.x = box.x;
        questionText.y = box.y - box.height / 3;

        questionContainer.addChild(box);
        questionContainer.addChild(questionText);

        let answers = questions[setIndex].answers
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        let positions = [{x: box.x - box.width / 4, y: box.y * 1.25},
            {x: box.x + box.width / 4, y: box.y * 1.25},
            {x: box.x - box.width / 4, y: box.y * 0.9},
            {x: box.x + box.width / 4, y: box.y * 0.9}]

        for (let i = 0; i < answers.length; i++){
            const answer = new PIXI.Text(`${answers[i]}`, {
                fontFamily: 'Courier New',
                fontWeight: "bolder",
                fontSize: 14,
                fill: 0x000000,
                align: "left",
                wordWrap: true,
                wordWrapWidth: (box.width / 2) - 40
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
            if (poiQuestion && selectedPOI !== {}) {
                const poi = celldata.poi.find((e) => e.x === selectedPOI.x / 50 && e.y === selectedPOI.y / 50);
                socket.emit('maze:poi', gameCode, currentCell, poi);
                poiQuestion = false;
            } else {
                socket.emit('maze:answer', gameCode, true, time)
            }
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
                align: "left",
                wordWrap: true,
                wordWrapWidth: app.screen.width - 20
            });

            setTimeout(() => {
                toast.destroy();
                allowMovement = true;
            }, 2500);
        }
        toast.anchor.set(0.5);
        toast.x = app.screen.width / 2;
        toast.y = wallThickness * 3;

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

    function showMap() {
        mapContainer.removeChildren();
        let rect = new PIXI.Graphics()
            .beginFill(0x808080)
            .drawRect(app.screen.width / 2 - 150, app.screen.width / 2 - 150, 300, 300)
            .endFill();
        mapContainer.addChild(rect);
        for (const cell of visitedCells){
            if (cell.x === currentCell.x && cell.y === currentCell.y) {
                let c = new PIXI.Graphics()
                    .beginFill(0xFFAC1C)
                    .drawRect(app.screen.width / 2 - 150 + (cell.x * 15), app.screen.width / 2 - 150 + (cell.y * 15), 15, 15)
                    .endFill();
                mapContainer.addChild(c);
            } else {
                let c = new PIXI.Graphics()
                    .beginFill(0xFFFFFF)
                    .drawRect(app.screen.width / 2 - 150 + (cell.x * 15), app.screen.width / 2 - 150 + (cell.y * 15), 15, 15)
                    .endFill();
                mapContainer.addChild(c);
            }
            for (const wall in cell.walls) {
                if (cell.walls[wall]) {
                    if (wall === 'left') {
                        let w = new PIXI.Graphics()
                            .beginFill(0x000000)
                            .drawRect(app.screen.width / 2 - 150 + ((cell.x - 1) * 15), app.screen.width / 2 - 150 + (cell.y * 15), 15, 15)
                            .endFill();
                        mapContainer.addChild(w);
                        continue;
                    }
                    if (wall === 'right') {
                        let w = new PIXI.Graphics()
                            .beginFill(0x000000)
                            .drawRect(app.screen.width / 2 - 150 + ((cell.x + 1) * 15), app.screen.width / 2 - 150 + (cell.y * 15), 15, 15)
                            .endFill();
                        mapContainer.addChild(w);
                        continue;
                    }
                    if (wall === 'up') {
                        let w = new PIXI.Graphics()
                            .beginFill(0x000000)
                            .drawRect(app.screen.width / 2 - 150 + (cell.x * 15), app.screen.width / 2 - 150 + ((cell.y - 1) * 15), 15, 15)
                            .endFill();
                        mapContainer.addChild(w);
                        continue;
                    }
                    if (wall === 'down') {
                        let w = new PIXI.Graphics()
                            .beginFill(0x000000)
                            .drawRect(app.screen.width / 2 - 150 + (cell.x * 15), app.screen.width / 2 - 150 + ((cell.y + 1) * 15), 15, 15)
                            .endFill();
                        mapContainer.addChild(w);
                    }
                }
            }
        }
        mapContainer.visible = true;
    }

    function hideMap() {
        mapContainer.visible = false;
    }

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
