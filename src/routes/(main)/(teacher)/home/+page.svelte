<script>
    import SetOverviewCard from "../../../../libs/common/SetOverviewCard.svelte";
    import { page } from '$app/stores'

    const user = $page.data.user;
    const sets = $page.data.sets;
</script>

<h2>{user.username}'s Sets</h2>

<div class="setbox">
    {#if sets != null}
        {#each sets as set}
            <SetOverviewCard data="{set}" />
        {/each}
    {/if}
</div>

<hr>

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