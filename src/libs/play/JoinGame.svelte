<script>
    import {fly} from "svelte/transition"
    import {socket} from "../common/socket/socket.js";

    export let code = '';
    export let username = '';
    export let gameData = {};

    socket.on('ack:join', (data) => {
        if (data !== 0) {
            gameData = data;
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
</div>

<style>
    .background {
        background: rgb(175,212,233);
        background: linear-gradient(140deg, rgba(175,212,233,1) 0%, rgba(120,154,173,1) 51%, rgba(53,82,98,1) 100%);
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