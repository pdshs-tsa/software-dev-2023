<script>
    /** @type {import('./$types').PageData} */
    export let data;

    $: user = data.user;
</script>

<h2>Hello, {user.username}</h2>

