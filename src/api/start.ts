import {WS_URL} from "../static.json";

function Initialize() : WebSocket {
    const socket = new WebSocket(WS_URL);

    return socket
}
