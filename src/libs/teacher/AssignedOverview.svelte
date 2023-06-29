<script>
    import {slide} from 'svelte/transition';

    export let assignment;
    let studentData = assignment.attempts;

    let averageBest = 0;
    for (const i of studentData) {
        averageBest += i.data.best;
    }

    averageBest /= studentData.length;

    let buttonText = "Show";
    let open = false;

    const switchStatus = () => {
        open = !open;
        buttonText = (open) ? "Hide Report" : "Show Report";
    }
</script>

<div class="body">
    <div style="display: flex; justify-content: center; align-content: center">
        <div style="display: flex; flex-direction: column; align-content: center; justify-content: center">
            <a style="font-size: x-large" href="/set/{assignment.uuid}">{assignment.set.title}</a>
        </div>

        <button on:click={switchStatus} class="button">{buttonText}</button>
    </div>

    {#if open}
        <div class="scores" transition:slide|local>
            <h6>Average Best Score: {averageBest}%</h6>
            <hr>
            <div>
                <table>
                    <tr>
                        <th>Student Name</th>
                        <th>Best Score</th>
                        <th>Attempt List</th>
                    </tr>
                    {#each studentData as student}
                        <tr>
                            <td><strong>{student.student}</strong></td>
                            <td>{student.data.best}%</td>
                            <td>
                                <ol>
                                    {#each student.data.attempts as attempt}
                                        <li>{attempt}</li>
                                    {/each}
                                </ol>
                            </td>
                        </tr>
                    {/each}
                </table>
            </div>
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
        padding: 1px;
        margin-left: 10%;
    }
</style>