import AbstractTool from "@/app/board/[id]/utils/tools/AbstractTool";
import {Canvas} from "fabric/fabric-impl";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import {fabric} from "fabric";
import KeysController from "@/app/board/[id]/utils/helpers/KeysController";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";
import AlwaysActiveTool from "@/app/board/[id]/utils/tools/marker-intefaces/AlwaysActiveTool";

export default class DeleteTool extends AbstractTool implements AlwaysActiveTool{

    private deleteCallback = (e : KeyboardEvent) => {
        let key = new KeysController();
        if (e.code === key.getDeleteKey()) {
            let objects = this.canvas.getActiveObjects();

            if (objects.length == 1 && objects[0] instanceof fabric.Textbox && objects[0].isEditing) {
                return;
            }


            this.canvas.remove(...objects);
            this.canvas.discardActiveObject();
            objects.forEach((obj) => {
                this.socketController.objectRemoved(obj);
            })
        }
    }
    constructor(canvas: Canvas, optionsController: OptionsController, socketController: SocketController) {
        super(canvas, optionsController, socketController);
    }

    disable(): void {
        window.removeEventListener('keydown', this.deleteCallback)
    }

    enable(): void {
        window.addEventListener('keydown', this.deleteCallback)
    }


}