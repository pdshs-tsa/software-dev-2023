<script>
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    let accountTypes = [
        "Student",
        "Teacher"
    ];

    let selected = "";

    /** @type {import('./$types').ActionData} */
    export let form;

    onMount(() => {
        selected = form?.accounttype ?? "";
        if (form?.success) goto("/login");
    });
</script>

<div class="body">
    <h2>Create an Account</h2>
    <form method="POST">
        <input name="username" class="info" type="text" placeholder="Username">
        {#if form?.missingUsername} <p class="error">This field is required</p> {/if}
        {#if form?.takenUsername} <p class="error">This username is taken</p> {/if}
        {#if form?.invalidUsername} <p class="error">This username contains invalid characters</p> {/if}

        <input name="password" class="info" type="password" placeholder="Password">
        {#if form?.missingPassword} <p class="error">This field is required</p> {/if}

        <input name="verify-password" class="info" type="password" placeholder="Confirm password">
        {#if form?.notMatchingPasswords} <p class="error">Passwords don't match</p> {/if}

        <div class="centered">
            {#each accountTypes as type}
                <label>
                    <input type="radio" bind:group={selected} name="account-type" id={type} value={type}>
                    I am a {type}
                </label>
            {/each}
        </div>
        {#if form?.missingAccountType} <p class="error">This field is required</p> {/if}

        {#if selected === "Student"}
            <input name="class-code" class="info" type="text" placeholder="Class Code">
        {/if}
        {#if form?.missingClassCode}
            <p class="error">This field is required, ask your teacher for a code</p>
        {/if}

        <div class="centered">
            <button class="action-button" type="submit">Create Account</button>
        </div>
    </form>
</div>

<style>
    .body {
        margin-top: 5vh;
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

    .centered {
        padding: 10px;
        display: flex;
        justify-content: center;
    }

    label {
        margin: 5px;
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