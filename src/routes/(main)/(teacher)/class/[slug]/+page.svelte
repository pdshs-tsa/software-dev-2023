<script>
    import {page} from '$app/stores';

    const classdata = $page.data.data;
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
        {#each classdata.students as student}
            
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
        justify-content: center;
        flex: 2;
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