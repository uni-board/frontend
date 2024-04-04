interface ClientToServerEvents {
    connected: (id: string) => void;
    created: (json: string) => void;
    modified: (json: string) => void;
    deleted: (id: string) => void;
}

export default ClientToServerEvents;