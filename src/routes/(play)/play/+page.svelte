<script>
    import {fly} from "svelte/transition"
</script>

<div class="background">
    <div class="body" in:fly={{ y: 25, duration: 250 }}>
        <h1>Join a Game</h1>
        <form method="POST">
            <input id="code-input" type="number" placeholder="Game ID">
            <button id="code-submit" type="submit">Go!</button>
        </form>
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