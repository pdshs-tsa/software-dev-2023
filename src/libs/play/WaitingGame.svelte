<script>
    export let gameData = {};

    export let players = [];
</script>

<h1>{gameData.title}</h1>

<ul>
    {#each players as player}
        <li>{player}</li>
    {/each}
</ul>