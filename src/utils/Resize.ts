import type { Size, MouseMoveData } from "./Types";
import { ResizeState } from "./Types";

function checkWindowPadding(windowResizeState: ResizeState, mouseData: MouseMoveData, padding: number, bar: number, windowSize: Size, set: (name: string)=> {}) : ResizeState {
    if (mouseData.offsetX < padding) {
        if (mouseData.offsetY < padding) {
            return setState(ResizeState.cornerTopLeft, "nw-resize", set);
        } else if ( mouseData.offsetY > windowSize.height + padding + bar) {
            return setState(ResizeState.cornerBottomLeft, "sw-resize", set);
        } else {
            //tempLeft = windowPos.x + windowSize.width + padding;
            return setState(ResizeState.left, "w-resize", set);
        }
    } else if (mouseData.offsetX > windowSize.width + padding) {
        if (mouseData.offsetY < padding) {
            return setState(ResizeState.cornerTopRight, "ne-resize", set);
        } else if ( mouseData.offsetY > windowSize.height + padding + bar) {
            return setState(ResizeState.cornerBottomRight, "se-resize", set);
        } else {
            return setState(ResizeState.right, "w-resize", set);
        }
    } else {
        if (mouseData.offsetY < padding) {
            //tempTop = windowPos.y + windowSize.height + padding;
            return setState(ResizeState.top, "n-resize", set);
        } else if (mouseData.offsetY > windowSize.height + padding + bar) {
            return setState(ResizeState.bottom, "n-resize", set);
        } else {
            return setState(ResizeState.none, "default", set);
        }
    }
}

function setState(windowResizeState: ResizeState, name: string, set: (name: string)=> {}) : ResizeState {
    set(name);
    return windowResizeState;
}