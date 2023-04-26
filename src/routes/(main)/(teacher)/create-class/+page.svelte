<script>
    import { page } from '$app/stores';
    const user = $page.data.user;
</script>

<div class="body">
    <h2>Create a new class</h2>
    <form method="POST">
        <p style="font-size: medium; margin: 10px; text-align: center">The class name helps you organize the classes you create</p>
        <input name="name" class="info" type="text" placeholder="Class Name">
        <button type="submit" class="action-button">Create</button>
    </form>
</div>

<style>
    .body {
        display: flex;
        align-content: center;
        align-items: center;
        flex-direction: column;
    }

    .info {
        vertical-align: middle;
        font-family: "Courier New", "monospace";
        color: black;
        font-size: x-large;
        text-align: center;
        width: 30vw;
        background: white;
        display: block;
        margin: auto auto 10px;
    }

    h2 {
        font-size: xxx-large;
        color: black;
        text-align: center;
        margin-bottom: auto;
    }

    .action-button {
        width: 50%;
        margin: auto;
    }
</style>