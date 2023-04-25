<script>
    import { page } from '$app/stores'
    import {goto} from "$app/navigation";
    import SetOverviewCard from "../../../../libs/common/SetOverviewCard.svelte";
    $: arr = $page.data.arr;

    let q = ($page.data.q == null) ? '' : $page.data.q;

    function search(){
        goto('/search?q=' + q.replaceAll(" ", "_"));
    }
</script>

<div class="main">
    <h1>Search sets</h1>
    <div class="body">
        <input type="text" id="searchbar" placeholder="Query" bind:value={q}>
        <button type="button" id="submit" on:click={search}>Search</button>
    </div>

    <div class="scroll remainder">
        <div class="body">
            {#if arr != null}
                {#each arr as set}
                    <SetOverviewCard data="{set.value}" showAuthor="{true}"/>
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>
    .body {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        max-height: available;
    }

    .remainder {
        flex-grow: 1;
    }

    #searchbar {
        font-size: x-large;
        margin: 10px;
        flex: 5;
    }

    #submit {
        margin: 10px;
        flex: 1;
    }

    h1 {
        margin-bottom: 10px;
    }

    .scroll{
        overflow: auto;
        flex-grow: 1;
    }

    .main{
        display: flex;
        flex-direction: column;
        max-height: 88vh;
    }
</style>