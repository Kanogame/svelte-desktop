export function GenerateEvent(event: Event) : any {
    return {
        type: "event", 
        payload: event,
    }
}

export function EventButtonClick(socket: WebSocket, role: String, WindowId) {
    //todo
}