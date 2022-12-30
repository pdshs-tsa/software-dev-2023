<script>
    import * as PIXI from 'pixi.js';
    import {onMount} from "svelte";
    import Generator from 'maze-generation/src/Generator';
    import Prando from 'prando';

    let view;
    let app;
    let maze;

    //containers
    let background;

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
            width: 800,
            height: 800,
            antialias: true,
            backgroundColor: 0xffffff
        });

        //load assets
        const playertexture = await PIXI.Assets.load('/maze/player.png');

        //draw the player centered
        const player = PIXI.Sprite.from(playertexture);
        player.anchor.set(0.5);

        player.x = app.screen.width / 2;
        player.y = app.screen.height / 2;

        app.stage.addChild(player);

        //init containers
        background = new PIXI.Container();

        app.stage.addChild(background);
        return app;
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

        console.log(maze.generateSolution({
            row: 0,
            column: 0
        }, {
            row: width - 1,
            column: height - 1
        }).toString());
        return maze;
    }

    function updateWalls(){
        background.removeChildren();
        const cell = maze.cells[currentCell.x][currentCell.y];

        let wallThickness = 20;

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
    }
</script>

<div style="display: flex; justify-content: center; align-items: center; background: lightskyblue; height: 100vh">
    <canvas bind:this={view}></canvas>
</div>

<svelte:window on:resize={() => init()}></svelte:window>

<style>
    canvas {
        margin: 0 auto;
    }
</style>
