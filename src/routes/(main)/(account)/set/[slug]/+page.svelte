<script>
    import { slide } from 'svelte/transition';
    import SetComponentUneditable from "../../../../../libs/SetComponentUneditable.svelte";

    /** @type {import('./$types').PageData} */
    export let data;
    $: user = data.user;
    $: set = data.set;
</script>

<div class="body">
    <div id="create-overview">
        <h1>{set.title}</h1>
        <h5>{set.description}</h5>

        <ul>
            //TODO: make this into a link to a user profile thing
            <li>Created by {set.author}</li>
            <li>{new Date(set.timestamp).toDateString()}</li>
        </ul>
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
        width: 90%;
        display: table;

        overflow: clip;
    }

    #create-overview {
        width: 35vw;
        padding: 10px;
        display: table-cell;
    }

    #create-questions {
        display: table-cell;
        overflow: scroll;
        position: absolute;
        min-width: 64.5vw;
        height: 90%;
        border-left: 20px solid transparent;
    }

    h1 {
        margin: 0;
    }

</style>