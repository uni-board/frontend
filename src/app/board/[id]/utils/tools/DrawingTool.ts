import {Canvas, IEvent} from "fabric/fabric-impl";
import AbstractTool from "@/app/board/[id]/utils/tools/AbstractTool";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import {fabric} from "fabric";
import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import {v4 as uuidv4} from "uuid";
import SwitchableTool from "@/app/board/[id]/utils/tools/marker-intefaces/SwitchableTool";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";

export default class DrawingTool extends AbstractTool implements SwitchableTool{

    protected type: string;

    constructor(canvas: Canvas, optionsController: OptionsController, socketController: SocketController) {
        super(canvas, optionsController, socketController);
        this.type = 'path';
    }

    disable(): void {
        this.canvas.isDrawingMode = false;
        this.canvas.off("path:created");
    }

    enable(): void {
        this.canvas.freeDrawingBrush.width = this.optionsController.get("currentWidth");
        this.canvas.freeDrawingBrush.color = this.optionsController.get("currentColor");
        this.canvas.isDrawingMode = true;
        this.canvas.on("path:created", (e : IEvent) => {
            // @ts-ignore
            let path = e["path"];
            if (path && path instanceof fabric.Path) {
                this.canvas.remove(path);
                let newObject : fabric.Path & UniboardData = Object.assign(path, {
                    uniboardData: {
                        id: uuidv4(),
                        creator: "2",
                        persistedOnServer: false,
                        type: this.type,
                    }
                });
                this.canvas.add(newObject);
                this.socketController.objectCreated(newObject);
            }
        })
    }
}