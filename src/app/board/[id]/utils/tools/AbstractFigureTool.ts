import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import AbstractTool from "@/app/board/[id]/utils/tools/AbstractTool";
import {IEvent} from "fabric/fabric-impl";
import {v4 as uuidv4} from "uuid";
import {fabric} from "fabric";

abstract class AbstractFigureTool<T extends fabric.Object> extends AbstractTool {

    protected origX : number = 0;
    protected origY : number = 0;
    protected drawInstance : (T & UniboardData) | undefined;

    protected type: string;

    protected mouseDown : boolean = false;
    protected constructor(canvas: fabric.Canvas, optionsController: OptionsController, type: string) {
        super(canvas, optionsController);
        this.type = type;
    }

    public enable = () : void => {
        console.log('enable');
        this.canvas.on('mouse:down', this.startAdd())
        this.canvas.on('mouse:move', this.startDrawing());
        this.canvas.on('mouse:up', this.stopDrawing);

        this.canvas.selection = false;
        this.canvas.hoverCursor = 'auto';
        this.canvas.isDrawingMode = false;

        this.canvas.getObjects().map((item) => item.set({ selectable: false }));
        this.canvas.discardActiveObject().requestRenderAll();
    }


    protected startAdd = () : (e : IEvent) => void => {
        return ({ e } : IEvent) => {
            console.log("start");
            this.mouseDown = true;

            const pointer = this.canvas.getPointer(e);
            this.origX = pointer.x;
            this.origY = pointer.y;
            this.drawInstance = this.createFigure(pointer);

            this.canvas.add(this.drawInstance);
        };
    };

    protected createFigure(pointer: {x: number, y: number}) : T & UniboardData {
        return Object.assign(this.initFigure(pointer), {
            uniboardData: {
                id: uuidv4(),
                creator: "2",
                persistedOnServer: false,
                type: this.type
            }
        })
    };

    protected abstract initFigure(pointer: {x : number, y : number}) : T;

    protected startDrawing = () : ((e: IEvent) => void) => {
        return ({ e } : IEvent) => {
            if (this.mouseDown) {
                const pointer : {x: number, y: number} = this.canvas.getPointer(e);

                this.drawInstance!.set(this.calculateSettings(pointer));

                this.drawInstance!.setCoords();
                this.canvas.renderAll();
            }
        };
    };

    protected abstract calculateSettings(pointer: {x: number, y: number}) : Partial<T>;

    protected stopDrawing = () => {
        this.mouseDown = false;
        if (this.drawInstance) {
            //this.socketController.objectCreated(this.drawInstance);
        }
    }

    disable = () : void => {
        this.removeEventListeners();
    }

    protected removeEventListeners = () => {
        this.canvas.off('mouse:down');
        this.canvas.off('mouse:move');
        this.canvas.off('mouse:up');
    }
}

export default AbstractFigureTool;