<script>
    import MenuButton from "./MenuButton.svelte";
</script>

<header>
    <div class="buttons">
        <MenuButton text="Home" endpoint="/"/>
        <MenuButton text="Play" endpoint="/play"/>
        <MenuButton text="Search" endpoint="/search" />
    </div>
    <div class="buttons">
        <MenuButton text="Login" endpoint="/login" />
    </div>
</header>

<style>
    .buttons {
        display: inline-flex;
    }

    header {
        background-color: #98c1d9;
        color: white;
        width: 100%;
        margin: 0;
        border: 0;
        padding: 0;
        display: flex;
        justify-content: space-between;
    }
</style>