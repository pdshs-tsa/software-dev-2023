<script>
    import * as PIXI from 'pixi.js';
    import {onMount} from "svelte";
    import Generator from 'maze-generation/src/Generator';
    import Prando from 'prando';
    import keyboard from '../keyboard';
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    let view;
    let app;
    let maze;

    const wallThickness = 20;

    //containers
    let background;

    //sprites
    let hint;
    let player;

    //game state, normally play
    let state;

    let allowMovement = false;

    let currentCell = {
        x: 0,
        y: 0
    }

    onMount(async () => {
        maze = generateMaze(15, 15);
        app = await init();
        updateWalls();
    });

    async function init() {
        //init app/canvas
        let app = new PIXI.Application({view,
            width: window.innerHeight * 0.8,
            height: window.innerHeight * 0.8,
            antialias: true,
            backgroundColor: 0xffffff
        });

        //load assets
        const playertexture = await PIXI.Assets.load('/maze/Cube.png');
        const hinttexture = await PIXI.Assets.load('/maze/hint.png');

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

        //draw hint
        hint = PIXI.Sprite.from(hinttexture);
        hint.anchor.set(0.5);
        hint.visible = false;
        hint.x = app.screen.width / 2;
        hint.y = 100;
        app.stage.addChild(hint);

        //init containers
        background = new PIXI.Container();

        app.stage.addChild(background);
        state = play;
        app.ticker.add((delta) => state(delta));
        return app;
    }

    function play(delta) {
        if (allowMovement){
            player.x += player.vx;
            player.y += player.vy;
        }
        for (const child of background.children){
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
            updateWalls();
            dispatch('cellchange');
        }
        if (player.y >= app.screen.height - 10){
            currentCell.y += 1;
            player.y = 15;
            updateWalls();
            dispatch('cellchange');
        }
        if (player.x <= 10){
            currentCell.x -= 1;
            player.x = app.screen.width - 15;
            updateWalls();
            dispatch('cellchange');
        }
        if (player.x >= app.screen.width - 10){
            currentCell.x += 1;
            player.x = 15;
            updateWalls();
            dispatch('cellchange');
        }
    }

    function playerTouchingSpecificWall(leftBound, rightBound, upBound, downBound) {
        return (leftBound - player.width <= player.x && player.x - player.width/2 <= rightBound) && (upBound - player.height <= player.y && player.y <= downBound);
    }

    function generateMaze(width, height) {
        const generator = new Generator(width, height);
        const prando = new Prando();
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
        console.log(maze.toString())
        return maze;
    }

    function updateWalls(){
        background.removeChildren();
        const cell = maze.cells[currentCell.y][currentCell.x];

        for (const prop in cell.walls) {
            if (cell.walls[prop]){
                if (prop === 'left') {
                    let wall = new PIXI.Graphics()
                        .beginFill(0x000000)
                        .drawRect(0, 0, wallThickness, app.screen.height)
                        .endFill();
                    background.addChild(wall);
                    continue;
                }
                if (prop === 'right') {
                    let wall = new PIXI.Graphics()
                        .beginFill(0x000000)
                        .drawRect(app.screen.width - wallThickness, 0, wallThickness, app.screen.height)
                        .endFill();
                    background.addChild(wall);
                    continue;
                }
                if (prop === 'up') {
                    let wall = new PIXI.Graphics()
                        .beginFill(0x000000)
                        .drawRect(0, 0, app.screen.width, wallThickness)
                        .endFill();
                    background.addChild(wall);
                    continue;
                }
                if (prop === 'down') {
                    let wall = new PIXI.Graphics()
                        .beginFill(0x000000)
                        .drawRect(0, app.screen.height - wallThickness, app.screen.width, wallThickness)
                        .endFill();
                    background.addChild(wall);
                }
            }
        }

        hideHint();

        //check if win
        if (player.y === maze.cells.length - 1 && player.x === maze.cells[0].length - 1){
            dispatch('end');
        }
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

        console.log(solution.toString())

        const best = solution.toJSON()[1];
        console.log(best);
        console.log(currentCell);
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
