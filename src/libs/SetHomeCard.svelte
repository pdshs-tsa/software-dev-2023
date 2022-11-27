<script>
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

    const sampleQuestions = data.data.slice(0, (data.data.length < 3) ? data.data.length : 2);
</script>

<div class="body">
    <div class="centered">
        <a href="/set/{data.uuid}">{data.title}</a>
    </div>
    <div>
        <ul>
            <li>{data.description}</li>
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
        border: 3px solid #d9e7f8;
        border-radius: 16px;
        display: block;
        align-content: center;
        overflow: auto;
        margin-left: 10px;
    }

    .centered {
        text-align: center;
    }

    a {
        font-size: x-large;
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
