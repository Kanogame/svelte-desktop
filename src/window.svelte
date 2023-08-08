<script lang="ts">
    import { windowStore } from "./store/windowStore";

    let isMouseDown = false;

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

</script>
  
<div class="window" style:left={`${$windowStore.x}px`} style:top={`${$windowStore.y}px`} on:mousedown={mouseDown} on:mouseup={mouseUp} on:mousemove={moveWindow} on:mouseleave={mouseUp}>
    <div class="top-panel" >
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