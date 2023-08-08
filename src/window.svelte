<script lang="ts">
    import { windowStore } from "./store/windowStore";

    let isMouseDown = false;

    type MouseData = {
        clientX: number;
        clientY: number;
    };

    function moveWindow(ev: MouseData) {
        if (isMouseDown) {
            windowStore.set(ev.clientX, ev.clientY);
        }
    }

    function mouseDown() {
        isMouseDown = true;
    }

    function mouseUp() {
        isMouseDown = false;
    }

</script>
  
<div class="window" on:mousedown={mouseDown} on:mouseup={mouseUp} on:mousemove={moveWindow} on:mouseleave={mouseUp} style:left={`${$windowStore.x}px`} style:top={`${$windowStore.y}px`}>
    <div class="top-panel">
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