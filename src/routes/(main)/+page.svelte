<script>
    import { name } from "/src/properties.json";
    import {hostname} from "../../libs/common/stores.js";
    import {onMount} from "svelte";

    onMount(() => {
        hostname.set(window.location.host);
    });
</script>

<img class="image" src="https://4kwallpapers.com/images/wallpapers/windows-11-landscape-scenery-sunrise-stock-day-light-3840x2160-5661.jpg" alt="wall"/>

<div class="title">
    <h1>ProFishInSea</h1>
    <div style="display: flex; align-content: center">
        <input type="text" class="search" placeholder="Join a game">
        <img
            src="https://github.com/google/material-design-icons/blob/master/png/action/arrow_circle_right/materialicons/48dp/1x/baseline_arrow_circle_right_black_48dp.png?raw=true"
            alt="Go"
            class="join"
            width="30px"
        />
    </div>
</div>

<div>
    <div class="content">
        <div class="box quick-links info-box">
            <h1 class="box-title">Quick Links</h1>
            <hr>
            <a href="/play">Play</a>
        </div>

        <div class="box other info-box">
            <h1 class="box-title">Other Information</h1>
            <hr>
        </div>
    </div>
</div>

<style>
    .image {
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
        font-size: x-large;
    }

    .search::placeholder {
        color: black;
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