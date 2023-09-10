import {WS_URL} from "../static.json";

export function Initialize() : WebSocket {
    const socket = new WebSocket(WS_URL);
    socket.addEventListener("open", () => {
        socket.send("online");
    })
    return socket
}
