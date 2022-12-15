<script>
    import {goto} from "$app/navigation";
    import {socket} from "../common/socket/socket.js";

    export let gameData = {};

    export let players = [];
    console.log(gameData);

    socket.once('end', () => {
        goto('/');
    })
</script>

<h1>{gameData.set.title}</h1>

<ul>
    {#each players as player}
        <li>{player}</li>
    {/each}
</ul>