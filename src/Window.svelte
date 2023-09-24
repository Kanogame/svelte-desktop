<script lang="ts">
    import {createWindowPositionStore, createWindowResizeStore, createCursorStore} from "./store/windowStore";
    import type {BarMouseMoveData, Size, MouseMoveData, MouseClickData, WindowArgs, WindowContentData} from "./utils/WindowTypes";
    import {CheckWindowPadding, ResizeWindow, CalculateMinimalSize} from "./utils/Resize";
    import { createEventDispatcher } from "svelte";
    import {ResizeState} from "./utils/WindowTypes";
    import WindowBar from "./WindowBar.svelte";
    import WindowContent from "./WindowContent.svelte";

    export let WindowId: number;
    export let StartWindowHeight: number;
    export let StartWindowWidth: number;
    export let StartPosition: BarMouseMoveData;
    export let isResizable: boolean = false;
    export let getZindex: Function;
    export let Content: WindowContentData = null;

    const windowPositionStore = createWindowPositionStore();
    const windowResizeStore = createWindowResizeStore(StartWindowWidth, StartWindowHeight);
    const MinimalSize = CalculateMinimalSize(Content);
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
        if (windowResizeState == ResizeState.none) {
            return
        }
        isRMouseDown = true;
    }

    let WindowData: WindowArgs;

    $: WindowData = {
        windowPos: $windowPositionStore,
        windowSize: $windowResizeStore,
        padding: 6,
        bar: 40,
    } 

    $: if ($windowResizeStore.width < MinimalSize.width + 30) {windowResizeStore.set(MinimalSize.width + 30, $windowResizeStore.height)};

    $: if ($windowResizeStore.height < MinimalSize.height + 30) {windowResizeStore.set($windowResizeStore.width, MinimalSize.height + 30); console.log("1233")};

    function barMoveWindow(ev: MouseMoveData) {
        if (isMouseDown) {
            windowPositionStore.set(ev.clientX - startOffset.offsetX - padding, ev.clientY - startOffset.offsetY - padding);
        }
        if (!isResizable) {
            return;
        }
        if (isRMouseDown) {
            ResizeWindow(windowResizeState, ev, WindowData, tempLeft, tempTop, windowResizeStore.set, windowPositionStore.set);
        } else {
            let data = CheckWindowPadding(ev, WindowData, cursorStore.set);
            windowResizeState = data.state;
            tempLeft = data.tempLeft;
            tempTop = data.tempTop;
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

    const dispatch = createEventDispatcher();

    function ButtonClick(role: any) {
        dispatch("event", {eventType: "buttonClick", role: role.detail, windowId: WindowId});
    }

</script>
<div aria-hidden="true" class="window" style:z-index={`${zIndex}`} style:left={`${$windowPositionStore.x}px`} style:top={`${$windowPositionStore.y}px`} style:cursor={`${$cursorStore.cursor}`} on:mousedown={windowResizeWindow}>
    <WindowBar on:mousedown={barMouseDown}/>
    <WindowContent on:buttonClick={ButtonClick} windowResizeData={$windowResizeStore} Content={Content}/>
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