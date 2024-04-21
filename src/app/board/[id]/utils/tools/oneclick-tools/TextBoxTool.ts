import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import {Canvas} from "fabric/fabric-impl";
import AbstractOneClickTool from "@/app/board/[id]/utils/tools/oneclick-tools/AbstractOneClickTool";
import {v4 as uuidv4} from "uuid";
import {fabric} from "fabric";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";

class TextboxTool extends AbstractOneClickTool {

    constructor(canvas: Canvas, optionsController: OptionsController, enableDefaultTool: () => void, socketController: SocketController) {
        super(canvas, optionsController, enableDefaultTool, socketController);
    }

    protected createObject(pointer : {x: number, y: number}) : Promise<fabric.Textbox & UniboardData> {
        const text : fabric.Textbox & UniboardData = Object.assign(new fabric.Textbox('text', {
            left: pointer.x,
            top: pointer.y,
            fill: this.optionsController.options.currentColor,
            fontFamily: "Arial",
            editable: true,
        }), {
            uniboardData: {
                id: uuidv4(),
                creator: "2",
                persistedOnServer: false,
                type: 'textbox'
            }
        });

        const invisibleControls = ['mt', 'mb'];
        invisibleControls.forEach((side) => {
            text.setControlVisible(side, false);
        });

        return new Promise((resolve) => resolve(text));
    }


}

export default TextboxTool;