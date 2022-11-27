<script>
    import {goto} from "$app/navigation";

    export let data = {
        uuid: '',
        title: 'Sample Set',
        description: 'This is a sample set. You shouldn\'t see this',
        author: 'Admin',
        timestamp: 0,
        data: [{
            question: '',
            answers: ['', '', '', ''],
            correct: ''
        }]
    };

    export let showAuthor = false;

    const sampleQuestions = data.data.slice(0, (data.data.length < 3) ? data.data.length : 2);

    function navigateToSet(){
        goto(`/set/${data.uuid}`);
    }
</script>

<div class="body" on:click={navigateToSet} on:keydown={navigateToSet}>
    <div class="centered">
        <h3>{data.title}</h3>
    </div>
    <div>
        <ul>
            <li>{data.description}</li>
            {#if showAuthor} <li>By {data.author}</li> {/if}
            <li>Created {new Date(data.timestamp).toDateString()}</li>
        </ul>

        <hr>

        <p style="font-size: medium; margin-bottom: 2px">Sample Questions:</p>
        <ul style="margin-left: 2vw">
            {#each sampleQuestions as question}
                <li style="font-size: small">{question.prompt}</li>
            {/each}
        </ul>
    </div>
</div>

<style>
    .body{
        height: 30vh;
        width: 20vw;
        padding: 10px;
        border: 1px solid lightgrey;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        display: block;
        align-content: center;
        overflow: auto;
        margin: 5px;
        flex-shrink: 0;
    }

    .body:hover{
        cursor: pointer;
    }

    .centered {
        text-align: center;
    }

    h3 {
        font-size: x-large;
        margin: 0;
    }

    li {
        margin: 0;
        font-size: medium;
    }

    ul {
        margin-bottom: 5px;
    }

    hr {
        margin: 5px;
        border: 1px solid lightgrey;
    }
</style>
