<script>
    //eslint-disable-next-line no-unused-vars
    import pico from '@picocss/pico'
    import NoAccountHeader from "../../libs/common/NoAccountHeader.svelte";
    //color palette- https://coolors.co/98c1d9-f17105-d11149-6610f2-1a8fe3
</script>

<div id="page">
    <div id="break"></div>
    <NoAccountHeader />

    <div>
        <slot/>
    </div>
</div>

<style>
    :global(html){
        overflow-y: auto;
    }

    #break {
        height: 70px;
        width: 100%;
        padding: 0;
        margin: 0;
    }
</style>