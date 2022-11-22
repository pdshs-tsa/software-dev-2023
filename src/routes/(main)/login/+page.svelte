<script>
    import {goto} from "$app/navigation";
    import { name } from "/src/properties.json";

    /** @type {import('./$types').ActionData} */
    export let form;
</script>

<div class="body">
    <h2>Login to {name}</h2>
    <form method="POST">
        <input class="info" type="text" placeholder="Username" name="username">
        <input class="info" type="password" placeholder="Password" name="password">

        <div id="buttons">
            <button class="action-button" type="button" on:click={() => goto("/create-account")}>Create Account</button>
            <button class="action-button" type="submit">Login</button>
        </div>
    </form>
    {#if form?.error === "userunknown"}<p class="error">Unknown username, create a new account.</p>{/if}
    {#if form?.error === "denied"}<p class="error">Incorrect password.</p>{/if}
    {#if form?.error === "empty"}<p class="error">Required fields are empty.</p>{/if}
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

    h2 {
        font-size: xxx-large;
        color: black;
        text-align: center;
        margin: auto auto 20px;
    }

    #buttons {
        display: flex;
        justify-content: center;
    }

    .error {
        text-align: center;
        display: block;
        color: red;
        font-weight: bold;
        margin: 0;
        font-size: medium;
    }
</style>