<script>
    import {fly} from "svelte/transition"
</script>

<div class="background">
    <div class="body" in:fly={{ y: 200, duration: 500 }}>
        <h1 class="centered">Join a Game</h1>
        <input>
    </div>
</div>

<style>
    .background {
        background-color: #98c1d9;
        height: 100vh;
    }

    .body {
        vertical-align : middle;
    }

    .centered {
        text-align: center;
    }
</style>