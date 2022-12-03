<script>
    import {page} from '$app/stores';
    import StudentOverview from "../../../../../libs/StudentOverview.svelte";

    const classdata = $page.data.data;
    console.log(classdata);
    const user = $page.data.user;
</script>

<div class="body">
    <div class="infobox">
        <div class="info">
            <p>Your class code is <strong>{classdata.code}</strong></p>
            <p>Your class password is <strong>{classdata.password}</strong></p>
        </div>

        <div class="info">
            <p>Assigned Sets</p>
            <ul>
                {#if classdata.assigned != null}
                    {#each classdata.assigned as set}
                        <li>{set.name}</li>
                    {/each}
                {/if}
            </ul>

            <button>Assign new</button>
        </div>
    </div>
    <div class="students">
        <h4 style="text-align: center">Student Data</h4>
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

    h4 {
        margin: 0;
    }
</style>