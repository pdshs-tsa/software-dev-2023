<script>
    //eslint-disable-next-line no-unused-vars
    import pico from '@picocss/pico'
    import MenuButton from "../../../libs/common/MenuButton.svelte";
    import TeacherHeader from "../../../libs/teacher/TeacherHeader.svelte";
    //color palette- https://coolors.co/98c1d9-f17105-d11149-6610f2-1a8fe3
</script>

<div id="page">
    <TeacherHeader />

    <div id="content">
        <slot/>
    </div>
</div>

<style>
    :global(html){
        overflow: auto;
    }

    #content{
        margin: 10px;
    }

    #page {
        max-height: 10%;
        margin: 0;
    }
</style>