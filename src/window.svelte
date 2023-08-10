<script lang="ts">
    import {writable} from "svelte/store"

    const windowPositionStore = createWindowPositionStore();
    const windowResizeStore = createWindowResizeStore();

    function createWindowPositionStore() {
        const s = writable({x: 0, y: 0});
        return {
            subscribe: s.subscribe,
            set: (x, y) => s.set({x: x, y: y}),
        }
    }

    function createWindowResizeStore() {
        const s = writable({width: 200, height: 200});
        return {
            subscribe: s.subscribe,
            set: (width, height) => s.set({width: width, height: height}),
        }
    }
    let windowSize: Size;
    windowResizeStore.subscribe((data) => {windowSize = data;})

    let windowPos = {x: 0, y: 0};
    windowPositionStore.subscribe((data) => {windowPos = data;})

    type Size = {
        width: number;
        height: number;
    };

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
    }

    let isMouseDown = false;
    let windowResizeState : ResizeState;
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
    setWindowStartPosition(startPosition); 
    let startOffset = {
        offsetX: 0,
        offsetY: 0
    }

    let isRMouseDown= false;

    function windowResizeWindow(ev: MouseMoveData) {
        let padding = 6;
        let bar = 40
        console.log(ev);
        if (windowResizeState == ResizeState.none) {
            return
        }
        isRMouseDown = !isRMouseDown;
        if (windowResizeState == ResizeState.cornerBottomRight) {
        }
    }

    function windowMousePaddingHover(ev: MouseMoveData) {
        let padding = 6;
        let bar = 40
        if (!isRMouseDown) {
            if (ev.offsetX < padding) {
                if (ev.offsetY < padding) {
                    windowResizeState = ResizeState.cornerTopLeft;
                } else if ( ev.offsetY > windowSize.height + padding + bar) {
                    windowResizeState = ResizeState.cornerBottomLeft;
                } else {
                    windowResizeState = ResizeState.left;
                }
            } else if (ev.offsetX > windowSize.width + padding) {
                if (ev.offsetY < padding) {
                    windowResizeState = ResizeState.cornerTopRight;
                } else if ( ev.offsetY > windowSize.height + padding + bar) {
                    windowResizeState = ResizeState.cornerBottomRight;
                } else {
                    windowResizeState = ResizeState.right;
                }
            } else {
                if (ev.offsetY < padding) {
                    windowResizeState = ResizeState.top;
                } else if ( ev.offsetY > windowSize.height + padding + bar) {
                    windowResizeState = ResizeState.bottom;
                } else {
                    windowResizeState = ResizeState.none;
                }
            }
        }

        if (isRMouseDown) {
            if (windowResizeState == ResizeState.right) {
                windowResizeStore.set(ev.clientX - windowPos.x - padding, windowSize.height);
                console.log(windowResizeState);
            } else if (windowResizeState == ResizeState.bottom){
                windowResizeStore.set(windowSize.width, ev.clientY - windowPos.y - bar - padding);
            }
            //windowResizeStore.set(ev.clientX - windowPos.x - padding, ev.clientY - windowPos.y - bar - padding);
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
        console.log("up");
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