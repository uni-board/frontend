import AbstractTool from "@/app/board/[id]/utils/tools/AbstractTool";
import {Canvas} from "fabric/fabric-impl";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import SwitchableTool from "@/app/board/[id]/utils/tools/marker-intefaces/SwitchableTool";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";

export default class SelectTool extends AbstractTool implements SwitchableTool{

    constructor(canvas: Canvas, optionsController: OptionsController, socketController: SocketController) {
        super(canvas, optionsController, socketController);
    }

    disable(): void {
        this.canvas.selection = true;
        this.canvas.getObjects().map((item) => item.set({ selectable: false}));
    }

    enable(): void {
        this.canvas.selection = true;
        this.canvas.isDrawingMode = false;
        this.canvas.getObjects().map((item) => item.set({ selectable: true}));
        this.canvas.hoverCursor = 'all-scroll';
    }
}