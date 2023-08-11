<script lang="ts">
    import {writable} from "svelte/store"
    import {createWindowPositionStore, createWindowResizeStore} from "./store/windowStore";
    import type {BarMouseMoveData, Size, MouseMoveData, MouseClickData} from "./utils/types";
    import {ResizeState} from "./utils/types";

    export let StartWindowHeight: number;
    export let StartWindowWidth: number;
    export let startPosition: BarMouseMoveData;
    export let isResizable: boolean = false;

    const windowPositionStore = createWindowPositionStore();
    const windowResizeStore = createWindowResizeStore(StartWindowWidth, StartWindowHeight);
    let windowResizeState : ResizeState;
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

    setWindowStartPosition(startPosition); 
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

    function windowMousePaddingHover(ev: MouseMoveData) {
        if (isRMouseDown) {
            resizeWindow(windowResizeState, ev);
        } else {
            checkWindowPadding(ev);
        }
    }

    function checkWindowPadding(mouseData: MouseMoveData) {
        if (!isResizable) {
            return;
        }
        if (mouseData.offsetX < padding) {
            if (mouseData.offsetY < padding) {
                windowResizeState = ResizeState.cornerTopLeft;
            } else if ( mouseData.offsetY > windowSize.height + padding + bar) {
                windowResizeState = ResizeState.cornerBottomLeft;
            } else {
                windowResizeState = ResizeState.left;
                tempLeft = windowPos.x + windowSize.width + padding;
            }
        } else if (mouseData.offsetX > windowSize.width + padding) {
            if (mouseData.offsetY < padding) {
                windowResizeState = ResizeState.cornerTopRight;
            } else if ( mouseData.offsetY > windowSize.height + padding + bar) {
                windowResizeState = ResizeState.cornerBottomRight;
            } else {
                windowResizeState = ResizeState.right;
            }
        } else {
            if (mouseData.offsetY < padding) {
                windowResizeState = ResizeState.top;
                tempTop = windowPos.y + windowSize.height + padding;
            } else if ( mouseData.offsetY > windowSize.height + padding + bar) {
                windowResizeState = ResizeState.bottom;
            } else {
                windowResizeState = ResizeState.none;
            }
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

    function barMoveWindow(ev: BarMouseMoveData) {
        if (isMouseDown) {
            windowPositionStore.set(ev.clientX - startOffset.offsetX, ev.clientY - startOffset.offsetY);
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
        windowPositionStore.set(startPosition.clientX, startPosition.clientY);
    }

</script>
  
<div class="window" style:left={`${$windowPositionStore.x}px`} style:top={`${$windowPositionStore.y}px`} on:mousemove={windowMousePaddingHover} on:mousedown={windowResizeWindow}>
    <div class="top-panel" on:mousedown={barMouseDown} on:mouseup={barMouseUp} on:mousemove={barMoveWindow} on:mouseleave={barMouseUp}>
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
  
<style>
    .window {
        background-color: #2a94cd;
        padding: 6px;
        position: absolute;
        border: 1px solid white;
        cursor: w-resize;
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