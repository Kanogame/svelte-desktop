export type Size = {
    width: number;
    height: number;
};

export type BarMouseMoveData = {
    clientX: number;
    clientY: number;
};

export type MouseClickData = {
    offsetX: number;
    offsetY: number;
}

export type MouseMoveData = {
    clientX: number;
    clientY: number;
    offsetX: number;
    offsetY: number;
}
export enum ResizeState {
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