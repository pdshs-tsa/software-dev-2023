<script>
    import {goto} from "$app/navigation";

    export let data = {
        assigned: [],
        code: '',
        name: '',
        owner: '',
        students: []
    };

    export let onClick = () => {
        goto(`/class/${data.code}`);
    }
</script>

<div class="body" on:click={onClick} on:keydown={onClick}>
    <div class="centered">
        <h3>{data.name}</h3>
    </div>
    <hr>
    <div>
        <ul>
            <li>Join code is <strong>{data.code}</strong></li>
            <li><strong>{(data.students.length > 0) ? data.students.length : "No"} student{(data.students.length === 1) ? "" : "s"}</strong> {(data.students.length === 1) ? "is" : "are"} part of the class</li>
            <li><strong>{(data.assigned.length > 0) ? data.assigned.length : "No"} set{(data.assigned.length === 1) ? "" : "s"}</strong> assigned to the class</li>
        </ul>
    </div>
</div>

<style>
    .body{
        width: 300px;
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
