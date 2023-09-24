import {WS_URL} from "../static.json";

export function Initialize() : any {
    const UUID = generateUUID();
    const socket = new WebSocket(WS_URL);
    socket.addEventListener("open", () => {
        socket.send(UUID);
    })
    return {UUID: UUID, socket: socket}
}

function generateUUID(): string {
    return crypto.randomUUID();
}

export function SendJSON(socket: WebSocket, data: any) {
    console.log(data);
    socket.send(JSON.stringify(data));
}