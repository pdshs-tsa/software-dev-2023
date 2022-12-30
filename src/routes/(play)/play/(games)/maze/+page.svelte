<script>
    import {page} from "$app/stores";
    import MazeGame from "../../../../../libs/common/play/game/maze/MazeGame.svelte";
    import {onMount} from "svelte";

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
</script>

<MazeGame/>