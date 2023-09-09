<script lang="ts">
    import type {WindowContentData} from "./utils/WindowTypes";
    export let windowResizeData;
    export let Content: WindowContentData;
</script>


<div class="window-content" style:height={`${windowResizeData.height}px`} style:width={`${windowResizeData.width}px`}>
    {#if Content}
    {#each Content.buttons as item}
		<button class="window-el" style:width={`${item.Width}px`} style:height={`${item.Height}px`} 
        style:left={`${item.Position.x}px`} style:top={`${item.Position.y}px`}>{item.title}</button>
	{/each}

    {#each Content.blocks as item}
		<p class="window-el" style:font-size={`${item.FontSize}px`}
        style:left={`${item.Position.x}px`} style:top={`${item.Position.y}px`}>{item.title}</p>
	{/each}
    {/if}
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