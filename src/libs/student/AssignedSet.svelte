<script>
    import {goto} from "$app/navigation";

    export let assigned;
</script>

<div class="body">
    <div style="display: flex;">
        <h5 style="margin: auto auto auto 5%;" on:click={goto(`/set/${assigned.uuid}`)} on:keypress={goto(`/set/${assigned.uuid}`)}>{assigned.name}</h5>
        <p>{#if !assigned.started}
                Not started
            {:else}
            {assigned.correct} / {assigned.total}- {Math.round(assigned.correct / assigned.total)}%
            {/if}</p>
    </div>
</div>


<style>
    .body {
        height: fit-content;
        padding: 10px;
        margin: 10px;
        border: 1px solid lightgrey;
        box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 3px;
        justify-content: space-between;
    }

    p {
        text-align: center;
        font-size: x-large;
        margin: auto 10px auto auto;
    }

    h5 {
        color: #4a7fe8;
    }

    h5:hover {
        cursor: pointer;
    }
</style>