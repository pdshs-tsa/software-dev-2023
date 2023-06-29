<script>
    import {page} from '$app/stores';
    import StudentOverview from "../../../../../libs/teacher/StudentOverview.svelte";
    import {goto} from "$app/navigation";
    import AssignedOverview from "../../../../../libs/teacher/AssignedOverview.svelte";

    const classdata = $page.data.data;
    const asssigned = $page.data.assigned
    const user = $page.data.user;
</script>

<div class="body">
    <div class="infobox">
        <div class="info">
            <p><strong>{classdata.name}</strong></p>
            <p>Your class code is <strong>{classdata.code}</strong></p>
        </div>

        <div class="info">
            <p>Assigned Sets</p>
            <hr>
            {#if asssigned != null}
                {#each asssigned as setdata}
                    <AssignedOverview assignment={setdata} />
                {/each}
            {/if}
            <hr>
            <button on:click={async () => await goto(`/class/${classdata.code}/assign`)}>Assign new</button>
        </div>
    </div>
    <div class="students">
        <h3 style="text-align: center; margin-bottom: 0">Class List</h3>
        {#each classdata.students as student}
            <StudentOverview data="{student}" />
        {/each}
    </div>
</div>

<style>
    .body{
        display: flex;
    }

    .students {
        display: flex;
        flex-direction: column;
        flex: 2;
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
</style>