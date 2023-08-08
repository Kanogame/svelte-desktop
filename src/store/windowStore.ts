import {writable} from "svelte/store"

export const windowStore = createCustom();

function createCustom() {
    const s = writable({x: 0, y: 0});
    return {
        subscribe: s.subscribe,
        set: (x, y) => s.set({x: x, y: y}),
    }
}