import { SendJSON } from "./start"

export function GenerateEvent(event: any, event_type: String) : any {
    return {
        type: "event", 
        payload: {
            event_type: event_type,
            payload: event
        },
    }
}

export function EventButtonClick(socket: WebSocket, role: String, WindowId) {
    SendJSON(socket, GenerateEvent({window_id: WindowId, button_role: role}, "button_click"));
}