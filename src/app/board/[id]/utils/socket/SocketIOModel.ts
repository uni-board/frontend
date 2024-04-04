import {io, Socket} from "socket.io-client";
import ServerToClientEvents from "@/app/board/[id]/utils/socket/ServerToClientEvents";
import ClientToServerEvents from "@/app/board/[id]/utils/socket/ClientToServerEvents";
import {fabric} from "fabric";

export default class SocketIOModel implements ClientToServerEvents{
    private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

    constructor(eventsFromServerHandlers: ServerToClientEvents) {
        this.socket = io(`${process.env.NEXT_PUBLIC_SOCKET_HOST}:${process.env.NEXT_PUBLIC_SOCKET_PORT}`);
        this.setEventHandlers(eventsFromServerHandlers);
    }

    private setEventHandlers(eventsFromServerHandlers: ServerToClientEvents) {
        this.socket.on("created", eventsFromServerHandlers.created);

        this.socket.on('modified', eventsFromServerHandlers.modified);

        this.socket.on('deleted', eventsFromServerHandlers.deleted);
    }

    connected(id: string): void {
        this.socket.emit('connected', id);
    }

    created(json: string): void {
        this.socket.emit('created', json);
    }

    deleted(id: string): void {
        this.socket.emit('deleted', id);
    }

    modified(json: string): void {
        this.socket.emit('modified', json);
    }

    disable(): void {
        this.socket.close();
    }
}