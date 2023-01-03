<script>
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import screenfull from "screenfull";
    import SingleplayerMazeGame from "../../../../../libs/common/play/game/maze/SingleplayerMazeGame.svelte";
    import MultiplayerMazeGame from "../../../../../libs/common/play/game/maze/MultiplayerMazeGame.svelte";

    //init set data
    const set = $page.data.set;
    const isLive = $page.data.live;
    const user = $page.data.user;

    function gameEnd() {
        setTimeout(() => {
            goto(`/set/${set.uuid}`);
        }, 500)
    }

    //copy and pasted
    function fullscreen() {
        if (screenfull.isEnabled){
            screenfull.request(document.getElementById('mazegame'));
        }
    }
</script>

<div class="body">
    <div id="mazegame">
        {#if isLive}
            <MultiplayerMazeGame on:end={gameEnd} on:fullscreen={fullscreen} setData="{set}"/>
        {:else}
            <SingleplayerMazeGame on:end={gameEnd} on:fullscreen={fullscreen} setData="{set}"/>
        {/if}
    </div>
</div>

<style>
    .body {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        background-image: url("/join-background.png");
        background-size: cover;
        height: 100vh;
    }
</style>