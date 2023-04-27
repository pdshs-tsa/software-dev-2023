<script>

</script>

<div class="body">
    <h2>Join a Class</h2>
    <form method="POST">
        <input name="class-code" class="info" type="text" placeholder="Class Code">

        <div class="centered">
            <button class="action-button" type="submit">Join class</button>
        </div>
    </form>
</div>


<style>
    h2 {
        font-size: xxx-large;
        color: black;
        text-align: center;
        margin: auto auto 20px;
    }

    .info {
        vertical-align: middle;
        font-family: "Courier New", "monospace";
        color: black;
        font-size: x-large;
        text-align: center;
        width: 400px;
        background: white;
        display: block;
        margin: 10px auto 10px;
    }

    .action-button {
        margin: auto 30px;
        width: fit-content;
    }

    .centered {
        padding: 10px;
        display: flex;
        justify-content: center;
    }

    .body {
        margin-top: 5vh;
        display: block;
    }
</style>