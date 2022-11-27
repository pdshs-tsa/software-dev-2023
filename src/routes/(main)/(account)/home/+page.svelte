<script>
    import SetDisplay from "../../../../libs/SetHomeCard.svelte";

    /** @type {import('./$types').PageData} */
    export let data;

    $: user = data.user;
    $: sets = data.sets;
</script>

<h2>Your Sets</h2>

<div class="body">
    {#if sets != null}
        {#each sets as set}
            <SetDisplay data="{set}" />
        {/each}
    {/if}
</div>

<hr>

<style>
    .body {
        width: 100%;
        display: flex;
        min-height: 20vh;
        height: fit-content;
    }

    hr {
        margin: 5px;
        border: 1px solid lightgrey;
    }
</style>