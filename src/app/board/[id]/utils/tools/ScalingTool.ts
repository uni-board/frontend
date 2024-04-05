import AbstractTool from "@/app/board/[id]/utils/tools/AbstractTool";
import AlwaysActiveTool from "@/app/board/[id]/utils/tools/marker-intefaces/AlwaysActiveTool";
import {Canvas} from "fabric/fabric-impl";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";

export default class ScalingTool extends AbstractTool implements AlwaysActiveTool{


    constructor(canvas: Canvas, optionsController: OptionsController, socketController: SocketController) {
        super(canvas, optionsController, socketController);
    }

    disable(): void {
        this.canvas.off('mouse:wheel');
    }

    enable(): void {
        this.canvas.on('mouse:wheel', (opt) => {
            let delta = opt.e.deltaY;
            let zoom = this.canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.1) zoom = 0.1;
            this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
    }

}