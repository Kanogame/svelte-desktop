<script>
    export let windowResizeData;

    let content = {
        data: [{buttonX: 10,
        buttonY: 10,
        buttonW: 190,
        buttonH: 30,
        value: "test"
    }, ]
    };
</script>


<div class="window-content" style:height={`${windowResizeData.height}px`} style:width={`${windowResizeData.width}px`}>
    {#each content.data as item}
		<button class="window-el" style:width={`${item.buttonW}px`} style:height={`${item.buttonH}px`} 
        style:left={`${item.buttonX}px`} style:top={`${item.buttonY}px`}>{item.value}</button>
	{/each}
</div>

<style> 
    .window-el {
        position: absolute;
    }

    .window-content {
        background-color: white;
        width: 200px;
        height: 200px;
        position: relative;
    }
</style>