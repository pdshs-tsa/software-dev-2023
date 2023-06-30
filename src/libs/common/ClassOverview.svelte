<script>
    export let classData;
</script>

<div style="box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 3px; border: 1px solid lightgrey; margin: 10px">
     <div class="box">
        <a href="/class/{classData.code}" style="font-size: xx-large">{classData.name}</a>
        <div>
            <strong>Students</strong>: {classData.students.length}
            <br>
            <strong>Code</strong>: {classData.code}
        </div>
    </div>
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