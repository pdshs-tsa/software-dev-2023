<script>
    import SetComponent from "../../../../libs/SetComponent.svelte";

    export let data;

    $: user = data.user;


</script>

<div class="body">
    <div id="create-overview">
        <h2>Create a Set</h2>
        <input type="text" class="textbox" placeholder="Name">
        <input type="text" class="textbox" placeholder="Description">
    </div>

    <div id="create-questions">
        <SetComponent />
        <SetComponent />
        <SetComponent />
        <SetComponent />
        <SetComponent />
        <SetComponent />
        <SetComponent />
        <SetComponent />
        <SetComponent />
    </div>
</div>

<style>
    .body{
        width: 90%;
        display: table;

        overflow: scroll;
    }

    #create-overview {
        width: 35vw;
        display: table-cell;
    }

    #create-questions {
        display: table-cell;
        overflow: scroll;
        position: absolute;
        height: 85%;
        min-width: 64.5vw;
    }

    .textbox {
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-radius: 0;

        padding: 5px;
    }

</style>