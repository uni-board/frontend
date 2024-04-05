import RectangleTool from "@/app/board/[id]/utils/tools/figure-tools/RectangleTool";
import TriangleTool from "@/app/board/[id]/utils/tools/figure-tools/TriangleTool";
import LineTool from "@/app/board/[id]/utils/tools/figure-tools/LineTool";
import EllipseTool from "@/app/board/[id]/utils/tools/figure-tools/EllipseTool";
import CircleTool from "@/app/board/[id]/utils/tools/figure-tools/CircleTool";
import {fabric} from "fabric";
import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import SwitchableTools from "@/app/board/[id]/utils/tools/tools-controller/SwitchableTools";
import AbstractTool from "@/app/board/[id]/utils/tools/AbstractTool";
import DrawingTool from "@/app/board/[id]/utils/tools/DrawingTool";
import SelectTool from "@/app/board/[id]/utils/tools/SelectTool";
import TextboxTool from "@/app/board/[id]/utils/tools/oneclick-tools/TextBoxTool";
import DeleteTool from "@/app/board/[id]/utils/tools/DeleteTool";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";
import AlwaysActiveTools from "@/app/board/[id]/utils/tools/tools-controller/AlwaysActiveTools";
import ScalingTool from "@/app/board/[id]/utils/tools/ScalingTool";

export default class ToolsController {
    switchableTools: SwitchableTools
    alwaysActiveTools: AlwaysActiveTools

    private canvas: fabric.Canvas;
    private optionsController: OptionsController;

    constructor(canvas: fabric.Canvas, optionsController: OptionsController, socketController: SocketController) {
        this.canvas = canvas;
        this.optionsController = optionsController;
        this.switchableTools = {
            rectangle: new RectangleTool(this.canvas, this.optionsController, socketController),
            triangle: new TriangleTool(this.canvas, this.optionsController, socketController),
            line: new LineTool(this.canvas, this.optionsController, socketController),
            ellipse: new EllipseTool(this.canvas, this.optionsController, socketController),
            circle: new CircleTool(this.canvas, this.optionsController, socketController),
            drawing: new DrawingTool(this.canvas, this.optionsController, socketController),
            select: new SelectTool(this.canvas, this.optionsController, socketController),
            textbox: new TextboxTool(this.canvas, this.optionsController,
                () => this.switchOn('select'), socketController),
        }

        this.alwaysActiveTools = {
            delete: new DeleteTool(this.canvas, this.optionsController, socketController),
            scaling: new ScalingTool(this.canvas, this.optionsController, socketController),
        }

        this.enableAlwaysActiveTools();
    }

    private enableAlwaysActiveTools = () : void => {
        Object.values(this.alwaysActiveTools)
            .forEach((v: AbstractTool) => v.enable());
    }

    public switchOn(tool: keyof SwitchableTools) {
        this.disableAll();
        this.switchableTools[tool].enable();
    }

    private disableAll() {
        Object.values(this.switchableTools)
            .forEach((v: AbstractTool) => v.disable());
    }

    public off = () => {
        this.disableAll();

        Object.values(this.alwaysActiveTools)
            .forEach((v: AbstractTool) => v.disable());
    }
}