import AbstractTool from "@/app/board/[id]/utils/tools/AbstractTool";
import AlwaysActiveTool from "@/app/board/[id]/utils/tools/marker-intefaces/AlwaysActiveTool";
import {Canvas} from "fabric/fabric-impl";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";
import {fabric} from "fabric";
import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import SVGUtil from "@/app/board/[id]/utils/files/SVGUtil";

export default class DragAndDropTool extends AbstractTool implements AlwaysActiveTool {

    private readonly enableDefaultTool: () => void;
    constructor(canvas: Canvas, optionsController: OptionsController, socketController: SocketController, enableDefaultTool: () => void) {
        super(canvas, optionsController, socketController);
        this.enableDefaultTool = enableDefaultTool;
    }

    private preventDefault = (e: DragEvent) => {
        e.preventDefault();
    }

    private dropCallback = (ev : DragEvent) => {
        this.preventDefault(ev);
        this.enableDefaultTool();
        const dt = ev.dataTransfer;

        if (!dt) {
            return;
        }

        const {files } = dt;

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            this.createObjectFromFile(file)
                .then((value) => {
                    this.canvas.add(value);
                    this.socketController.objectCreated(value);
                });
        }
    }

    private async createObjectFromFile(file: File) {
        let obj : fabric.Object & UniboardData;

        switch (file.type) {
            case 'image/svg+xml': {
                obj = await SVGUtil.createFromFile(file);
                break;
            }
            default: throw new Error("Недопустимый тип файла");
        }

        obj.set({
            left: this.canvas.getVpCenter().x - (obj.width ? obj.width : 0) / 2,
            top: this.canvas.getVpCenter().y - (obj.height ? obj.height : 0) / 2,
        })

        return obj;
    }

    public disable(): void {
        window.removeEventListener('drop', this.dropCallback);
        window.removeEventListener("dragover", this.preventDefault);
        window.removeEventListener('dragenter', this.preventDefault);

    }

    public enable = () => {
        window.addEventListener('drop', this.dropCallback);
        window.addEventListener("dragover", this.preventDefault);
        window.addEventListener("dragenter", this.preventDefault);
    }


}