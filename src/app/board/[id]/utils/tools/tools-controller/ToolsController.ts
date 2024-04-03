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

export default class ToolsController {
    switchableTools: SwitchableTools

    private canvas: fabric.Canvas;
    private optionsController: OptionsController;

    constructor(canvas: fabric.Canvas, optionsController: OptionsController) {
        this.canvas = canvas;
        this.optionsController = optionsController;
        this.switchableTools = {
            rectangle: new RectangleTool(this.canvas, this.optionsController),
            triangle: new TriangleTool(this.canvas, this.optionsController),
            line: new LineTool(this.canvas, this.optionsController),
            ellipse: new EllipseTool(this.canvas, this.optionsController),
            circle: new CircleTool(this.canvas, this.optionsController),
            drawing: new DrawingTool(this.canvas, this.optionsController),
            select: new SelectTool(this.canvas, this.optionsController),
            textbox: new TextboxTool(this.canvas, this.optionsController,
                () => this.switchOn('select')),
        }
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
    }
}