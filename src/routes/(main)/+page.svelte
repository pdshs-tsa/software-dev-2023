<script>
    import { name } from "/src/properties.json";
    import {hostname} from "../../libs/common/stores.js";
    import { goto } from "$app/navigation";
    import {onMount} from "svelte";

    let code = "";

    onMount(() => {
        hostname.set(window.location.host);
    });

    const join = () => {
        goto("/play?code=" + code);
    }
</script>

<div class="background"></div>
<div class="title">
    <h1 style="color: black; font-size: 4em">ProFishInSea</h1>
    <div style="display: flex; align-content: center">
        <input type="text" class="search" placeholder="Join a game" bind:value={code} on:keypress={(e) => {
            if (e.key === "Enter") join()
        }}>
        <button
            style="background-color: transparent; border: 0; width: fit-content; height: fit-content"
            on:click={join}>
            <img
                src="https://github.com/google/material-design-icons/blob/master/png/action/arrow_circle_right/materialicons/48dp/1x/baseline_arrow_circle_right_black_48dp.png?raw=true"
                alt="Go"
                class="join"
                width="30px"
            />
        </button>
    </div>
</div>

<div>
    <div class="content">
        <div class="box quick-links info-box">
        <h1 class="box-title">Welcome to ProFishInSea!</h1>
            <hr>
            <strong>ProFishInSea</strong> is a study platform designed to be simple to use, effective for learning, and accessible. Teachers are able to create study sets and classes for students to use, who then play interactive learning games to reinforce knowledge retention.
            <br><br>
            Teachers can also host live games, which students can join and play with their peers in engaging, multiplayer games while learning content.
        </div>

        <div class="box other info-box">
            <h1 class="box-title">Reference Information</h1>
            <hr>

            <ul>
                <li>Background image from <a href="https://www.pexels.com/photo/white-jelly-fish-underwater-photography-2508555/">Pexels.com</a>.</li>
                <li>All other assets created from scratch using Adobe Illustrator.</li>
                <li>Website created using SvelteKit and Socket.IO.</li>
                <li>Web server using Nginx.</li>
                <li>All code is hosted locally on <a href="https://github.com/pdshs-tsa/software-dev-2023">GitHub</a>.</li>
            </ul>
        </div>
    </div>
</div>

<style>
    .background {
        background-image: url("/underwater.jpg");
        background-size: cover;
        position: absolute;
        object-fit: cover;
        height: 80vh;
        width: 100%;
        z-index: -1;
    }

    .title {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        width: 70%;
        height: 80vh;
    }

    .content {
        margin: 10px;
        display: flex;
        flex-direction: row;
        gap: 10px;
        background-color: transparent;
    }

    .title h1 {
        font-size: xxx-large;
    }

    .quick-links {
        flex: 2;
    }

    .other {
        flex: 1;
    }

    .box {
        background: rgba(255, 255, 255, 0.95);
        box-shadow: rgba(0, 0, 0, 0.19) 0 10px 20px, rgba(0, 0, 0, 0.23) 0 6px 6px;
        padding: 10px;
    }

    .search {
        border: 0;
        border-bottom: 1px solid black;
        border-radius: 0;
        line-height: 0;
        margin: 0;
        padding-bottom: 0;
        padding-left: 15px;
        width: 15vw;
        color: black;
        font-size: 1.5em;
    }

    .search::placeholder {
        color: black;
        font-size: 1em;
    }

    .info-box {
        padding: 20px;
    }

    .join {
        max-height: 40px;
        max-width: 40px;
        margin: auto;
    }

    .box-title {
        font-size: xx-large;
        margin: auto auto auto 20px;
    }

    hr {
        border: 1px solid lightgrey;
    }
</style>