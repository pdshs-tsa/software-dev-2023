<script>
    //eslint-disable-next-line no-unused-vars
    import pico from '@picocss/pico'
    import MenuButton from "../../libs/common/MenuButton.svelte";
    import NoAccountHeader from "../../libs/common/NoAccountHeader.svelte";
    //color palette- https://coolors.co/98c1d9-f17105-d11149-6610f2-1a8fe3
</script>

<div id="page">
    <NoAccountHeader />

    <div id="content">
        <slot/>
    </div>
</div>

<style>
    :global(html){
        overflow-y: auto;
    }

    #content{
        margin: 10px;
    }
</style>