<script>
    import PrejoinGame from "../../../libs/play/PrejoinGame.svelte";
    import JoinGame from "../../../libs/play/JoinGame.svelte";
    import WaitingGame from "../../../libs/play/WaitingGame.svelte";

    let gamecode = 0;
    let username = '';
    let gameData = 0;

    let prejoinStatus = false;
    $: if (prejoinStatus) status = 1;
    $: if (gameData !== 0) status = 2;

    //0: prejoin, 1: join, 2: waiting
    let status = 0;
</script>

{#if status === 0}
    <PrejoinGame bind:gamestatus={prejoinStatus} bind:code={gamecode}/>
{:else if status === 1}
    <JoinGame code="{gamecode}" bind:username={username} bind:gameData={gameData}/>
{:else if status === 2}
    <WaitingGame gameData="{gameData}"/>
{/if}