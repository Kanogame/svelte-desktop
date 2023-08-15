<script>
    export let windowResizeData;
</script>


<div class="window-content" style:height={`${windowResizeData.height}px`} style:width={`${windowResizeData.width}px`}>
</div>

<style> 
    .window-content {
        background-color: white;
        width: 200px;
        height: 200px;
    }
</style>