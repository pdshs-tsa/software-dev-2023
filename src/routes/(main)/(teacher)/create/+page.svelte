<script>
    import SetComponent from "../../../../libs/common/SetComponent.svelte";
    import { slide } from 'svelte/transition';
    import {applyAction, deserialize} from "$app/forms";
    import {goto, invalidateAll} from "$app/navigation";
    import { page } from '$app/stores'

    $: components = [{ prompt: '', answers: ['', '', '', ''], correct: '' }];
    $: props = [];
    const user = $page.data.user;
    let valid = true;
    let loading = false;

    let loadingData = '';

    function addComponent(data = undefined) {
        if (data === undefined){
            data = {
                prompt: '',
                answers: ['', '', '', ''],
                correct: ''
            }
        }

        components.push(data);
        components = components;
    }

    function removeComponent(event) {
        let index = components.indexOf(event.detail.component);
        components.splice(index, 1);
        components = components;
    }

    function autofillAnswers(){
        if (components.length < 4) return;
        for (const comp of components){
            for (let i = 0; i < 4; i++){
                if (comp.answers[i] !== '') continue;
                if (comp.answers[i] === comp.correct) continue;
                let answer = components[randomInteger(0, components.length)].answers[randomInteger(0, 5)];
                while (comp.answers.includes(answer) || answer === '' || answer == null){
                    answer = components[randomInteger(0, components.length)].answers[randomInteger(0, 5)];
                }

                comp.answers[i] = answer;
            }
        }
        components = components;
    }

    async function handleSubmit(event){
        //init form data container
        let formData = new FormData(this);

        //check if everything is filled out
        valid = !(formData.get('name') === '' || formData.get('desc') === '');
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

    function randomInteger(min, max) {
        let num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (num === max){
            return randomInteger(min, max);
        }
        return num;
    }

    function parseData() {
        loading = false;
        const sets = loadingData.split(';;');
        for (const term of sets) {
            addComponent({prompt: term.split('[]')[0], answers: [term.split('[]')[1], '', '', ''], correct: term.split('[]')[1]})
        }
        let copy = [];
        for (const element of components) {
            if (element.prompt === undefined || element.prompt === '' || element.correct === undefined || element.correct === '') continue;
            copy.push(element);
        }
        components = copy;
        loadingData = '';
        console.log(components);
    }
</script>

<div class="body">
    <div id="create-overview">
        <h2>Create a Set</h2>
        <form method="POST" on:submit|preventDefault={handleSubmit}>
            <input type="text" class="textbox" placeholder="Name" name="name">
            <input type="text" class="textbox" placeholder="Description" name="desc">
            <button type="button" on:click={() => loading = true}>Load data</button>
            <button type="button" on:click={autofillAnswers}>Autofill choices</button>
            <button type="submit">Create</button>
        </form>

        {#if !valid}
            <p class="error">One or more of the questions are invalid</p>
            <p class="error">Please make sure all fields are filled and no answers are duplicates</p>
        {/if}
    </div>

    <div id="create-questions">
        {#each components as part, i}
            <div transition:slide|local>
                <SetComponent bind:data={part} bind:this={props[i]} on:remove={removeComponent}/>
            </div>
        {/each}
        <button on:click={() => addComponent()}>Add</button>
    </div>
</div>

{#if loading}
    <div class="centered" style="box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 3px; max-width: 50%; max-height: 50%; overflow: auto; background: white; padding: 20px; border: 1px solid lightgray; ">
        <div style="display: flex; justify-content: space-between">
            <h2>Load from Quizlet</h2>
            <button style="width: fit-content; height: fit-content" on:click={() => loading = false}>Close</button>
        </div>
        <p>Go to a Quizlet set, press the three dots, and press "export". Then, change the "between term and definition" to "[]" and "between rows" to ";;". This only works with sets you own!</p>
        <textarea bind:value={loadingData}></textarea>
        <button on:click={parseData}>Load</button>
    </div>
{:else}
    <div></div>
{/if}
<style>
    .body{
        display: table;
        overflow: clip;
    }

    #create-overview {
        width: 35vw;
        display: table-cell;
    }

    #create-questions {
        display: table-cell;
        overflow: auto;
        position: absolute;
        min-width: 64vw;
        max-width: 64vw;
        height: 80%;
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

    .centered {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>