import AbstractOneClickTool from "@/app/board/[id]/utils/tools/oneclick-tools/AbstractOneClickTool";
import SwitchableTool from "@/app/board/[id]/utils/tools/marker-intefaces/SwitchableTool";
import {Canvas, Object} from "fabric/fabric-impl";
import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";
import StickyNoteUtil from "@/app/board/[id]/utils/files/StickyNoteUtil";

export default class StickyNoteTool extends AbstractOneClickTool implements SwitchableTool {


    constructor(canvas: Canvas, optionsController: OptionsController, enableDefaultTool: () => void, socketController: SocketController) {
        super(canvas, optionsController, enableDefaultTool, socketController);
    }

    protected async createObject(pointer: { x: number; y: number }): Promise<Object & UniboardData> {
        return new Promise( async (resolve, reject) => {
            let stickyNote = await StickyNoteUtil.create(this.optionsController.get("stickerColor"));
            stickyNote.set({
                left: pointer.x,
                top: pointer.y,
            })
            resolve(stickyNote);
        });
    }

}