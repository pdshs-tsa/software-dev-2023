<script>
    import { goto } from "$app/navigation";

    function nav(location) {
        goto(`admin/auth/${location}`);
    }
</script>

<div style="display: flex; margin: 10px;">
    <button class="button" on:click={() => nav('sets')}>Sets</button>
    <button class="button" on:click={() => nav('users')}>Users</button>
    <button class="button" on:click={() => nav('classes')}>Classes</button>
    <button class="button" on:click={() => nav('sessions')}>Sessions</button>
</div>

<style>
    .button {
        margin: 10px;
    }
</style>