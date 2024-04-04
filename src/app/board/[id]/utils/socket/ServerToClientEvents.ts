interface ServerToClientEvents {
    created: (objectAsJSON: string) => void;
    modified: (objectAsJSON: string) => void;
    deleted: (objectId: string) => void;
}

export default ServerToClientEvents;