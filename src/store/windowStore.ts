import {writable} from "svelte/store"
import type { WindowData, WindowContentData } from "../utils/WindowTypes";

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
    const s = writable(new Map());
    return {
        subscribe: s.subscribe,
        addWindow: (val: WindowData) => s.update(v => v.set(val.id, val)),
        removeWindow: (Id: number) => s.update(v => new Map([...v].filter(([k, _]) => k != Id))),
        changewindow: (Id: number, content: WindowContentData) => s.update(v => new Map([...v].map(([_, val]) => val = val.id == Id ? {id: val.id, content: content} : val))),
        getWindowContent: (Id: number) => {return s.subscribe[Id]},
        //todo: clear, changeWindow
    }
}