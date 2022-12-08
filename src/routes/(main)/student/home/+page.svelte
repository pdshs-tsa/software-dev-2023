<script>
    import {page} from "$app/stores";
    import AssignedSet from "../../../../libs/student/AssignedSet.svelte";
    const user = $page.data.user;
    const classdata = $page.data.class;
</script>

<div class="body">
    <div class="infobox">
        <div class="info">
            <h4 style="text-align: center;">Your Stats</h4>
            <p>
                Total sets done: {classdata.stats.total}<br>
                Total questions answered: {classdata.stats.completed}<br>
                Total correct questions: {classdata.stats.correct} ({classdata.stats.correct / classdata.stats.completed}%)
            </p>
        </div>
    </div>
    <div class="assigned">
        <h4 style="text-align: center">Assigned Sets</h4>
        {#each classdata.scores as set}
            <AssignedSet assigned="{set}" />
        {/each}
    </div>
</div>

<style>
    .body{
        display: flex;
    }

    .assigned {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-top: 0;
    }

    .infobox {
        flex: 1;
    }

    .info {
        box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 3px;
        border: 1px solid lightgrey;
        padding: 10px;
        margin: 10px;
    }

    p{
        text-align: center;
        font-size: x-large;
        margin: auto
    }

    h4 {
        margin: 0;
    }
</style>