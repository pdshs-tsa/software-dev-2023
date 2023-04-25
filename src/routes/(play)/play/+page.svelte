<script>
    import PrejoinGame from "../../../libs/common/play/PrejoinGame.svelte";
    import JoinGame from "../../../libs/common/play/JoinGame.svelte";
    import WaitingGame from "../../../libs/common/play/WaitingGame.svelte";
    import {socket} from "../../../libs/common/socket/socket.js";
    import { page } from '$app/stores'
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    import {hostname} from "../../../libs/common/stores.js";

    onMount(() => {
        if (hostname.toString() === ''){
            hostname.set(window.location.host);
            goto('/play');
        }
    });

    let gamecode = ($page.data.code == null) ? '' : $page.data.code;
    let username = '';
    let gameData = 0;

    let prejoinStatus = false;
    $: if (prejoinStatus) status = 1;
    $: if (gameData !== 0) status = 2;

    //0: prejoin, 1: join, 2: waiting
    let status = 0;

    socket.on('game-start', (mode) => {
        if (mode === 'classic'){
            goto(`/play/classic?code=${gamecode}&set=${gameData.set.uuid}`, {
                replaceState: true,
            });
            return;
        }
        if (mode === 'maze') {
            goto(`/play/maze?code=${gamecode}&set=${gameData.set.uuid}`, {
                replaceState: true,
            });
            return;
        }
    });

    socket.on('end', () => {
        goto('/play');
    });
</script>

{#if status === 0}
    <PrejoinGame bind:gamestatus={prejoinStatus} bind:code={gamecode}/>
{:else if status === 1}
    <JoinGame code="{gamecode}" bind:username={username} bind:gameData={gameData}/>
{:else if status === 2}
    <WaitingGame gameData="{gameData}" code="{gamecode}"/>
{/if}