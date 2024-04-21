import SwitchableTool from "@/app/board/[id]/utils/tools/marker-intefaces/SwitchableTool";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import AbstractTool from "@/app/board/[id]/utils/tools/AbstractTool";
import {Canvas, IEvent} from "fabric/fabric-impl";
import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";
import {fabric} from "fabric";

abstract class AbstractOneClickTool extends AbstractTool implements SwitchableTool{
    enableDefaultTool : () => void;


    protected constructor(canvas: Canvas, optionsController: OptionsController, enableDefaultTool: () => void, socketController: SocketController) {
        super(canvas, optionsController, socketController);
        this.enableDefaultTool = enableDefaultTool;
    }

    disable(): void {
        this.canvas.off('mouse:down');
    }

    enable(): void {
        this.canvas.on('mouse:down', this.add)
    }

    protected add = async ({e} : IEvent) => {
        const pointer = this.canvas.getPointer(e);

        const text = await this.createObject(pointer);

        this.canvas.add(text);
        this.disable();
        this.enableDefaultTool();
        this.socketController.objectCreated(text);
    };

    protected abstract createObject(pointer : {x: number, y: number}) : Promise<fabric.Object & UniboardData>;


}

export default AbstractOneClickTool;