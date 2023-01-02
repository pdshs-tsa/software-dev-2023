<script>
    import {page} from "$app/stores";
    import MazeGame from "../../../../../libs/common/play/game/maze/MazeGame.svelte";
    import {goto} from "$app/navigation";
    import {socket} from "../../../../../libs/common/socket/socket.js";
    import screenfull from "screenfull";

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
        <MazeGame on:end={gameEnd} on:fullscreen={fullscreen} setData="{set}"/>
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