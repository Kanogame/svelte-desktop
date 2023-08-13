<script lang="ts">
    import {writable} from "svelte/store"
    import {createWindowPositionStore, createWindowResizeStore, createCursorStore} from "./store/windowStore";
    import type {BarMouseMoveData, Size, MouseMoveData, MouseClickData} from "./utils/Types";
    import {ResizeState} from "./utils/Types";

    export let StartWindowHeight: number;
    export let StartWindowWidth: number;
    export let StartPosition: BarMouseMoveData;
    export let isResizable: boolean = false;
    export let getZindex: Function;

    const windowPositionStore = createWindowPositionStore();
    const windowResizeStore = createWindowResizeStore(StartWindowWidth, StartWindowHeight);
    const cursorStore = createCursorStore();
    let windowResizeState : ResizeState;
    let zIndex: number = 1;
    let isMouseDown = false;
    let isRMouseDown = false;
    let tempLeft: number;
    let tempTop: number;
    const padding = 6;
    const bar = 40;

    let windowSize: Size;
    windowResizeStore.subscribe((data) => {windowSize = data;})

    let windowPos = {x: 0, y: 0};
    windowPositionStore.subscribe((data) => {windowPos = data;})

    setWindowStartPosition(StartPosition); 
    let startOffset = {
        offsetX: 0,
        offsetY: 0
    }

    function windowResizeWindow(ev: MouseMoveData) {
        console.log(ev);
        if (windowResizeState == ResizeState.none) {
            return
        }
        isRMouseDown = !isRMouseDown;
        if (windowResizeState == ResizeState.cornerBottomRight) {
        }
    }

    

    function resizeWindow(windowResizeState: ResizeState, mouseData: MouseMoveData) {
        if (!isResizable) {
            return;
        }
        switch (windowResizeState) {
            case ResizeState.right: 
                windowResizeStore.set(mouseData.clientX - windowPos.x - padding, windowSize.height);
                break;
            case ResizeState.bottom: 
                windowResizeStore.set(windowSize.width, mouseData.clientY - windowPos.y - bar - padding);
                break;
            case ResizeState.left: 
                windowPositionStore.set(mouseData.clientX - padding, windowPos.y);
                windowResizeStore.set(tempLeft - mouseData.clientX, windowSize.height);
                break;
            case ResizeState.top:
                windowPositionStore.set(windowPos.x, mouseData.clientY - padding);
                windowResizeStore.set(windowSize.width, tempTop - mouseData.clientY);
                break;
            case ResizeState.cornerTopLeft:
                windowPositionStore.set(mouseData.clientX - padding, mouseData.clientY - padding);
                windowResizeStore.set(tempLeft - mouseData.clientX, tempTop - mouseData.clientY);
                break;
            case ResizeState.cornerTopRight:
                windowPositionStore.set(windowPos.x, mouseData.clientY - padding);
                windowResizeStore.set(mouseData.clientX - windowPos.x - padding, tempTop - mouseData.clientY);
                break;
            case ResizeState.cornerBottomLeft:
                windowPositionStore.set(mouseData.clientX - padding, windowPos.y);
                windowResizeStore.set(tempLeft - mouseData.clientX, mouseData.clientY - windowPos.y - bar - padding);
                break;
            case ResizeState.cornerBottomRight:
                windowResizeStore.set(mouseData.clientX - windowPos.x - padding, mouseData.clientY - windowPos.y - bar - padding);
                break;
        }
    }

    function barMoveWindow(ev: MouseMoveData) {
        if (isMouseDown) {
            windowPositionStore.set(ev.clientX - startOffset.offsetX - padding, ev.clientY - startOffset.offsetY - padding);
        }

        if (isRMouseDown) {
            resizeWindow(windowResizeState, ev);
        } else {
            checkWindowPadding(ev);
        }
    }

    function barMouseDown(ev: MouseClickData) {
        startOffset = {
            offsetX: ev.offsetX,
            offsetY: ev.offsetY
        }
        isMouseDown = true;
        zIndex = getZindex();
        cursorStore.set("move");
    }

    function barMouseUp() {
        isMouseDown = false;
        cursorStore.set("default");
    }

    function setWindowStartPosition(startPosition: BarMouseMoveData) {
        windowPositionStore.set(startPosition.clientX, startPosition.clientY);
    }

</script>
<div aria-hidden="true" class="window" style:z-index={`${zIndex}`} style:left={`${$windowPositionStore.x}px`} style:top={`${$windowPositionStore.y}px`} style:cursor={`${$cursorStore.cursor}`} on:mousedown={windowResizeWindow}>
    <div aria-hidden="true" class="top-panel" on:mousedown={barMouseDown}>
        <div class="title">title</div>
        <div class="buttons">
            <button>X</button>
            <button>F</button>
            <button>M</button>
        </div>
    </div>
    <div class="window-content" style:height={`${$windowResizeStore.height}px`} style:width={`${$windowResizeStore.width}px`}>
    </div>
</div>

<svelte:window on:mouseup={barMouseUp} on:mousemove={barMoveWindow} />
  
<style>
    .window {
        background-color: #2a94cd;
        padding: 6px;
        position: absolute;
        border: 1px solid white;
        cursor:default;
        user-select:none;
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