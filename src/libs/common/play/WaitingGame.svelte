<script>
    import {socket} from "../socket/socket.js";
    import SetComponentUneditable from "../SetComponentUneditable.svelte";
    import {slide} from "svelte/transition";
    import {flip} from "svelte/animate";
    import {goto} from "$app/navigation";

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
    });

    socket.on('end', () => {
        goto('/play');
    });
</script>

<div class="body">
    <div style="flex: 2; overflow-y: auto">
        <div class="players" style="gap: 10px;" >
            <div class="player-card" style="align-content: center">
                <h2 style="margin: 10px; width: 100%; text-align: center">How to play: Maze</h2>
                <ul style="margin: 20px;">
                    <li>Answer questions to earn points</li>
                    <li>Questions are given when interacting with an object or moving rooms</li>
                    <li>Some objects are rarer than others; interact with rarer objects to gain more points</li>
                    <li>Reach the bottom right corner to gain a point bonus!</li>
                </ul>
            </div>
            <div class="player-card" style="align-content: center">
                <h2 style="margin: 10px; width: 100%; text-align: center">How to play: Classic</h2>
                <ul style="margin: 20px;">
                    <li>Answer questions to earn points</li>
                    <li>The faster you answer, the more points you earn</li>
                    <li>Try to finish with the most points!</li>
                </ul>
            </div>
            <div class="set-overview player-card">
                <h1 style="margin: 10px; width: 100%; text-align: center">{gameData.set.title}</h1>
                {#each gameData.set.data as component}
                    <SetComponentUneditable data="{component}" />
                {/each}
            </div>
        </div>
    </div>

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
        background-image: url("/join-background.png");
        background-size: cover;
        padding: 25px;
    }

    .set-overview {
        display: flex;
        flex-direction: column;
        flex: 2;
        max-height: 100%;
        overflow: auto;
        overflow-x: clip;
    }

    .players {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 10px;
        gap: 10px;
    }

    .player-card {
        background: rgba(255, 255, 255, 0.95);
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
</style>