<script>
    import {page} from "$app/stores";
    import MazeGame from "../../../../../libs/common/play/game/maze/MazeGame.svelte";

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

    function handleClick(selected) {
        if (selected === correct){
            gameComponent.showHint();
        }
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
    <MazeGame bind:this={gameComponent}/>
</div>