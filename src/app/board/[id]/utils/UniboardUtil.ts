import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import ToolsController from "@/app/board/[id]/utils/tools/tools-controller/ToolsController";
import {fabric} from "fabric";
import SwitchableTools from "@/app/board/[id]/utils/tools/tools-controller/SwitchableTools";

export default class UniboardUtil {
    private readonly id : string;
    private readonly optionsController: OptionsController;
    private readonly toolsController: ToolsController;
    private readonly canvas: fabric.Canvas;

    constructor(id: string) {
        this.canvas = new fabric.Canvas(id, {
            perPixelTargetFind: true,
        });
        this.id = id;
        this.optionsController = new OptionsController();
        this.toolsController = new ToolsController(this.canvas, this.optionsController);
        this.configureSettings();
    }

    private configureSettings = () => {
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerStyle = 'circle';
        fabric.Object.prototype.borderColor = '#4447A9';
        fabric.Object.prototype.cornerColor = '#4447A9';
        fabric.Object.prototype.cornerSize = 6;
        fabric.Object.prototype.padding = 10;
        fabric.Object.prototype.borderDashArray = [5, 5];
        fabric.Object.prototype.perPixelTargetFind = false;
        fabric.Object.prototype.includeDefaultValues = false;
    }


    public stop = () => { //метод должен завершать работу с доской
        this.toolsController.off();
        this.canvas.dispose();
    }

    public updateCanvasSize(width: number, height: number) {
        this.canvas.setDimensions({
            width: width,
            height: height,
        })
    }

    public switchToolOn = (tool: keyof SwitchableTools) =>  {
        this.toolsController.switchOn(tool);
    }
}