<script>
    import {slide} from 'svelte/transition';

    export let data = {
        username: '',
        scores: [
            {
                uuid: '0',
                name: '',
                score: 0
            }
        ]
    }

    function switchStatus(){
        collapsed = !collapsed;
    }

    let collapsed = true;
    $: buttonText = (collapsed) ? "Show Data" : "Hide Data";
</script>

<div class="body">
    <div style="display: flex;">
        <h5 style="margin: auto auto auto 0;">{data.username}</h5>
        <button on:click={() => switchStatus()} class="button">{buttonText}</button>
    </div>

    {#if !collapsed}
        <div transition:slide|local>
            {#each data.scores as scoreData}
                <div>
                    Score on {scoreData.name}: {scoreData.score}
                </div>
            {/each}
        </div>
    {/if}
</div>


<style>
    .body {
        height: fit-content;
        padding: 10px;
        margin: 10px;
        border: 1px solid lightgrey;
        box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 3px;
    }

    .button {
        margin: 10px 10px 10px auto;
        padding: 10px;
        background-color: transparent;
        border: 0;
        color: #73828c;
        width: fit-content;
    }
</style>