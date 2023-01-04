<script>
    import { name } from "/src/properties.json";
    import {hostname} from "../../libs/common/stores.js";
    import {onMount} from "svelte";

    onMount(() => {
        hostname.set(window.location.host);
    });
</script>

<h1>Welcome to {name}</h1>

<h6>How to play each game!</h6>
<ul>
    <li>
        <strong>Classic</strong>: Answer correctly to earn points. Whoever has the most points at the end wins!
    </li>
    <li>
        <strong>Maze</strong>: Answer correctly to earn points. Explore the maze to find various point boosts, power ups, and more.
        Reach the end to gain a lot of points!
    </li>
</ul>