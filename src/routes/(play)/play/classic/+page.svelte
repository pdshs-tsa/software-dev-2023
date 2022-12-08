<script>
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";

    const user = $page.data.user;
    const set = $page.data.set;
    let setIndex = 0;
    let numCorrect = 0;

    //set variables
    $: current = set.data[setIndex];
    $: prompt = current.prompt;
    //shuffle
    $: answers = current.answers
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    $: correct = current.correct;

     async function submitButton(content) {
        if (correct === content){
            prompt = "Correct!";
            numCorrect++;
        } else {
            prompt = "Incorrect :("
        }

        await new Promise(r => setTimeout(r, 2000));
        await next();
    }

    async function next(){
        if (setIndex + 1 >= set.data.length) {
            await goto(`/set/${set.uuid}`);
            return;
        }
        setIndex++;
    }

    async function terminate() {

    }
</script>

<div class="body">
    <div class="prompt">
        <h1 id="prompt">{prompt}</h1>
    </div>

    <div class="buttons">
        {#each answers as element, i}
            <div>
                <button class="selection" id={`selection${i + 1}`} on:click={() => submitButton(element)}>{element}</button>
            </div>
        {/each}
    </div>
</div>

<style>
    .body {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
    }

    .prompt {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .buttons {
        display: grid;
        gap: 5px;
        margin: 10px;
        grid-template-rows: 50% 50%;
        grid-template-columns: 50% 50%;
        flex: 2;
    }

    .selection {
        width: 100%;
        height: 100%;
        border: 0;
        color: black;
        font-size: xx-large;
    }

    #selection1 {
        background-color: #9EB8ECFF;
    }

    #selection2 {
        background-color: #60a9f1;
    }

    #selection3 {
        background-color: #69a0d5;
    }

    #selection4 {
        background-color: #7f93dc;
    }

    #prompt {
        margin-top: 20px;
        text-align: center;
        font-size: xxx-large;
    }
</style>