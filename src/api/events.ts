import { SendJSON } from "./start"

export function UUIDWrapper(UUID: string, data: any): any {
    return {
        UUID: UUID,
        payload: data,
    }
}

export function GenerateEvent(event: any, event_type: String) : any {
    return {
        type: "event", 
        payload: {
            event_type: event_type,
            payload: event
        },
    }
}

export function EventButtonClick(socket: WebSocket, role: String, WindowId, UUID: string) {
    SendJSON(socket, UUIDWrapper(UUID, GenerateEvent({window_id: WindowId, button_role: role}, "button_click")));
}