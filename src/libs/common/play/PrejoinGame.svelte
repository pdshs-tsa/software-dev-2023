<script>
    import {fly} from "svelte/transition"
    import {socket} from "../socket/socket.js";

    export let gamestatus = false;
    export let code = '';

    let invalid = false;

    socket.on('ack:prejoin', (data) => {
        gamestatus = data;
        invalid = !gamestatus;
        if (invalid){
            code = '';
        }
    });

    function submitGame() {
        socket.emit('prejoin', code);
    }

    if (code !== '') submitGame();
</script>

<div class="background">
    <div class="body" in:fly={{ y: 25, duration: 250 }}>
        <h1>Join a Game</h1>
        <input name="code" id="code-input" type="text" inputmode="number" placeholder="Game ID" bind:value={code}>
        <button id="code-submit" on:click={submitGame}>Go!</button>
        {#if invalid}<h3 style="color: darkred; width: 100%; text-align: center">Enter a valid code</h3>{/if}
    </div>
</div>

<style>
    .background {
        background-image: url("/join-background.png");
        background-size: cover;
        height: 100vh;
    }

    .body {
        width: 100%;
        text-align: center;
    }

    #code-input {
        vertical-align: middle;
        font-family: "Courier New", "monospace";
        color: black;
        font-size: xxx-large;
        text-align: center;
        width: 400px;
        background: white;
    }

    #code-submit{
        vertical-align: middle;
        display: inline-block;
        width: 100px;
    }

    h1 {
        font-size: xxx-large;
        color: white;
        padding-top: 10%;
    }


</style>