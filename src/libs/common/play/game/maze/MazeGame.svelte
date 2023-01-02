<script>
    import * as PIXI from 'pixi.js';
    import {onDestroy, onMount} from "svelte";
    import Generator from 'maze-generation/src/Generator';
    import Prando from 'prando';
    import keyboard from '../keyboard';
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    let view;
    let app;
    let maze;

    //how thick the walls are, 20 is a good number
    const wallThickness = 20;

    //containers
    let wallsContainer;
    let backgroundContainer;
    let questionContainer;

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

    //score data
    let score;
    let scoreInt = 0;

    //background store
    let backgroundMap = new Map();
    let backgrounds = [];
    
    //random number
    const prando = new Prando();

    export let setData = {};
    let setIndex = 0;
    let questions = setData.data
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    onMount(async () => {
        maze = generateMaze(15, 15);
        app = await init();
        updateBackground();
    });

    onDestroy(() => {
        if (!(app instanceof PIXI.Application)) return;
        app.destroy(false, {
            children: true,
        })
    })

    async function init() {
        //init app/canvas
        let app = new PIXI.Application({view,
            width: window.innerHeight * 0.9,
            height: window.innerHeight * 0.9,
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

        //load backgrounds
        for (const i of ['/maze/background-1.png', "/maze/background-2.png", "/maze/background-3.png", "/maze/background-4.png"]){
            backgrounds.push(await PIXI.Assets.load(i));
        }

        //init containers
        wallsContainer = new PIXI.Container();
        backgroundContainer = new PIXI.Container();
        questionContainer = new PIXI.Container();

        app.stage.addChild(backgroundContainer);
        app.stage.addChild(wallsContainer);

        //draw score
        score = new PIXI.Text(`Score: ${scoreInt}`, {
            fontFamily: 'Courier New',
            fontWeight: "bolder",
            fontSize: 20,
            fill: 0x000000,
            align: "left"
        });

        score.x = wallThickness * 2;
        score.y = app.screen.height - wallThickness * 2.5;
        app.stage.addChild(score);

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
            updateBackground();
            setTimeout(() => {
                nextQuestion(app);
                allowMovement = false;
            }, 500);
        }
        if (player.y >= app.screen.height - 10){
            currentCell.y += 1;
            player.y = 15;
            updateBackground();
            setTimeout(() => {
                nextQuestion(app);
                allowMovement = false;
            }, 500);
        }
        if (player.x <= 10){
            currentCell.x -= 1;
            player.x = app.screen.width - 15;
            updateBackground();
            setTimeout(() => {
                nextQuestion(app);
                allowMovement = false;
            }, 500);
        }
        if (player.x >= app.screen.width - 10){
            currentCell.x += 1;
            player.x = 15;
            updateBackground();
            setTimeout(() => {
                nextQuestion(app);
                allowMovement = false;
            }, 500);
        }
    }

    function playerTouchingSpecificWall(leftBound, rightBound, upBound, downBound) {
        return (leftBound - player.width <= player.x && player.x - player.width/2 <= rightBound) && (upBound - player.height <= player.y && player.y <= downBound);
    }

    function generateMaze(width, height) {
        const generator = new Generator(width, height);
        const maze = generator.generateMaze('DEPTHFIRST', prando);

        for (let i = 0; i < prando.nextInt(width, width * 2); i++){
            //prevent it from going over width/height
            const x = prando.nextInt(1, width - 2);
            const y = prando.nextInt(1, height - 2);
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

    function updateBackground(){
        wallsContainer.removeChildren();
        backgroundContainer.removeChildren();
        const cell = maze.cells[currentCell.y][currentCell.x];
        
        //load background (preventing undefined)
        if (!backgroundMap.has(`${currentCell.x}:${currentCell.y}`)){
            let texture = undefined;
            do {
                texture = backgrounds.at(prando.nextInt(0, backgrounds.length))
            } while (texture === undefined)
            backgroundMap.set(`${currentCell.x}:${currentCell.y}`, texture);
        }
        
        const bkgSprite = PIXI.Sprite.from(backgroundMap.get(`${currentCell.x}:${currentCell.y}`));
        bkgSprite.x = 0;
        bkgSprite.y = 0;
        bkgSprite.width = app.screen.width;
        bkgSprite.height = app.screen.height;

        backgroundContainer.addChild(bkgSprite);

        //draw walls
        for (const prop in cell.walls) {
            if (cell.walls[prop]){
                if (prop === 'left') {
                    let wall = new PIXI.Graphics()
                        .beginFill(0x000000)
                        .drawRect(0, 0, wallThickness, app.screen.height)
                        .endFill();
                    wallsContainer.addChild(wall);
                    continue;
                }
                if (prop === 'right') {
                    let wall = new PIXI.Graphics()
                        .beginFill(0x000000)
                        .drawRect(app.screen.width - wallThickness, 0, wallThickness, app.screen.height)
                        .endFill();
                    wallsContainer.addChild(wall);
                    continue;
                }
                if (prop === 'up') {
                    let wall = new PIXI.Graphics()
                        .beginFill(0x000000)
                        .drawRect(0, 0, app.screen.width, wallThickness)
                        .endFill();
                    wallsContainer.addChild(wall);
                    continue;
                }
                if (prop === 'down') {
                    let wall = new PIXI.Graphics()
                        .beginFill(0x000000)
                        .drawRect(0, app.screen.height - wallThickness, app.screen.width, wallThickness)
                        .endFill();
                    wallsContainer.addChild(wall);
                }
            }
        }

        hideHint();

        //check if win
        if (player.y === maze.cells.length - 1 && player.x === maze.cells[0].length - 1){
            dispatch('end');
        }
    }

    function nextQuestion(app) {
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
    }

    function handleAnswer(selected) {
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
            score += 1000;
            showHint();
        } else {
            toast = new PIXI.Text(`Incorrect, the answer is "${correct}"`, {
                fontFamily: 'Courier New',
                fontWeight: "bolder",
                fontSize: 20,
                fill: 0x000000,
                align: "left"
            });
        }
        toast.anchor.set(0.5);
        toast.x = hint.x;
        toast.y = hint.y * 2;
        setTimeout(() => {
            toast.destroy();
        }, 2500);

        setIndex++;
        if (setIndex > questions.length){
            setData = 0;
        }

        allowMovement = true;
        questionContainer.visible = false;
        app.stage.addChild(toast);
    }

    function hideHint() {
        hint.visible = false;
    }

    export function showHint() {
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
    }

    export function setMovement(boolean){
        allowMovement = boolean;
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
