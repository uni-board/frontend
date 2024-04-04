import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import {Canvas, Line} from "fabric/fabric-impl";
import AbstractFigureTool from "@/app/board/[id]/utils/tools/figure-tools/AbstractFigureTool";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";
import {fabric} from "fabric";

export default class LineTool extends AbstractFigureTool<fabric.Line>{

    constructor(canvas: Canvas, optionsController: OptionsController, socketController: SocketController) {
        super(canvas, optionsController, 'line', socketController);
    }

    protected calculateSettings(pointer: { x: number; y: number }): Partial<Line> {
        return {
            x2: pointer.x,
            y2: pointer.y,
        };
    }

    protected initFigure = (pointer: {x: number, y: number}): Line => {
        return new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
            strokeWidth: this.optionsController.options.currentWidth,
            stroke: this.optionsController.options.currentColor,
            selectable: false,
        });
    }
}