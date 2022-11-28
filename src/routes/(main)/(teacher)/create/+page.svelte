<script>
    import SetComponent from "../../../../libs/SetComponent.svelte";
    import { slide } from 'svelte/transition';
    import {applyAction, deserialize} from "$app/forms";
    import {goto, invalidateAll} from "$app/navigation";
    import { page } from '$app/stores'

    $: components = [{ prompt: '', answers: ['', '', '', ''], correct: '' }];
    const user = $page.data.user;
    let valid = true;

    function addComponent() {
        let data = {
            prompt: '',
            answers: ['', '', '', ''],
            correct: ''
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

        //init form data container
        let formData = new FormData(this);

        //check if everything is filled out
        valid = true;
        if (formData.get('name') === '' || formData.get('desc') === '') valid = false;
        if (components.length < 1) valid = false;
        for (const i of components) {
            if (i.prompt === '' || i.correct === '') {
                valid = false;
                break;
            }
            for (let j = 0; j < i.answers.length; j++){
                if (i.answers[j] === ''){
                    valid = false;
                    break;
                }

                if (j === 0) continue;
                if (i.answers[j] === i.answers[j - 1]){
                    valid = false;
                    break;
                }
            }
        }

        console.log(valid);

        if (!valid) return;

        //add components as new key in data
        await formData.append('components', JSON.stringify(components));

        //post to page.server.js
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData
        });

        //check result
        /** @type {import('@sveltejs/kit').ActionResult} */
        const result = deserialize(await response.text());

        if (result.type === 'success') {
            // re-run all `load` functions, following the successful update
            await invalidateAll();
        }

        //goto set
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

        {#if !valid}
            <p class="error">One or more of the questions are invalid</p>
            <p class="error">Please make sure all fields are filled and no answers are duplicates</p>
        {/if}
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

    .error {
        margin: 10px;
        color: red;
        font-size: medium;
    }
</style>