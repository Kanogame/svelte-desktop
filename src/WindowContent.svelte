<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type {WindowContentData} from "./utils/WindowTypes";
    export let windowResizeData;
    export let Content: WindowContentData;

    const dispatch = createEventDispatcher();

    function buttonClick(role: String) {
        dispatch("buttonClick", role);
    }
</script>


<div class="window-content" style:height={`${windowResizeData.height}px`} style:width={`${windowResizeData.width}px`}>
    {#if Content}
    {#each Content.buttons as item}
        {#if item.clickable}
		<button on:click={() => buttonClick(item.role)} class="window-el" style:width={`${item.Size.width}px`} style:height={`${item.Size.height}px`} 
        style:left={`${item.Position.x}px`} style:top={`${item.Position.y}px`}>{item.title}</button>
        {:else}
        <button class="window-el" style:width={`${item.Size.width}px`} style:height={`${item.Size.height}px`} 
        style:left={`${item.Position.x}px`} style:top={`${item.Position.y}px`}>{item.title}</button>
        {/if}
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