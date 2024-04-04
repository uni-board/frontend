import EllipseTool from "@/app/board/[id]/utils/tools/figure-tools/EllipseTool";
import {Canvas} from "fabric/fabric-impl";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import {fabric} from "fabric";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";

export default class CircleTool extends EllipseTool {

    constructor(canvas: Canvas, optionsController: OptionsController, socketController: SocketController) {
        super(canvas, optionsController, socketController);
    }

    protected calculateSettings(pointer: { x: number; y: number }): Partial<fabric.Ellipse> {
        let radius = Math.max(Math.abs(this.origX - pointer.x)/2, Math.abs(this.origY - pointer.y)/2)
        let settings : Partial<fabric.Ellipse> = {
            rx:  radius,
            ry: radius,
        };

        if (pointer.x < this.origX) {
            settings.left = pointer.x;
        }

        if (pointer.y < this.origY) {
            settings.top = pointer.y;
        }

        return settings;
    }
}