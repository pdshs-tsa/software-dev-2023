<script>
    /** @type {import('./$types').PageData} */
    export let data;

    $: user = data.user;
</script>

//TODO: add a "your sets" page
<h2>Hello, {user.username}</h2>

