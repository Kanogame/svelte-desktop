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
    enum ResizeState {
        none = 0,
        top,
        cornerTopRight,
        right,
        cornerBottomRight, 
        bottom,
        cornerBottomLeft,
        left,
        cornerTopLeft,
    };
    
    export let startPosition: BarMouseMoveData;
    let windowSize = {
        SizeX: 200,
        SizeY: 200, 
    };
    setWindowStartPosition(startPosition); 
    let startOffset = {
        offsetX: 0,
        offsetY: 0
    }

    type BarMouseMoveData = {
        clientX: number;
        clientY: number;
    };

    type MouseClickData = {
        offsetX: number;
        offsetY: number;
    }

    type MouseMoveData = {
        clientX: number;
        clientY: number;
        offsetX: number;
        offsetY: number;
    };

    function windowMouseWindow(ev: MouseClickData) {
        let padding = 6;
        let bar = 40
        if (ev.offsetX < padding || ev.offsetX > windowSize.SizeX + padding) {
            
        }
        if (ev.offsetY < padding || ev.offsetY > windowSize.SizeX + padding + bar) {
            console.log("padding");
        }
    }

    function barMoveWindow(ev: BarMouseMoveData) {
        if (isMouseDown) {
            windowStore.set(ev.clientX - startOffset.offsetX, ev.clientY - startOffset.offsetY);
        }
    }

    function barMouseDown(ev: MouseClickData) {
        startOffset = {
            offsetX: ev.offsetX,
            offsetY: ev.offsetY
        }
        isMouseDown = true;
    }

    function barMouseUp() {
        isMouseDown = false;
    }

    function setWindowStartPosition(startPosition: BarMouseMoveData) {
        windowStore.set(startPosition.clientX, startPosition.clientY);
    }

</script>
  
<div class="window" style:left={`${$windowStore.x}px`} style:top={`${$windowStore.y}px`} on:mousemove={windowMouseWindow}>
    <div class="top-panel" on:mousedown={barMouseDown} on:mouseup={barMouseUp} on:mousemove={barMoveWindow} on:mouseleave={barMouseUp}>
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