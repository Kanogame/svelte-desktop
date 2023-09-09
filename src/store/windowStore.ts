import {writable} from "svelte/store"
import type { WindowData } from "../utils/WindowTypes";

export function createWindowPositionStore() {
    const s = writable({x: 0, y: 0});
    return {
        subscribe: s.subscribe,
        set: (x, y) => s.set({x: x, y: y}),
    }
}

export function createWindowResizeStore(startWidth: number, startHeight: number) {
    const s = writable({width: startWidth, height: startHeight});
    return {
        subscribe: s.subscribe,
        set: (width, height) => s.set({width: width, height: height}),
    }
}


export function createCursorStore() {
    const s = writable({cursor: "default"});
    return {
        subscribe: s.subscribe,
        set: (cursor) => s.set({cursor: cursor}),
    }
}

export const DesktopStore = createDesktopStore();

function createDesktopStore() {
    const s = writable<WindowData[]>([]);
    return {
        subscribe: s.subscribe,
        addWindow: (val: WindowData) => s.update(v => [...v, val]),
        removeWindow: (Id: number) => s.update(v => v.filter((window) => window.id != Id)),
        //todo: clear, changeWindow
    }
}