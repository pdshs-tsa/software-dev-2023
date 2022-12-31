<script>
    import * as PIXI from 'pixi.js';
    import * as Intersects from 'intersects';
    import {onMount} from "svelte";
    import Generator from 'maze-generation/src/Generator';
    import Prando from 'prando';
    import keyboard from '../keyboard';
    import collision from "../collision.js";

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
            width: 750,
            height: 750,
            antialias: true,
            backgroundColor: 0xffffff
        });

        //load assets
        const playertexture = await PIXI.Assets.load('/maze/player.png');
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
        left.press = () => {
            player.vx -= 1.5;
        }
        left.release = () => {
            player.vx += 1.5;
        }

        right.press = () => {
            player.vx += 1.5;
        }
        right.release = () => {
            player.vx -= 1.5;
        }

        up.press = () => {
            player.vy -= 1.5;
        }
        up.release = () => {
            player.vy += 1.5;
        }

        down.press = () => {
            player.vy += 1.5;
        }
        down.release = () => {
            player.vy -= 1.5;
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
        player.x += player.vx;
        player.y += player.vy;
        for (const child of background.children){
            //this is scuffed
            if (Intersects.boxLine(player.x - player.width / 5, player.y - player.height / 5, player.width, player.height, child.x, child.y, child.width, child.height)){
                console.log('collision')
                player.x -= player.vx * 4;
                player.y -= player.vy * 4;
            }
        }
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

        return maze;
    }


    //TODO: make walls sprite and rotate them according to their position (helps with collision detection)
    function updateWalls(){
        background.removeChildren();
        const cell = maze.cells[currentCell.x][currentCell.y];

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
                        .drawRect(0, app.screen.height, app.screen.width, wallThickness)
                        .endFill();
                    background.addChild(wall);
                }
            }
        }

        hideHint();
    }

    function hideHint() {
        hint.visible = false;
    }

    export function showHint() {
        const solution = maze.generateSolution({
            row: currentCell.x,
            column: currentCell.y
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
