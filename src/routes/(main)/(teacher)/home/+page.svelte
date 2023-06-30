<script>
    import SetOverviewCard from "../../../../libs/common/SetOverviewCard.svelte";
    import { page } from '$app/stores'
    import ClassOverviewCard from "../../../../libs/teacher/ClassOverviewCard.svelte";

    const user = $page.data.user;
    const classes = $page.data.classes;
    const sets = $page.data.sets;
</script>

<div style="padding: 0 20px 20px;">
    <h2>Your Sets</h2>

    <div class="setbox">
        {#if sets.length === 0}
            <div style="width: auto; height: auto; display: flex; flex-direction: column; justify-content: center; align-content: center; padding: 1em">
                <p style="color: gray"><i>Go to "create set" to start a new set.</i></p>
            </div>
        {:else}
            {#each sets as set}
                <SetOverviewCard data="{set}" />
            {/each}
        {/if}
    </div>

    <hr>

    <h2>Your Classes</h2>

    <div class="setbox">
        {#if sets.length === 0}
            <div style="width: auto; height: auto; display: flex; flex-direction: column; justify-content: center; align-content: center; padding: 1em">
                <p style="color: gray"><i>Go to "my classes" to create a class.</i></p>
            </div>
        {:else}
            {#each classes as classData}
                <ClassOverviewCard data={classData} />
            {/each}
        {/if}
    </div>

    <hr>

</div>

<style>
    .setbox {
        width: 100%;
        display: flex;
        min-height: 20vh;
        height: fit-content;
        margin-bottom: 20px;
        overflow-x: auto;
    }

    hr {
        margin: 5px;
        border: 1px solid lightgrey;
    }

    h2 {
        margin-bottom: 20px;
    }
</style>