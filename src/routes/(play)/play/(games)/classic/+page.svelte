<script>
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import {fly} from 'svelte/transition';
    import {socket} from "../../../../../libs/common/socket/socket.js";

    const set = $page.data.set;
    const isLive = $page.data.live;
    const isHomework = $page.data.homework;
    const classCode = $page.data.class;
    const user = $page.data.user;
    let setIndex = 0;
    let numCorrect = 0;

    let time = Date.now();

    let questions = set.data
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    //set variables
    $: current = questions[setIndex];
    $: prompt = current.prompt;
    //shuffle
    $: answers = current.answers
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    $: correct = current.correct;

    let displayScreen = false;
    let chosen = '';

     async function submitButton(content) {
        chosen = content;
        displayScreen = true;
        time = Date.now() - time;
    }

    async function next(){
        displayScreen = false;
        if (chosen === correct) {
            numCorrect++;
        }
        if (isLive){
            socket.emit('classic:answer', $page.data.code, chosen === correct, time);
        }
        if (setIndex + 1 >= set.data.length) {
            if (isHomework) {
                let resp = await fetch(`${window.location.origin}/play/api/game_end?class=${classCode}&username=${user.username}&set=${set.uuid}&score=${numCorrect / set.data.length}`);
                await goto(`/home`);
                return;
            }
            if (isLive) socket.disconnect();
            await goto(`/play`);
            return;
        }
        time = Date.now();
        setIndex++;
    }

    socket.on('end', async () => {
       await goto('/play');
    });
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

{#if displayScreen}
    <div id="answer-overview" on:click={next} on:keypress={next} in:fly={{ y: 25, duration: 250 }}>
        <div>
            <h1 style="margin: auto;">{(chosen === correct) ? "Correct!" : "Incorrect :("}</h1>
        </div>
        <div>
            <p class="answer-overview-body">You chose <strong>{chosen}</strong></p>
            <p class="answer-overview-body">The correct answer was <strong>{correct}</strong></p>
        </div>
        <div>
            <p style="margin-bottom: 0"><u>Click to continue...</u></p>
        </div>
    </div>
{/if}

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

    #answer-overview {
        background-color: rgba(246, 246, 246, 0.97);
        color: black;
        position: fixed;
        width: 50%;
        height: 50%;
        border-radius: 16px;
        text-align: center;
        top: 25%;
        left: 50%;
        padding: 20px;
        transform: translate(-50%, 0);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    #answer-overview:hover {
        cursor: pointer;
    }

    .answer-overview-body {
        margin: auto;
    }
</style>