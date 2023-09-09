import {writable} from "svelte/store"

export const customStore = createEventStore();

function createEventStore() {
    const s = writable<number[]>([]);
    return {
        subscribe: s.subscribe,
        add: (val: number) => s.update(v => [...v, val]),
        reduce: () => s.update(v => {v.pop(); return v}),
    }
}