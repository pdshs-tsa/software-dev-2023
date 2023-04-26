<script>
    export let classData;
</script>

<div>
    <div class="box">
        <a href="/class/{classData.code}" style="font-size: xx-large">{classData.name}</a>
        <div>
            <strong>Students</strong>: {classData.students.length}
            <br>
            <strong>Code</strong>: {classData.code}
        </div>
    </div>
    <hr>
</div>

<style>
    .box {
        padding: 1vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    hr {
        border: 1px solid lightgrey;
    }
</style>