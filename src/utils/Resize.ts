import type { Size, MouseMoveData, WindowData } from "./Types";
import { ResizeState } from "./Types";

export function CheckWindowPadding(mouseData: MouseMoveData, WindowData: WindowData, set: (name: any)=> void) : ResizeState {
    let tempLeft = 0;
    let tempTop = 0;
    if (mouseData.offsetX < WindowData.padding) {
        if (mouseData.offsetY < WindowData.padding) {
            return setState(ResizeState.cornerTopLeft, "nw-resize", set);
        } else if ( mouseData.offsetY > WindowData.windowSize.height + WindowData.padding + WindowData.bar) {
            return setState(ResizeState.cornerBottomLeft, "sw-resize", set);
        } else {
            tempLeft = WindowData.windowPos.x + WindowData.windowSize.width + WindowData.padding;
            return setState(ResizeState.left, "w-resize", set);
        }
    } else if (mouseData.offsetX > WindowData.windowSize.width + WindowData.padding) {
        if (mouseData.offsetY < WindowData.padding) {
            return setState(ResizeState.cornerTopRight, "ne-resize", set);
        } else if ( mouseData.offsetY > WindowData.windowSize.height + WindowData.padding + WindowData.bar) {
            return setState(ResizeState.cornerBottomRight, "se-resize", set);
        } else {
            return setState(ResizeState.right, "w-resize", set);
        }
    } else {
        if (mouseData.offsetY < WindowData.padding) {
            tempTop = WindowData.windowPos.y + WindowData.windowSize.height + WindowData.padding;
            return setState(ResizeState.top, "n-resize", set);
        } else if (mouseData.offsetY > WindowData.windowSize.height + WindowData.padding + WindowData.bar) {
            return setState(ResizeState.bottom, "n-resize", set);
        } else {
            return setState(ResizeState.none, "default", set);
        }
    }
}

function setState(windowResizeState: ResizeState, name: string, set: (name: any)=> void) : ResizeState {
    set(name);
    return windowResizeState;
}

export function ResizeWindow(windowResizeState: ResizeState, mouseData: MouseMoveData, WindowData: WindowData, tempLeft: number, tempTop: number, resizeSet: (width: any, height: any)=> void, posSet: (x: any, y: any)=> void) {
    switch (windowResizeState) {
        case ResizeState.right: 
            resizeSet(mouseData.clientX - WindowData.windowPos.x - WindowData.padding, WindowData.windowSize.height);
            break;
        case ResizeState.bottom: 
            resizeSet(WindowData.windowSize.width, mouseData.clientY - WindowData.windowPos.y - WindowData.bar - WindowData.padding);
            break;
        case ResizeState.left: 
            posSet(mouseData.clientX - WindowData.padding, WindowData.windowPos.y);
            resizeSet(tempLeft - mouseData.clientX, WindowData.windowSize.height);
            break;
        case ResizeState.top:
            posSet(WindowData.windowPos.x, mouseData.clientY - WindowData.padding);
            resizeSet(WindowData.windowSize.width, tempTop - mouseData.clientY);
            break;
        case ResizeState.cornerTopLeft:
            posSet(mouseData.clientX - WindowData.padding, mouseData.clientY - WindowData.padding);
            resizeSet(tempLeft - mouseData.clientX, tempTop - mouseData.clientY);
            break;
        case ResizeState.cornerTopRight:
            posSet(WindowData.windowPos.x, mouseData.clientY - WindowData.padding);
            resizeSet(mouseData.clientX - WindowData.windowPos.x - WindowData.padding, tempTop - mouseData.clientY);
            break;
        case ResizeState.cornerBottomLeft:
            posSet(mouseData.clientX - WindowData.padding, WindowData.windowPos.y);
            resizeSet(tempLeft - mouseData.clientX, mouseData.clientY - WindowData.windowPos.y - WindowData.bar - WindowData.padding);
            break;
        case ResizeState.cornerBottomRight:
            resizeSet(mouseData.clientX - WindowData.windowPos.x - WindowData.padding, mouseData.clientY - WindowData.windowPos.y - WindowData.bar - WindowData.padding);
            break;
    }
}