<script>
    import {socket} from '../../../../../../libs/common/socket/socket.js'
    import {page} from "$app/stores";
    import {fly} from 'svelte/transition';
    import {flip} from 'svelte/animate';
    import {onMount} from "svelte";
    import {hostname} from "../../../../../../libs/common/stores.js";
    import {goto} from "$app/navigation";

    let players = [];

    let started = false;
    let showSelection = false;

    const set = $page.data.set;
    const host = $page.data.user;

    let code = '...';
    $: slowcode = code;

    socket.on('player-join', (username) => {
        players.push({
            username: username,
            score: 0
        });
        players = players;
    });

    socket.on('player-leave', (username) => {
        players.splice(players.indexOf(username), 1);
        players = players;
    })

    socket.once('ack:host', (resp) => {
        code = resp;
    });

    socket.once('game-start', () => {
        showSelection = false;
        started = true;
    });

    socket.on('answer', (username, score) => {
        const playerdata = players.find((element) => element.username === username);
        const index = players.indexOf(playerdata);
        playerdata.score = score;
        players[index] = playerdata;
        players = players.sort((a, b) => {
            return a.score - b.score;
        }).reverse();
    });

    onMount(() => {
        if (hostname.toString() === ''){
            hostname.set(window.location.host);
            goto(window.location);
        }
        socket.emit('host', set.uuid);
    });

    function kickPlayer(username) {
        socket.emit('kick', code, username);
    }
</script>

<div class="background">
    <div class="box title">
        <h1 style="margin: auto;">Code: {code}</h1>
        {#if typeof window !== "undefined"}<h6 style="padding: 0; margin: 0">Go to {window.location.hostname + '/play'} to join</h6>{/if}
        {#if !started}<button on:click={() => showSelection = true}>Start game</button>{/if}
    </div>

    {#if !started}
        <div class="body">
            {#each players as p (p)}
                <div class="box player"
                     on:click={() => kickPlayer(p.username)}
                     on:keypress={() => kickPlayer(p.username)}
                     animate:flip={{ duration: 300 }}
                     transition:fly|local={{ y: 30, duration: 300 }}>
                    <h3 style="margin: auto; padding: 10px 20px 10px 20px;">{p.username}</h3>
                </div>
            {/each}
        </div>
    {:else}
        <div class="body score-body">
            {#each players as p (p)}
                <div class="scorecard"
                     animate:flip={{ duration: 300 }}>
                    <h3 style="margin: auto; padding: 10px 20px 10px 20px;">{p.username}</h3>
                    <h3 style="margin: auto; padding: 10px 20px 10px 20px;">{p.score}</h3>
                </div>
            {/each}
        </div>
    {/if}
</div>

{#if showSelection}
    <div class="centered title box">
        <h2 style="margin: auto">Select mode</h2>
        <button on:click={() => socket.emit('game-start', code, 'classic')}>Classic</button>
        <button on:click={() => socket.emit('game-start', code, 'maze')}>Maze</button>
    </div>
{/if}

<style>
    .background {
        background-image: url("/join-background.png");
        background-size: cover;
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

    .scorecard {
        border: 1px solid lightgrey;
        box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.75);
        border-radius: 16px;
        display: flex;
        justify-content: space-between;
        margin: 10px;
    }

    .score-body {
        display: flex;
        flex-direction: column;
    }

    .centered {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>