import type { WindowData } from "./WindowTypes"

export interface Event {
    event_id: number,		
	event_type: string,		
}

export interface EventNewWindow extends Event {
    payload: WindowData,
}
