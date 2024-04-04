import ITool from "@/app/board/[id]/utils/tools/ITool";
import {fabric} from "fabric";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";

abstract class AbstractTool implements ITool {

    protected canvas: fabric.Canvas;
    protected optionsController: OptionsController;
    protected socketController: SocketController;

    protected constructor(canvas: fabric.Canvas, optionsController: OptionsController, socketController: SocketController) {
        this.canvas = canvas;
        this.optionsController = optionsController;
        this.socketController = socketController;
    }

    abstract enable() : void;
    abstract disable() : void;
}

export default AbstractTool;