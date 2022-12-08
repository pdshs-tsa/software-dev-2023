<script>
    //eslint-disable-next-line no-unused-vars
    import pico from '@picocss/pico'
    import TeacherHeader from "../../../libs/teacher/TeacherHeader.svelte";
    import StudentHeader from "../../../libs/student/StudentHeader.svelte";
    import {page} from "$app/stores";
    import NoAccountHeader from "../../../libs/common/NoAccountHeader.svelte";
    //color palette- https://coolors.co/98c1d9-f17105-d11149-6610f2-1a8fe3

    const type = $page.data.type;
</script>

<div id="page">
    {#if type === "Teacher"}
        <TeacherHeader />
    {:else if type === "Student"}
        <StudentHeader />
    {:else}
        <NoAccountHeader />
    {/if}

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