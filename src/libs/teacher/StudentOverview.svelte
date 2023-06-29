<script>
    export let data = {
        username: '',
        assignments: [
            {
                name: '',
                uuid: '',
                attempts: []
            }
        ]
    }
</script>

<div class="body">
    <div style="display: flex;">
        <h5 style="margin: auto auto auto 5%;">{data.username}</h5>
    </div>
</div>


<style>
    .body {
        height: fit-content;
        padding: 10px;
        margin: 10px;
        border: 1px solid lightgrey;
        box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 3px;
    }
</style>