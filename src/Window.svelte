<script lang="ts">
    import {createWindowPositionStore, createWindowResizeStore, createCursorStore} from "./store/windowStore";
    import type {BarMouseMoveData, Size, MouseMoveData, MouseClickData, WindowData, WindowContentData} from "./utils/Types";
    import {CheckWindowPadding, ResizeWindow} from "./utils/Resize";
    import {ResizeState} from "./utils/Types";
    import WindowBar from "./WindowBar.svelte";
    import WindowContent from "./WindowContent.svelte";

    export let StartWindowHeight: number;
    export let StartWindowWidth: number;
    export let StartPosition: BarMouseMoveData;
    export let isResizable: boolean = false;
    export let getZindex: Function;
    export let Content: WindowContentData = null;

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
                let data = CheckWindowPadding(ev, WindowData, cursorStore.set);
                windowResizeState = data.state;
                tempLeft = data.tempLeft;
                tempTop = data.tempTop;
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
    <WindowBar on:mousedown={barMouseDown}/>
    <WindowContent windowResizeData={$windowResizeStore} Content={Content}/>
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
</style>