import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import {Canvas} from "fabric/fabric-impl";
import AbstractOneClickTool from "@/app/board/[id]/utils/tools/oneclick-tools/AbstractOneClickTool";
import {v4 as uuidv4} from "uuid";
import {fabric} from "fabric";

class TextboxTool extends AbstractOneClickTool {

    constructor(canvas: Canvas, optionsController: OptionsController, enableDefaultTool: () => void) {
        super(canvas, optionsController, enableDefaultTool);
    }

    protected createObject(pointer : {x: number, y: number}) : fabric.Textbox & UniboardData {
        const text = Object.assign(new fabric.Textbox('text', {
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

        return text;
    }


}

export default TextboxTool;