import SocketIOModel from "@/app/board/[id]/utils/socket/SocketIOModel";
import {fabric} from "fabric";

export default class SocketController {
    private model : SocketIOModel;

    constructor(canvas: fabric.Canvas, canvasID: string, model: SocketIOModel) {
        this.model = model;
        this.model.connected(canvasID)
    }

    public objectCreated(object: fabric.Object) {
        this.model.created(JSON.stringify(object.toDatalessObject(["uniboardData"])))
    }

    public objectModified(object : fabric.Object) {
        let obj = object.toObject(["uniboardData"]);
        if (object instanceof fabric.Path) {
            let {path, ...other} = obj;
            obj = other;
        }

        this.model.modified(JSON.stringify(obj));
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