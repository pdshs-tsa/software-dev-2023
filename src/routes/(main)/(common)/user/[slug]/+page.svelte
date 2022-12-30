<script>
    import {page} from "$app/stores";
    import SetOverviewCard from "../../../../../libs/common/SetOverviewCard.svelte";

    const user = $page.data.user;
    const sets = $page.data.sets;
</script>

<div class="body">
    <div id="create-overview">
        <h1>{user.username}</h1>
        <h5>Joined {new Date(user.timestamp).toDateString()}</h5>
        <h5>{user.accounttype} account</h5>
    </div>

    <div style="flex: 2; overflow: auto;">
        <h1>Created Sets</h1>
        <div id="create-questions">
            {#each sets as set}
                <SetOverviewCard data="{set}"/>
            {/each}
        </div>
    </div>
</div>

<style>
    .body{
        width: 100%;
        max-height: 90vh;
        display: flex;
        overflow: clip;
    }

    #create-overview {
        flex: 0.7;
        max-height: fit-content;
    }

    #create-questions {
        display: flex;
        flex-wrap: wrap;
        border-left: 20px solid transparent;
    }

    h5 {
        margin: 0;
    }

</style>