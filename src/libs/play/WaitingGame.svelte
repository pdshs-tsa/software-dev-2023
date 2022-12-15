<script>
    import {goto} from "$app/navigation";
    import {socket} from "../common/socket/socket.js";

    export let gameData = {};
    let players = [];

    for (const p of gameData.players) {
        players.push(p.username);
        players = players;
    }

    socket.on('player-join', (username) => {
        players.push(username);
        players = players;
    })

    socket.on('end', () => {
        goto('/');
    });
</script>

<div class="body">
    <div class="set-overview">
        <h1>{gameData.set.title}</h1>
        <h1>{gameData.set.title}</h1>
        <h1>{gameData.set.title}</h1>
        <h1>{gameData.set.title}</h1>
        <h1>{gameData.set.title}</h1>
        <h1>{gameData.set.title}</h1>
        <h1>{gameData.set.title}</h1>
        <h1>{gameData.set.title}</h1>
    </div>
    <hr/>
    <div class="players">

    </div>
</div>

<style>
    .body {
        display: flex;
        height: 100vh;
        background: linear-gradient(140deg, rgba(175,212,233,1) 0%, rgba(120,154,173,1) 51%, rgba(53,82,98,1) 100%);
        padding: 10px;
    }

    .set-overview {
        display: flex;
        flex-direction: column;
        flex: 3;
        max-height: 100%;
        overflow: auto;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 3px;
    }

    .players {
        display: flex;
        flex: 1;
    }

    hr {
        border: 1px solid gray;
    }
</style>