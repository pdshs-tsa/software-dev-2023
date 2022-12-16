<script>
    import {goto} from "$app/navigation";
    import {socket} from "../socket/socket.js";
    import SetComponentUneditable from "../SetComponentUneditable.svelte";
    import {slide} from "svelte/transition";
    import {flip} from "svelte/animate";

    export let gameData = {};
    export let code = 0;
    let players = [];

    for (const p of gameData.players) {
        players.push(p.username);
        players = players;
    }

    socket.on('player-join', (username) => {
        players.push(username);
        players = players;
    });

    socket.on('player-leave', (username) => {
        players.splice(players.indexOf(username), 1);
        players = players;
    })

    socket.on('end', () => {
        goto('/play');
    });
</script>

<div class="body">
    <div class="set-overview">
        <h1 style="margin: 10px; width: 100%; text-align: center">{gameData.set.title}</h1>
        {#each gameData.set.data as component}
            <SetComponentUneditable data="{component}" />
        {/each}
    </div>
    <hr/>
    <div class="players">
        <div class="player-card" style="margin-bottom: 20px;">
            <h1 class="player-text">Code: {code}</h1>
        </div>
        <div class="player-card">
            <h1 class="player-text">Connected players</h1>
        </div>
        <div class="player-list">
            {#each players as player (player)}
                <div transition:slide|local animate:flip={{duration: 200}} class="player-card">
                    <h4 class="player-text">{player}</h4>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .body {
        display: flex;
        height: 100vh;
        background: linear-gradient(140deg, rgba(175,212,233,1) 0%, rgba(120,154,173,1) 51%, rgba(53,82,98,1) 100%);
        padding: 25px;
    }

    .set-overview {
        display: flex;
        flex-direction: column;
        flex: 2;
        max-height: 100%;
        margin: 10px;
        overflow: auto;
        overflow-x: clip;
        background: rgba(255, 255, 255, 0.75);
        box-shadow: rgba(0, 0, 0, 0.19) 0 10px 20px, rgba(0, 0, 0, 0.23) 0 6px 6px;
    }

    .players {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 10px;
        gap: 10px;
    }

    .player-card {
        background: rgba(255, 255, 255, 0.75);
        box-shadow: rgba(0, 0, 0, 0.19) 0 10px 20px, rgba(0, 0, 0, 0.23) 0 6px 6px;
    }

    .player-list {
        max-height: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow: auto;
        overflow-x: clip;
    }

    .player-text {
        margin: auto;
        padding: 10px;
    }

    hr {
        border: 1px solid gray;
    }
</style>