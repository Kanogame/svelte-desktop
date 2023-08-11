import {writable} from "svelte/store"

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