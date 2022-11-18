<nav on:click={goto(endpoint)}>{text}</nav>

<script>
    import { goto } from "$app/navigation"
    export let text;
    export let endpoint;
</script>

<style>
    nav {
        border: 1px;
        color: white;
        horiz-align: center;
        vertical-align: middle;
        display: inline;
        background-color: #98c1d9;
        font-size: large;
        align-content: center;
        padding: 1em;
        margin: 0;
        margin-left: 10px;
        height: 100%;
        border-radius: 8px;
        transition: background-color 0.5s;
    }

    nav:hover{
        background-color: #8ab0c6;
        cursor: pointer;
    }
</style>