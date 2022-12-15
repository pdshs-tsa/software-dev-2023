<script>
    import {socket} from '../../../../libs/common/socket/socket'
    import {page} from "$app/stores";
    import {fly} from 'svelte/transition';

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
</script>

<div class="background">
    <div class="box title">
        <h1 style='font-family: "Courier New", "monospace"; margin: auto'>Code: {code}</h1>
    </div>

    <div class="body">
        {#each players as p}
            <div class="box" in:fly={{ y: 50, duration: 500 }}>
                <h3 style="margin: auto; padding: 10px 20px 10px 20px;">{p}</h3>
            </div>
        {/each}
    </div>
</div>

<style>
    .background {
        background: rgb(175,212,233);
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
        width: 100%;
    }
</style>