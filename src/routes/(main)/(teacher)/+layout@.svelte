<script>
    //eslint-disable-next-line no-unused-vars
    import pico from '@picocss/pico'
    import MenuButton from "../../../libs/MenuButton.svelte";
    //color palette- https://coolors.co/98c1d9-f17105-d11149-6610f2-1a8fe3
</script>

<div id="page">
    <header>
        <div class="buttons">
            <MenuButton text="Home" endpoint="/home"/>
            <MenuButton text="Create" endpoint="/create" />
            <MenuButton text="Class" endpoint="/class" />
            <MenuButton text="Search" endpoint="/search" />
        </div>

        <div class="buttons">
            <MenuButton text="Logout" endpoint="/logout" />
        </div>
    </header>

    <div id="content">
        <slot/>
    </div>
</div>

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

    :global(html){
        overflow: clip;
    }

    #content{
        margin: 10px;
    }

    #page {
        max-height: 10%;
        margin: 0;
    }

    .buttons {
        display: inline-flex;
    }
</style>