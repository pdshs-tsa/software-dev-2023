<script>
    import PrejoinGame from "../../../libs/common/play/PrejoinGame.svelte";
    import JoinGame from "../../../libs/common/play/JoinGame.svelte";

    let gamecode = 0;
    let username = '';

    let prejoinStatus = false;
    $: if (prejoinStatus) status = 1;

    //0: prejoin, 1: join, 2: waiting
    let status = 0;
</script>

{#if status === 0}
    <PrejoinGame bind:gamestatus={prejoinStatus} bind:code={gamecode}/>
{:else if status === 1}
    <JoinGame code="{gamecode}" bind:username={username}/>
{/if}