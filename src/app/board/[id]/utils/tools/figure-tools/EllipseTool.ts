import AbstractFigureTool from "@/app/board/[id]/utils/tools/figure-tools/AbstractFigureTool";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import {Canvas} from "fabric/fabric-impl";
import {fabric} from "fabric";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";

export default class EllipseTool extends AbstractFigureTool<fabric.Ellipse>{


    constructor(canvas: Canvas, optionsController: OptionsController, socketController: SocketController) {
        super(canvas, optionsController, 'ellipse', socketController);
    }

    protected calculateSettings(pointer: { x: number; y: number }): Partial<fabric.Ellipse> {
        let settings : Partial<fabric.Ellipse> = {
            rx:  Math.abs(this.origX - pointer.x)/2,
            ry: Math.abs(this.origY - pointer.y)/2,
        };


        if (pointer.x < this.origX) {
            settings.left = pointer.x;
        }

        if (pointer.y < this.origY) {
            settings.top = pointer.y;
        }

        return settings;
    }

    protected initFigure(): fabric.Ellipse {
        return new fabric.Ellipse({
            stroke: this.optionsController.get("currentColor"),
            strokeWidth: this.optionsController.get("currentWidth"),
            fill: this.optionsController.get("fill") ? this.optionsController.get("currentColor") : 'transparent',
            left: this.origX,
            top: this.origY,
            rx: 0,
            ry: 0,
            selectable: false,
        })
    }
}