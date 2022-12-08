<script>
    import {slide} from 'svelte/transition';

    export let data = {
        username: '',
        scores: [
            {
                uuid: '0',
                name: '',
                correct: 0,
                total: 0,
                started: false
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
        <h5 style="margin: auto auto auto 5%;">{data.username}</h5>
        <button on:click={() => switchStatus()} class="button">{buttonText}</button>
    </div>

    {#if !collapsed}
        <div class="scores" transition:slide|local>
            <ul>
                {#each data.scores as scoreData}
                    <li><a href={`/set/${scoreData.uuid}`}>{scoreData.name}</a>: {#if scoreData.started}{Math.round((scoreData.correct / scoreData.total) * 100)}%{:else}Not started{/if}</li>
                {/each}
            </ul>
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

    .scores {
        padding: 1px;
        margin-left: 10%;
    }
</style>