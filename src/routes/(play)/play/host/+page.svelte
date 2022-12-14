<script>
    import {socket} from '../../../../libs/common/socket/socket'
    import {page} from "$app/stores";

    const players = [];

    const set = $page.data.set;
    const host = $page.data.user;

    let code = '...';

    console.log('hello');

    socket.on('player-join', (username) => {
        players.push(username);
    });

    socket.on('ack:host', (resp) => {
        console.log(resp);
        code = resp;
    });

    socket.emit('host', set.uuid);
</script>

<h1>{code}</h1>

<ul>
    {#each players as p}
        <li>{p}</li>
    {/each}
</ul>