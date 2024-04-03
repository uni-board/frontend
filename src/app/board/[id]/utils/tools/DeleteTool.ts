import AbstractTool from "@/app/board/[id]/utils/tools/AbstractTool";
import {Canvas} from "fabric/fabric-impl";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import {fabric} from "fabric";
import KeysController from "@/app/board/[id]/utils/helpers/KeysController";

export default class DeleteTool extends AbstractTool {

    private deleteCallback = (e : KeyboardEvent) => {
        let key = new KeysController();
        if (e.code === key.getDeleteKey()) {
            let objects = this.canvas.getActiveObjects();

            if (objects.length == 1 && objects[0] instanceof fabric.Textbox && objects[0].isEditing) {
                return;
            }


            this.canvas.remove(...objects);
            this.canvas.discardActiveObject();
        }
    }
    constructor(canvas: Canvas, optionsController: OptionsController) {
        super(canvas, optionsController);
    }

    disable(): void {
        window.removeEventListener('keydown', this.deleteCallback)
    }

    enable(): void {
        window.addEventListener('keydown', this.deleteCallback)
    }


}