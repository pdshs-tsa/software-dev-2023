<script>
    import { page } from '$app/stores'

    const user = $page.data.user;
    const classData = $page.data.class;
</script>

{#if classData == null}
    <h1>You don't have a class</h1>
{/if}