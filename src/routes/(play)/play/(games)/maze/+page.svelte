<script>
    import {page} from "$app/stores";
    import MazeGame from "../../../../../libs/common/play/game/maze/MazeGame.svelte";
    import {goto} from "$app/navigation";
    import {socket} from "../../../../../libs/common/socket/socket.js";

    //init set data
    const set = $page.data.set;
    const isLive = $page.data.live;
    const user = $page.data.user;

    let setIndex = 0;
    let numCorrect = 0;

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

    let gameComponent;
    let answerStatus;

    function handleClick(selected) {
        if (answerStatus) return;
        if (selected === correct){
            gameComponent.showHint();
            prompt = "Correct!";
            numCorrect++;
        } else {
            prompt = "Incorrect :(";
        }
        gameComponent.setMovement(true);
        answerStatus = true;
    }

    function onCellChange(){
        //dont freeze player immediately
        setTimeout(() => {
            if (setIndex + 1 >= set.data.length) {
                questions = set.data
                    .map(value => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value);

                setIndex = 0;
            } else {
                setIndex++;
            }
            gameComponent.setMovement(false);
            answerStatus = false;
        }, 500);
    }

    function gameEnd() {
        setTimeout(() => {
            goto(`/set/${set.uuid}`);
        }, 500)
    }
</script>

<div style="display: flex; justify-content: space-evenly; align-items: center; background: lightskyblue; height: 100vh; ">
    <div style="display: flex; align-items: center; flex-direction: column">
        <h1>{prompt}</h1>
        <div style="display: flex; flex-wrap: wrap">
            {#each answers as answer}
                <button on:click={() => handleClick(answer)}>{answer}</button>
            {/each}
        </div>
    </div>
    <MazeGame bind:this={gameComponent} on:cellchange={onCellChange} on:end={gameEnd}/>
</div>