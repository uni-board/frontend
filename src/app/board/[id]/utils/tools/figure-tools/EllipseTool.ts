import AbstractFigureTool from "@/app/board/[id]/utils/tools/figure-tools/AbstractFigureTool";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import {Canvas} from "fabric/fabric-impl";
import {fabric} from "fabric";

export default class EllipseTool extends AbstractFigureTool<fabric.Ellipse>{


    constructor(canvas: Canvas, optionsController: OptionsController) {
        super(canvas, optionsController, 'ellipse');
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
            stroke: this.optionsController.options.currentColor,
            strokeWidth: this.optionsController.options.currentWidth,
            fill: this.optionsController.options.fill ? this.optionsController.options.currentColor : 'transparent',
            left: this.origX,
            top: this.origY,
            rx: 0,
            ry: 0,
            selectable: false,
        })
    }
}