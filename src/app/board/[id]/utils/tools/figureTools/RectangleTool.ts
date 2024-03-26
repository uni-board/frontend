import {Canvas, Rect} from "fabric/fabric-impl";
import AbstractFigureTool from "@/app/board/[id]/utils/tools/figureTools/AbstractFigureTool";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import {fabric} from "fabric";

export default class RectangleTool extends AbstractFigureTool<fabric.Rect> {

    constructor(canvas: Canvas, optionsController: OptionsController) {
        super(canvas, optionsController, "rect");
    }

    protected calculateSettings(pointer: { x: number; y: number }): Partial<Rect> {
        let settings : Partial<Rect> = {
            width: Math.abs(pointer.x - this.origX),
            height: Math.abs(pointer.y - this.origY),
        }

        if (pointer.x < this.origX) {
            settings.left = pointer.x;
        }

        if (pointer.y < this.origY) {
            settings.top = pointer.y;
        }

        return settings;
    }

    protected initFigure(pointer: {x: number, y: number}): Rect {
        return new fabric.Rect({
            stroke: this.optionsController.options.currentColor,
            strokeWidth: this.optionsController.options.currentWidth,
            fill: this.optionsController.options.fill ? this.optionsController.options.currentColor : 'transparent',
            left: this.origX,
            top: this.origY,
            width: 0,
            height: 0,
            selectable: false,
        });
    }
}