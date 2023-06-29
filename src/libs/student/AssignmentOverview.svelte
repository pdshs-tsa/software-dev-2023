<script>
    import {slide} from 'svelte/transition';
    import {goto} from "$app/navigation";

    export let assignment;

    let buttonText = "Show";
    let open = false;

    const switchStatus = () => {
        open = !open;
        buttonText = (open) ? "Hide Report" : "Show Report";
    }
</script>

<div class="body">
    <div style="display: flex;">
        <div style="display: flex; flex-direction: column; align-content: center; justify-content: center">
            <div style="display: flex; justify-content: space-between; width: 100%">
                <a style="font-size: x-large" href="/set/{assignment.data.uuid}">
                    {(assignment.set.title.length <= 40)
                        ? assignment.set.title
                        : assignment.set.title.substring(0, 40) + "..."}
                </a>
            </div>
            <a style="font-size: x-large" href="/student/class/{assignment.code}">{assignment.class}</a>
        </div>

        <div style="display: flex; justify-content: center; align-content: center; flex: 1">
            <p style="margin: auto; font-size: x-large">
                Best Score: {assignment.data.best + "%"}
            </p>
        </div>

        <button on:click={switchStatus} class="button">{buttonText}</button>
    </div>

    {#if open}
        <div class="scores" transition:slide|local>
            <hr>
            <div style="display: flex; gap: 10px">
                <button on:click={async () => {
                    await goto(`/play/classic?set=${assignment.set.uuid}&class=${assignment.code}`)
                }}>Play Classic</button>
                <button>Play Maze</button>
            </div>
            <hr>
            {#if assignment.data.attempts.length === 0}
                <p>No attempts yet</p>
            {:else}
                <ol>
                    {#each assignment.data.attempts as attempt}
                        <li>{attempt}%</li>
                    {/each}
                </ol>
            {/if}
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
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
        padding: 20px 1px 1px;
        margin-left: 10%;
    }
</style>