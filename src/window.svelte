<script lang="ts">
    import {writable} from "svelte/store"

    const windowStore = createCustom();

    function createCustom() {
        const s = writable({x: 0, y: 0});
        return {
            subscribe: s.subscribe,
            set: (x, y) => s.set({x: x, y: y}),
        }
    }

    let isMouseDown = false;

    export let startPosition: MouseMoveData;
    setStartPosition(startPosition); 
    let startOffset = {
        offsetX: 0,
        offsetY: 0
    }

    type MouseMoveData = {
        clientX: number;
        clientY: number;
        
    };

    type MouseClickData = {
        offsetX: number;
        offsetY: number;
    }

    function moveWindow(ev: MouseMoveData) {
        if (isMouseDown) {
            windowStore.set(ev.clientX - startOffset.offsetX, ev.clientY - startOffset.offsetY);
        }
    }

    function mouseDown(ev: MouseClickData) {
        startOffset = {
            offsetX: ev.offsetX,
            offsetY: ev.offsetY
        }
        isMouseDown = true;
    }

    function mouseUp() {
        isMouseDown = false;
    }

    function setStartPosition(startPosition: MouseMoveData) {
        windowStore.set(startPosition.clientX, startPosition.clientY);
    }

</script>
  
<div class="window" style:left={`${$windowStore.x}px`} style:top={`${$windowStore.y}px`}>
    <div class="top-panel"  on:mousedown={mouseDown} on:mouseup={mouseUp} on:mousemove={moveWindow} on:mouseleave={mouseUp}>
        <div class="title">title</div>
        <div class="buttons">
            <button>X</button>
            <button>F</button>
            <button>M</button>
        </div>
    </div>
    <div class="window-content">
    </div>
</div>
  
<style>
    .window {
        background-color: #2a94cd;
        padding: 6px;
        position: absolute;
        border: 1px solid white;
    }

    .top-panel {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .window-content {
        background-color: white;
        width: 200px;
        height: 200px;
    }
</style>