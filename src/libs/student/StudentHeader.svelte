<script>
    import MenuButton from "../common/MenuButton.svelte";
</script>

<header>
    <div class="buttons">
        <MenuButton text="Home" endpoint="/student/home"/>
        <MenuButton text="Search" endpoint="/search"/>
    </div>

    <div class="buttons">
        <MenuButton text="Logout" endpoint="/student/logout" />
    </div>
</header>

<style>
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

    .buttons {
        display: inline-flex;
    }
</style>