<script>
    import { slide } from 'svelte/transition';
    import SetComponentUneditable from "../../../../../libs/common/SetComponentUneditable.svelte";
    import { page } from '$app/stores'
    import {goto} from "$app/navigation";

    const type = $page.data.type;
    const username = $page.data.username;

    const set = $page.data.set;
</script>

<div class="body">
    <div id="create-overview">
        <h1>{set.title}</h1>
        <h5>{set.description}</h5>

        <ul>
            <li>By <p on:click={() => goto('/user/' + set.author)} on:keypress={() => goto('/user/' + set.author)} id="author-link">{set.author}</p></li>
            <li>{new Date(set.timestamp).toDateString()}</li>
        </ul>

        {#if type === "Student"}
            <button on:click={() => goto(`/play/classic?set=${set.uuid}`)}>Practice</button>
        {/if}
        {#if type === "Teacher"}
            <button on:click={() => goto(window.location + '/host')}>Host</button>
        {/if}
        {#if set.author === username}
            <button on:click={() => goto(window.location + '/edit')}>Edit</button>
        {/if}
    </div>

    <div id="create-questions">
        {#each set.data as part}
            <div transition:slide|local>
                <SetComponentUneditable data={part}/>
            </div>
        {/each}
    </div>
</div>

<style>
    .body{
        max-width: 100vh;
        display: table;

        overflow: auto;
    }

    #create-overview {
        width: 35vw;
        padding: 10px;
        display: table-cell;
    }

    #create-questions {
        display: table-cell;
        overflow: auto;
        position: absolute;
        min-width: 64vw;
        max-width: 64vw;
        height: 80%;
        border-left: 20px solid transparent;
    }

    h1 {
        margin: 0;
    }

    #author-link {
        display: inline;
        color: cornflowerblue;
    }

    #author-link:hover {
        cursor: pointer;
    }

    :global(body) {
        overflow: clip;
    }
</style>