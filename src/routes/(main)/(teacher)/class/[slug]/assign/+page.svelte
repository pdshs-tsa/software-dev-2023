<script>
    import {page} from "$app/stores";
    import SetOverviewCard from "/src/libs/common/SetOverviewCard.svelte";
    import {goto} from "$app/navigation";

    const user = $page.data.user;
    const classdata = $page.data.classdata
    const sets = $page.data.sets;
    $: arr = ($page.data.arr != null) ? $page.data.arr : [];

    let q = '';

    function search(){
        goto(`/class/${classdata.code}/assign?q=` + q.replaceAll(" ", "_"));
    }

    function onClickCard(data) {
        console.log(data);
        goto(`/class/${classdata.code}/assign?set=${data.uuid}`);
    }
</script>

<div>
    <h1 class="header">Assign Sets</h1>
    <h3 class="header">Your sets</h3>
    <div class="setbox">
        {#if sets != null}
            {#each sets as set}
                <SetOverviewCard data="{set}" onClick={() => onClickCard(set)}/>
            {/each}
        {/if}
    </div>

    <hr>

    <h3 class="header">Search sets</h3>
    <div class="search">
        <input type="text" id="searchbar" placeholder="Query" bind:value={q}>
        <button type="button" id="submit" on:click={search}>Search</button>
    </div>

    <div class="scroll remainder">
        <div class="search">
            {#each arr as set}
                <SetOverviewCard data="{set.value}" showAuthor="{true}" onClick="{() => onClickCard(set.value)}"/>
            {:else}
                <h6>No results found</h6>
            {/each}
        </div>
    </div>
</div>

<style>
    .setbox {
        width: 100%;
        display: flex;
        min-height: 20vh;
        height: fit-content;
        margin-bottom: 20px;
        overflow-x: auto;
    }

    hr {
        border: 1px solid lightgrey;
    }

    .header {
        margin: auto;
    }

    .search {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        max-height: available;
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

    .scroll{
        overflow: auto;
        flex-grow: 1;
    }

    .remainder {
        flex-grow: 1;
    }
</style>

