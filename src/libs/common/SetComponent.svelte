<script>
    import { slide } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    let collapsed = true;
    $: buttonText = (collapsed) ? "Show" : "Hide";

    export let data = {
        prompt: '',
        answers: ['', '', '', ''],
        correct: ''
    }

    function switchStatus(){
        collapsed = !collapsed;
    }

    function remove() {
        dispatch('remove', {
            component: data
        });
    }

</script>

<div class="body">
    <div style="display: flex">
        <input type="text" bind:value={data.prompt} placeholder="Prompt" id="question">
        <button on:click={() => switchStatus()} class="button">{buttonText}</button>
        <button on:click={() => remove()} class="button">Remove</button>
    </div>
    {#if !collapsed}
        <div transition:slide|local>
            {#each data.answers as answer}
                <input type="text" bind:value={answer} placeholder="Option" class="option">
                <input type="radio" bind:group={data.correct} value={answer}>
            {/each}
        </div>
    {/if}
</div>

<style>
    .body {
        padding: 10px;
        border-radius: 16px;
        height: fit-content;
    }

    #question {
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-radius: 0;

        padding: 5px;
        margin: 10px;
        width: 70%;
    }

    .option {
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-radius: 0;

        padding: 5px;
        margin: 10px 10px 10px 60px;
        width: 35%;
    }

    input[type=radio] {
        margin: auto;
    }

    .button {
        margin: auto;
        padding: 10px;
        background-color: transparent;
        border: 0;
        color: #73828c;
        width: fit-content;
    }
</style>