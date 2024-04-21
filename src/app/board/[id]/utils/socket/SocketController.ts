import SocketIOModel from "@/app/board/[id]/utils/socket/SocketIOModel";
import {fabric} from "fabric";

export default class SocketController {
    private model : SocketIOModel;

    constructor(canvas: fabric.Canvas, canvasID: string, model: SocketIOModel) {
        this.model = model;
        this.model.connected(canvasID)
    }

    public objectCreated(object: fabric.Object) {

        let obj = object.toDatalessObject(["uniboardData"])
        if (this.isFileObject(obj)) {
            let {objects, src, ...other} = obj;
            obj = other;
        }

        this.model.created(JSON.stringify(obj));
    }

    public objectModified(object : fabric.Object) {
        let obj = object.toObject(["uniboardData"]);
        if (object instanceof fabric.Path) {
            let {path, ...other} = obj;
            obj = other;
        }

        if (this.isFileObject(obj)) {
            let {objects, src, ...other} = obj;
            obj = other;
        }

        this.model.modified(JSON.stringify(obj));
    }

    private isFileObject(obj: any) {
        const fileObjects = ["uniboard/file", "uniboard/image", "uniboard/svg", "uniboard/stickyNote"];
        return fileObjects.includes(obj.uniboardData.type);
    }

    public objectRemoved(object: fabric.Object) {
        // @ts-ignore
        let id = object.uniboardData.id;
        this.model.deleted(id);
    }

    public disable() {
        this.model.disable();
    }
}