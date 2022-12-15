<script>
    import {socket} from '../../../../libs/common/socket/socket'
    import {page} from "$app/stores";
    import {fly} from 'svelte/transition';
    import {flip} from 'svelte/animate';

    let players = [];

    const set = $page.data.set;
    const host = $page.data.user;

    let code = '...';
    $: slowcode = code;

    socket.on('player-join', (username) => {
        players.push(username);
        players = players;
    });

    socket.on('player-leave', (username) => {
        players.splice(players.indexOf(username), 1);
        players = players;
    })

    socket.once('ack:host', (resp) => {
        code = resp;
    });

    socket.emit('host', set.uuid);

    function kickPlayer(username) {
        socket.emit('kick', code, username);
    }
</script>

<div class="background">
    <div class="box title">
        <h1 style="margin: auto;">Code: {code}</h1>
        {#if typeof window !== "undefined"}<h6 style="padding: 0; margin: 0">Go to {window.location.href.split('/host')[0]} to join</h6>{/if}
    </div>

    <div class="body">
        {#each players as p (p)}
            <div class="box player"
                 on:click={() => kickPlayer(p)}
                 on:keypress={() => kickPlayer(p)}
                 animate:flip={{ duration: 300 }}
                 transition:fly={{ y: 30, duration: 300 }}>
                <h3 style="margin: auto; padding: 10px 20px 10px 20px;">{p}</h3>
            </div>
        {/each}
    </div>
</div>

<style>
    .background {
        background: linear-gradient(140deg, rgba(175,212,233,1) 0%, rgba(120,154,173,1) 51%, rgba(53,82,98,1) 100%);
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
    }

    .box {
        background: rgba(255, 255, 255, 0.75);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: fit-content;
        align-items: end;
    }

    .title{
        padding: 20px;
    }

    .body {
        display: flex;
        flex-wrap: wrap;
        width: 80%;
        justify-content: center;
    }

    .player {
        margin: 10px;
    }

    .player:hover {
        cursor: pointer;
    }
</style>