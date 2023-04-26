<script>
    import {page} from "$app/stores";
    import AssignedSet from "../../../../libs/student/AssignedSet.svelte";
    import ClassOverview from "../../../../libs/common/ClassOverview.svelte";
    const user = $page.data.user;
    const classLists = $page.data.class;
</script>

<div class="body">
    <div class="infobox">
        <div class="info">
            <h4 style="text-align: center;">Your Classes</h4>
            <hr>
            {#each classLists as clazz}
                <ClassOverview classData={clazz}/>
            {/each}
        </div>
    </div>
    <div class="assigned">
        <h4 style="text-align: center">Assigned Sets</h4>
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

    hr {
        border: 1px solid lightgrey;
    }
</style>