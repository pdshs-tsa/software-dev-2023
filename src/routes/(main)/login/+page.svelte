<script>
import {goto} from "$app/navigation";
import { name } from "/src/properties.json";
</script>

<div class="body">
    <h1>Login to {name}</h1>
    <form method="POST">
        <input class="info" type="text" placeholder="Username">
        <input class="info" type="password" placeholder="Password">
        <div id="buttons">
            <button class="action-button" type="button" on:click={() => goto("/create-account")}>Create Account</button>
            <button class="action-button" type="submit">Login</button>
        </div>
    </form>
</div>

<style>
    .body {
        display: block;
    }

    .info {
        vertical-align: middle;
        font-family: "Courier New", "monospace";
        color: black;
        font-size: x-large;
        text-align: center;
        width: 400px;
        background: white;
        display: block;
        margin: 10px auto 10px;
    }

    .action-button {
        margin: auto 30px;
        display: inline;
        width: fit-content;
    }

    h1 {
        font-size: xxx-large;
        color: black;
        text-align: center;
        margin: auto auto 50px;
    }

    #buttons {
        display: flex;
        justify-content: center;
    }
</style>