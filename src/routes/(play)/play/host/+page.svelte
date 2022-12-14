<script>
    import {io} from '../../../../libs/common/socket/socket'
    import {onMount} from "svelte";
    import {page} from "$app/stores";

    const players = [];
    let code = '...';

    const set = $page.data.set;
    const host = $page.data.user;

    io.on('player-join', (username) => {
        players.push(username);
    });

    io.on('ack:host', (resp) => {
        code = resp;
    });

    onMount(() => {
        io.emit('host', set.uuid);
    });
</script>

<h1>{code}</h1>

<ul>
    {#each players as p}
        <li>{p}</li>
    {/each}
</ul>