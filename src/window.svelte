<script lang="ts">
    import {writable} from "svelte/store"
    import {createWindowPositionStore, createWindowResizeStore, createCursorStore} from "./store/windowStore";
    import type {BarMouseMoveData, Size, MouseMoveData, MouseClickData, WindowData} from "./utils/Types";
    import {ResizeState} from "./utils/Types";
    import {CheckWindowPadding, ResizeWindow} from "./utils/Resize";

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
        isRMouseDown = true;
    }

    let WindowData: WindowData;

    $: WindowData = {
        windowPos: $windowPositionStore,
        windowSize: $windowResizeStore,
        padding: 6,
        bar: 40,
    } 

    function barMoveWindow(ev: MouseMoveData) {
        if (isMouseDown) {
            windowPositionStore.set(ev.clientX - startOffset.offsetX - padding, ev.clientY - startOffset.offsetY - padding);
        }
        if (isResizable) {
            if (isRMouseDown) {
                ResizeWindow(windowResizeState, ev, WindowData, tempLeft, tempTop, windowResizeStore.set, windowPositionStore.set);
            } else {
                windowResizeState = CheckWindowPadding(ev, WindowData, cursorStore.set);
                //console.log(data);
            }
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
        isRMouseDown = false;
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