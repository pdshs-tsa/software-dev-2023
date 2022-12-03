<script>
    import { slide } from 'svelte/transition';

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
</script>

<div class="body">
    <div style="display: flex">
        <p id="question">{data.prompt}</p>
        <button on:click={() => switchStatus()} class="button">{buttonText}</button>
    </div>
    {#if !collapsed}
        <div transition:slide|local>
            {#each data.answers as answer}
                {#if data.correct === answer}
                    <p class="option"><strong>{answer}</strong></p>
                {:else}
                    <p class="option">{answer}</p>
                {/if}
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

        padding: 7px 7px 15px;
        margin: 10px;
        width: 70%;
        border-bottom: 1px solid #73828c;
    }

    .option {
        display: inline-block;
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-radius: 0;

        padding: 7px 7px 15px;
        margin: 10px 10px 10px 60px;
        width: 40%;
        border-bottom: 1px solid #73828c;
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