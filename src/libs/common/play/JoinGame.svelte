<script>
    import {fly} from "svelte/transition"
    import {socket} from "../socket/socket.js";

    export let code = '';
    export let username = '';
    export let gameData = {};
    let invalid = false;
    let message;

    socket.on('ack:join', (data) => {
        if (typeof data !== 'string') {
            gameData = data;
        } else {
            invalid = true;
            message = data;
        }
    });

    function submitGame() {
        socket.emit('join', code, username);
    }
</script>

<div class="background">
    <div class="body" in:fly={{ y: 25, duration: 250 }}>
        <h1>Enter your username</h1>
        <input name="code" id="code-input" type="text" placeholder="Username" autocomplete="off" bind:value={username}>
        <button id="code-submit" on:click={submitGame}>Go!</button>
    </div>
    {#if invalid}
        <h3 style="color: darkred; width: 100%; text-align: center">{message}</h3>
    {/if}
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