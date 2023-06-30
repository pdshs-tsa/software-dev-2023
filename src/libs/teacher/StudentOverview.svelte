<script>
    import {slide} from "svelte/transition";

    export let data = {
        username: '',
        assignments: [
            {
                best: 0,
                uuid: '',
                name: '',
                attempts: []
            }
        ]
    }

    let totalAssignments = data.assignments.length;
    let totalAttempted = 0;
    for (const i of data.assignments) {
        if (i.attempts.length > 0) totalAttempted++;
    }

    let buttonText = "Show Report";
    let open = false;
    const switchStatus = () => {
        open = !open;
        buttonText = (open) ? "Hide Report" : "Show Report";
    }
</script>

<div class="body">
    <div style="display: flex; justify-content: space-between;">
        <h5 style="margin: auto">{data.username}</h5>
        <h5 style="margin: auto">{totalAttempted} Attempted / {totalAssignments} Assigned</h5>
        <button on:click={switchStatus} class="button">{buttonText}</button>
    </div>

    {#if open}
        <div class="scores" transition:slide|local>
            <table>
                <tr>
                    <th><strong>Assignment</strong></th>
                    <th><strong>Best Score</strong></th>
                    <th><strong>Attempts</strong></th>
                </tr>
                {#if data.assignments.length > 0}
                    {#each data.assignments as assignment}
                        <tr>
                            <td>{assignment.name}</td>
                            <td>{assignment.best}</td>
                            <td>
                                <ol>
                                    {#each assignment.attempts as attempt}
                                        <li style="font-size: large"><strong>{attempt}%</strong></li>
                                    {/each}
                                </ol>
                            </td>
                        </tr>
                    {/each}
                {/if}
            </table>
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