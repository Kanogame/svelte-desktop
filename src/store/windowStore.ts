import {writable} from "svelte/store"

export function createWindowPositionStore() {
    const s = writable({x: 0, y: 0});
    return {
        subscribe: s.subscribe,
        set: (x, y) => s.set({x: x, y: y}),
    }
}

export function createWindowResizeStore() {
    const s = writable({width: 200, height: 200});
    return {
        subscribe: s.subscribe,
        set: (width, height) => s.set({width: width, height: height}),
    }
}