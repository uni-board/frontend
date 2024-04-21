import AbstractTool from "@/app/board/[id]/utils/tools/AbstractTool";
import AlwaysActiveTool from "@/app/board/[id]/utils/tools/marker-intefaces/AlwaysActiveTool";
import {Canvas} from "fabric/fabric-impl";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";
import KeysController from "@/app/board/[id]/utils/helpers/KeysController";
import {fabric} from "fabric";
import UniboardData, {hasUniboardData} from "@/app/board/[id]/utils/tools/UniboardData";
import FilesUtil from "@/app/board/[id]/utils/files/FilesUtil";
import ImageUtil from "@/app/board/[id]/utils/files/ImageUtil";
import StickyNoteUtil from "@/app/board/[id]/utils/files/StickyNoteUtil";
import SVGUtil from "@/app/board/[id]/utils/files/SVGUtil";
import {v4 as uuidv4} from "uuid";

export default class CopyAndPasteTool extends AbstractTool implements AlwaysActiveTool {

    private isSpecialPastePressed : boolean;
    private isSpecialCopyPressed : boolean;

    private buffer: (fabric.Object & UniboardData)[];


    constructor(canvas: Canvas, optionsController: OptionsController, socketController: SocketController) {
        super(canvas, optionsController, socketController);
        this.isSpecialPastePressed = false;
        this.isSpecialCopyPressed = false;
        this.buffer = [];
    }
    private handleKeyDown = (e: KeyboardEvent) => {
        let key = new KeysController();

        if (e.key.toLowerCase() == key.getPasteCombination().special.toLowerCase()) {
            this.isSpecialPastePressed = true;
        }

        if (e.key.toLowerCase() == key.getPasteCombination().main.toLowerCase() && this.isSpecialPastePressed) {
            this.paste();
        }

        if (e.key.toLowerCase() == key.getCopyCombination().special.toLowerCase()) {
            this.isSpecialCopyPressed = true;
        }

        if (e.key.toLowerCase() == key.getCopyCombination().main.toLowerCase() && this.isSpecialCopyPressed) {
            this.copy();
        }
    }

    private copy() {
        this.clearBuffer();
        this.canvas.getActiveObjects().forEach(object => this.copyObject(object));
    }

    private clearBuffer() {
        this.buffer = [];
    }

    private copyObject(object: fabric.Object) {
        if (!hasUniboardData(object)) {
            return;
        }
        this.buffer.push(object);
    }

    private paste() {
        this.canvas.discardActiveObject();
        this.buffer.forEach( async (object) => {
            let copyOfObject : fabric.Object & UniboardData;
            switch (object.uniboardData.type) {
                case "uniboard/file": {
                    copyOfObject =  await FilesUtil.enlivenFromObject(object);
                    break;
                }
                case "uniboard/image" : {
                    copyOfObject = await ImageUtil.enlivenFromObject(object);
                    break;
                }
                case "uniboard/stickyNote" : {
                    copyOfObject = await StickyNoteUtil.enlivenFromObject(object);
                    break;
                }
                case "uniboard/svg" : {
                    copyOfObject = await SVGUtil.enlivenFromObject(object);
                    return;
                }
                default : {
                    copyOfObject = await this.getCopy(object);
                }
            }

            copyOfObject.uniboardData.id = uuidv4();
            copyOfObject.set({
                left: copyOfObject.left ? copyOfObject.left + 25 : 25,
                top: copyOfObject.top ? copyOfObject.top + 25 : 25,
            });

            this.canvas.add(copyOfObject);
            this.socketController.objectCreated(copyOfObject);
        })
    }

    private getCopy(object: fabric.Object & UniboardData) : Promise<fabric.Object & UniboardData> {
        return new Promise((resolve, reject) => {
            object.clone((cloned: fabric.Object & UniboardData) => {
                resolve(cloned);
            }, ["uniboardData"]);
        })
    }

    private handleKeyUp(e : KeyboardEvent) {
        let key = new KeysController();
        if (e.key.toLowerCase() == key.getPasteCombination().special) {
            this.isSpecialCopyPressed = false;
        }
        if (e.key.toLowerCase() == key.getCopyCombination().special) {
            this.isSpecialPastePressed = false;
        }
    }

    disable(): void {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
    }

    enable(): void {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }
}