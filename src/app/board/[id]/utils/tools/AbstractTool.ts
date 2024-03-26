import ITool from "@/app/board/[id]/utils/tools/ITool";
import {fabric} from "fabric";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";

abstract class AbstractTool implements ITool {

    protected canvas: fabric.Canvas;
    protected optionsController: OptionsController;

    protected constructor(canvas: fabric.Canvas, optionsController: OptionsController) {
        this.canvas = canvas;
        this.optionsController = optionsController;
    }

    abstract enable() : void;
    abstract disable() : void;
}

export default AbstractTool;