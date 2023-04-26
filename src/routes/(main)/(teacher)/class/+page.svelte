<script>
    import { page } from '$app/stores'
    import { goto } from "$app/navigation";
    import ClassOverview from "../../../../libs/common/ClassOverview.svelte";
    const classes = $page.data.classes;
</script>

<div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 10px 0;">
    <h1 style="margin-bottom: 0">Your Classes</h1>
    <button style="max-width: fit-content" on:click={() => goto("/create-class")}>New Class</button>
</div>
<hr>

<div style="display: flex; flex-direction: column; gap: 10px" >
    {#each classes as clazz}
        <ClassOverview classData={clazz}/>
    {/each}
</div>

<style>
    hr {
        border: 1px solid lightgrey;
    }
</style>