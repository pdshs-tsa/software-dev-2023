<script>
    import { goto } from "$app/navigation";

    let query = "";

    const search = () => {
        goto("/search?q=" + query.replaceAll(" ", "_"));
    }
</script>

<div class="navbar">
    <img src="/maze/player.png" alt="Logo" class="image" width="70" on:click={() => goto("/student/home")} on:keypress={() => goto("/")}/>
    <div class="buttons">
        <div style="display: flex; flex-direction: row; gap: 10px; align-content: center">
            <input type="text" class="search" bind:value={query} placeholder="Search" on:keypress={(e) => {
           if (e.key === "Enter") search();
        }}>
            <img class="glass"
                 src="https://raw.githubusercontent.com/google/material-design-icons/master/png/action/search/materialicons/48dp/1x/baseline_search_black_48dp.png"
                 alt="Search"
                 on:click={() => search()}
                 on:keypress={() => search()}/>
        </div>
        <div style="display: inline-flex; gap: 20px; justify-content: center; align-content: center">
            <a href="/student/join-class" style="display: flex; flex-direction: column; justify-content: center; text-align: center">Add another class</a>
            <a href="/student/logout" style="display: flex; flex-direction: column; justify-content: center; text-align: center">Log Out</a>
        </div>
    </div>
</div>

<style>
    .buttons {
        display: inline-flex;
        gap: 40px;
    }

    .navbar {
        position: fixed;
        top: 0;
        backdrop-filter: blur(6px);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 70px;
        box-shadow: rgba(149, 157, 165, 0.2) 0 2px 15px;
        padding: 0 30px 0 30px;
        z-index: 999999;
    }

    .image {
        max-width: 100px;
        max-height: 100px;
    }

    .image:hover {
        cursor: pointer;
    }

    .search {
        border: 0;
        border-bottom: 1px solid black;
        border-radius: 0;
        line-height: 0;
        margin: 0;
        padding-bottom: 0;
        padding-left: 20px;
        width: 25vw;
        color: black;
    }

    .search::placeholder {
        color: black;
    }

    .glass {
        max-width: 30px;
        max-height: 30px;
        margin: auto;
    }

    .glass:hover {
        cursor: pointer;
    }

    a {
        font-weight: bolder;
        font-size: large;
        color: black;
    }
</style>