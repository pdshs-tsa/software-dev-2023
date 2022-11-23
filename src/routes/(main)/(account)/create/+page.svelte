<script>
    import SetComponent from "../../../../libs/SetComponent.svelte";
    import { slide } from 'svelte/transition';
    import {applyAction, deserialize} from "$app/forms";
    import {goto, invalidateAll} from "$app/navigation";

    export let data;
    $: components = [{ prompt: '', answers: ['', '', '', ''] }];
    $: user = data.user;

    function addComponent() {
        let data = {
            prompt: '',
            answers: ['', '', '', '']
        }

        components.push(data);
        components = components;
    }

    function removeComponent(event) {
        let index = components.indexOf(event.detail.component);
        console.log(components[0]);
        components.splice(index, 1);
        components = components;
    }

    async function handleSubmit(event){
        let formData = new FormData(this);
        await formData.append('components', JSON.stringify(components));

        const response = await fetch(this.action, {
            method: 'POST',
            body: formData
        });

        /** @type {import('@sveltejs/kit').ActionResult} */
        const result = deserialize(await response.text());

        if (result.type === 'success') {
            // re-run all `load` functions, following the successful update
            await invalidateAll();
        }

        await applyAction(result);
        await goto('/set/' + result.data.set);
    }
</script>

<div class="body">
    <div id="create-overview">
        <h2>Create a Set</h2>
        <form method="POST" on:submit|preventDefault={handleSubmit}>
            <input type="text" class="textbox" placeholder="Name" name="name">
            <input type="text" class="textbox" placeholder="Description" name="desc">
            <button type="submit">Create</button>
        </form>
    </div>

    <div id="create-questions">
        {#each components as part}
            <div transition:slide|local>
                <SetComponent bind:data={part} on:remove={removeComponent}/>
            </div>
        {/each}
        <button on:click={() => addComponent()}>Add</button>
    </div>
</div>

<style>
    .body{
        width: 90%;
        display: table;

        overflow: clip;
    }

    #create-overview {
        width: 35vw;
        display: table-cell;
    }

    #create-questions {
        display: table-cell;
        overflow: scroll;
        position: absolute;
        min-width: 64.5vw;
        height: 90%;
        border-left: 20px solid transparent;
    }

    .textbox {
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-radius: 0;

        padding: 5px;
    }

</style>