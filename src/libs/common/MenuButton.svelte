<button on:click={goto(endpoint)} on:keypress={goto(endpoint)}>{text}</button>

<script>
    import { goto } from "$app/navigation"
    export let text;
    export let endpoint;
</script>

<style>
    button {
        border: 1px;
        color: white;
        horiz-align: center;
        vertical-align: middle;
        display: inline;
        background-color: #98c1d9;
        font-size: large;
        font-weight: bold;
        align-content: center;
        padding: 1em;
        margin: 0 5px;
        height: 100%;
        border-radius: 8px;
        transition: background-color 0.25s;
    }

    button:hover{
        background-color: #8ab0c6;
    }
</style>