<script>
    let collapsed = true;
    $: buttonText = "Show"

    export let data = {
        question: '',
        answers: ['', '', '', '']
    }

    function switchStatus(){
        collapsed = !collapsed;
        (collapsed) ? buttonText = "Show" : buttonText = "Hide";
    }
</script>

<div class="body">
    <div style="display: flex">
        <input type="text" bind:value={data.question} placeholder="Prompt" id="question">
        <button on:click={() => switchStatus()} id="collapse">{buttonText}</button>
    </div>
    <div>
        {#if !collapsed}
            {#each data.answers as answer}
                <input type="text" bind:value={answer} placeholder="Option" class="option">
            {/each}
        {/if}
    </div>
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
        margin: 10px;
        margin-left: 60px;
        width: 40%;
    }

    #collapse {
        margin: auto;
        padding: 10px;
        background-color: transparent;
        border: 0;
        color: #73828c;
        width: fit-content;
    }
</style>