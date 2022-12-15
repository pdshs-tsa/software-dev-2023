<script>
    import {goto} from "$app/navigation";
    import {socket} from "../common/socket/socket.js";

    export let gameData = {};
    let players = [];

    for (const p of gameData.players) {
        players.push(p.username);
        players = players;
    }

    socket.on('end', () => {
        goto('/');
    });
</script>

<h1>{gameData.set.title}</h1>

<ul>
    {#each players as player}
        <li>{player}</li>
    {/each}
</ul>