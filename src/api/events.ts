export function GenerateEvent(event: Event) {
    return {
        type: "event", 
        payload: event,
    }
}