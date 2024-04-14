import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import ToolsController from "@/app/board/[id]/utils/tools/tools-controller/ToolsController";
import {fabric} from "fabric";
import SwitchableTools from "@/app/board/[id]/utils/tools/tools-controller/SwitchableTools";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";
import SocketIOModel from "@/app/board/[id]/utils/socket/SocketIOModel";
import {hasUniboardData} from "@/app/board/[id]/utils/tools/UniboardData";
import SVGUtil from "@/app/board/[id]/utils/files/SVGUtil";

export default class UniboardUtil {
    private readonly id : string;
    private readonly optionsController: OptionsController;
    private readonly toolsController: ToolsController;
    private readonly canvas: fabric.Canvas;
    private readonly socketController: SocketController;

    constructor(id: string) {
        this.canvas = new fabric.Canvas(id, {
            perPixelTargetFind: true,
        });
        this.id = id;
        this.optionsController = new OptionsController();
        let model: SocketIOModel = new SocketIOModel({
            created: this.objectCreatedFromServer,
            modified: this.objectModifiedFromServer,
            deleted: this.objectDeletedFromServer,
        });
        this.socketController = new SocketController(this.canvas, this.id, model);
        this.toolsController = new ToolsController(this.canvas, this.optionsController, this.socketController);
        this.configureSettings();
        this.loadObjects();
        this.handleModifications();

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

    private handleModifications = () => {
        this.canvas.on("object:modified", (opt) => {
            let canvasObject = opt.target;
            if (canvasObject){
                if (canvasObject instanceof fabric.ActiveSelection) {
                    canvasObject.getObjects().forEach((obj) => {
                        if (obj.left && obj.top
                            && canvasObject.left && canvasObject.top
                            && canvasObject.width && canvasObject.height
                        ) {
                            const tempLeft = obj.left;
                            const tempTop = obj.top;
                            obj.left = canvasObject.left + (canvasObject.width / 2) + obj.left;
                            obj.top = canvasObject.top + (canvasObject.height / 2) + obj.top;
                            this.socketController.objectModified(obj);
                            obj.left = tempLeft;
                            obj.top = tempTop;
                        }

                    })
                } else {
                    this.socketController.objectModified(canvasObject);
                }
            }
        });
    }

    private objectCreatedFromServer = (objectAsJSON: string) => {
        this.createObject([JSON.parse(objectAsJSON)]);
    }

    private objectModifiedFromServer = (objectAsJSON: string) => {
        let obj = JSON.parse(objectAsJSON);
        let objOnCanvas = this.canvas
            .getObjects()
            // @ts-ignore
            .find((value) => value.uniboardData.id === obj.uniboardData.id);

        if (objOnCanvas) {
            objOnCanvas.set(obj)
            this.canvas.renderAll();
        }
    }

    private objectDeletedFromServer = (id: string) => {
        // @ts-ignore
        let objOnCanvas = this.canvas.getObjects().find((value ) => value.uniboardData.id === id);
        if (objOnCanvas) {
            this.canvas.remove(objOnCanvas);
            this.canvas.renderAll();
        }
    }



    public stop = () => { //метод должен завершать работу с доской
        this.toolsController.off();
        this.canvas.dispose();
        this.socketController.disable();
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

    public loadObjects() {
        fetch(`http://${process.env["NEXT_PUBLIC_API_HOST"]}:${process.env["NEXT_PUBLIC_API_PORT"]}/board/${this.id}/get`, {
            method: 'GET',
        }).then( (response) => {
            return response.json();
        }).then( (data) => {
            this.createObject(data);
        })
    }

    private createObject(objects: any[]) {
        fabric.util.enlivenObjects(objects, (enlivenedObjects: fabric.Object[]) => {
            enlivenedObjects.forEach( async (enlivenedObject: fabric.Object) => {
                if (!hasUniboardData(enlivenedObject)) {
                    throw new Error("Некорректный тип объекта!!!")
                }

                if (enlivenedObject.uniboardData.type == "uniboard/svg") {
                    enlivenedObject = await SVGUtil.enlivenFromObject(enlivenedObject);
                }

                if (this.canvas.getContext()) {
                    this.canvas.add(enlivenedObject);
                }
            })
        }, "fabric");
    }
}