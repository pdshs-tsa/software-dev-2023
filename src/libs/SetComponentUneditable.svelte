<script>
    import { slide } from 'svelte/transition';

    let collapsed = true;
    $: buttonText = "Show"

    export let data = {
        prompt: '',
        answers: ['', '', '', '']
    }

    function switchStatus(){
        collapsed = !collapsed;
        (collapsed) ? buttonText = "Show" : buttonText = "Hide";
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
                <p class="option">{answer}</p>
                <!--<input type="text" bind:value={answer} placeholder="Option" class="option"> -->
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