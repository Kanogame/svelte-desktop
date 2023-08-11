<script lang="ts">
    import {writable} from "svelte/store"
    import {createWindowPositionStore, createWindowResizeStore, createCursorStore} from "./store/windowStore";
    import type {BarMouseMoveData, Size, MouseMoveData, MouseClickData} from "./utils/types";
    import {ResizeState} from "./utils/types";

    export let StartWindowHeight: number;
    export let StartWindowWidth: number;
    export let startPosition: BarMouseMoveData;
    export let isResizable: boolean = false;

    const windowPositionStore = createWindowPositionStore();
    const windowResizeStore = createWindowResizeStore(StartWindowWidth, StartWindowHeight);
    const cursorStore = createCursorStore();
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
                cursorStore.set("nw-resize");
            } else if ( mouseData.offsetY > windowSize.height + padding + bar) {
                windowResizeState = ResizeState.cornerBottomLeft;
                cursorStore.set("sw-resize");
            } else {
                windowResizeState = ResizeState.left;
                cursorStore.set("w-resize");
                tempLeft = windowPos.x + windowSize.width + padding;
            }
        } else if (mouseData.offsetX > windowSize.width + padding) {
            if (mouseData.offsetY < padding) {
                windowResizeState = ResizeState.cornerTopRight;
                cursorStore.set("ne-resize")
            } else if ( mouseData.offsetY > windowSize.height + padding + bar) {
                windowResizeState = ResizeState.cornerBottomRight;
                cursorStore.set("se-resize");
            } else {
                windowResizeState = ResizeState.right;
                cursorStore.set("w-resize");
            }
        } else {
            if (mouseData.offsetY < padding) {
                windowResizeState = ResizeState.top;
                cursorStore.set("n-resize");
                tempTop = windowPos.y + windowSize.height + padding;
            } else if ( mouseData.offsetY > windowSize.height + padding + bar) {
                windowResizeState = ResizeState.bottom;
                cursorStore.set("n-resize");
            } else {
                windowResizeState = ResizeState.none;
                cursorStore.set("default");
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
            windowPositionStore.set(ev.clientX - startOffset.offsetX - padding, ev.clientY - startOffset.offsetY - padding);
        }
    }

    function barMouseDown(ev: MouseClickData) {
        startOffset = {
            offsetX: ev.offsetX,
            offsetY: ev.offsetY
        }
        isMouseDown = true;
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
<div aria-hidden="true" class="window" style:left={`${$windowPositionStore.x}px`} style:top={`${$windowPositionStore.y}px`} style:cursor={`${$cursorStore.cursor}`} on:mousemove={windowMousePaddingHover} on:mousedown={windowResizeWindow}>
    <div aria-hidden="true" class="top-panel" on:mousedown={barMouseDown} on:mouseup={barMouseUp} on:mousemove={barMoveWindow} on:mouseleave={barMouseUp}>
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
        cursor:default;
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