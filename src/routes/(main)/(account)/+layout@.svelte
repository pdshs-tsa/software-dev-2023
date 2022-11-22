<script>
    import pico from "@picocss/pico"
    import MenuButton from "../../../libs/MenuButton.svelte";
    //color palette- https://coolors.co/98c1d9-f17105-d11149-6610f2-1a8fe3
</script>

<div id="page">
    <header>
        <MenuButton text="Home" endpoint="/home"/>
        <MenuButton text="Create" endpoint="/create" />
        <MenuButton text="Play" endpoint="/play"/>
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
    }

    :global(html){
        overflow-y: clip;
    }

    #content{
        margin: 10px;
    }

    #page {
        max-height: 10%;
        margin: 0;
    }
</style>