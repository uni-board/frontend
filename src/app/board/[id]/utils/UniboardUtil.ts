import OptionsController from "@/app/board/[id]/utils/options/OptionsController";
import ToolsController from "@/app/board/[id]/utils/tools/tools-controller/ToolsController";
import {fabric} from "fabric";
import SwitchableTools from "@/app/board/[id]/utils/tools/tools-controller/SwitchableTools";
import SocketController from "@/app/board/[id]/utils/socket/SocketController";
import SocketIOModel from "@/app/board/[id]/utils/socket/SocketIOModel";
import UniboardData, {hasUniboardData} from "@/app/board/[id]/utils/tools/UniboardData";
import SVGUtil from "@/app/board/[id]/utils/files/SVGUtil";
import ImageUtil from "@/app/board/[id]/utils/files/ImageUtil";
import FilesUtil from "@/app/board/[id]/utils/files/FilesUtil";
import StickyNoteUtil from "@/app/board/[id]/utils/files/StickyNoteUtil";
import {Dispatch, SetStateAction} from "react";
import ToolsOptions from "@/app/board/[id]/utils/options/ToolsOptions";
import PDFUtil from "@/app/board/[id]/utils/files/pdf/PDFUtil";

export default class UniboardUtil {
    private readonly id : string;
    private readonly optionsController: OptionsController;
    private readonly toolsController: ToolsController;
    private readonly canvas: fabric.Canvas;
    private readonly socketController: SocketController;

    constructor(id: string, setActualToolType: Dispatch<SetStateAction<keyof SwitchableTools>>) {
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
        this.toolsController = new ToolsController(this.canvas, this.optionsController, this.socketController, setActualToolType);
        this.configureSettings();
        this.loadObjects();
        this.handleModifications();
    }

    public setOption<K extends keyof ToolsOptions>(key : K, value : ToolsOptions[K]) : void {
        this.optionsController.set(key, value);
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
        fabric.Object.prototype.objectCaching = false;
        let image = new Image();
        image.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='54' height='54' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='13' height='13' fill-opacity='0.1' fill='%23000000'/%3E%3C/svg%3E";
        this.canvas.setBackgroundColor(new fabric.Pattern({source: image, repeat: "repeat"}), this.canvas.renderAll.bind(this.canvas))
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
                            if (obj instanceof fabric.Line) {
                                const tempX1 = obj.x1;
                                const tempY1 = obj.y1;
                                const tempX2 = obj.x2;
                                const tempY2 = obj.y2;
                                const tempLeft = obj.left;
                                const tempTop = obj.top;
                                const tempAngle = obj.angle ? obj.angle : 0;

                                let matrix = canvasObject.calcTransformMatrix();
                                let point = fabric.util.transformPoint(new fabric.Point(obj.left, obj.top), matrix);

                                obj.rotate(canvasObject.angle ? canvasObject.angle : 0);
                                obj.left = point.x;
                                obj.top = point.y;



                                if (hasUniboardData(obj)) {
                                    this.socketController.objectModified(obj);
                                }
                                obj.x1 = tempX1;
                                obj.x2 = tempX2;
                                obj.y1 = tempY1;
                                obj.y2 = tempY2;
                                obj.left = tempLeft;
                                obj.top = tempTop;
                                obj.angle = tempAngle;
                                return;

                            }
                            const tempLeft = obj.left;
                            const tempTop = obj.top;
                            const tempAngle = obj.angle ? obj.angle : 0;

                            obj.angle = tempAngle + (canvasObject.angle ? canvasObject.angle : 0);
                            obj.top = canvasObject.top + fabric.util.rotateVector({x: tempLeft +  canvasObject.width/2, y:tempTop + canvasObject.height / 2}, fabric.util.degreesToRadians(canvasObject.angle ? canvasObject.angle : 0)).y;
                            obj.left = canvasObject.left + fabric.util.rotateVector({x: tempLeft + canvasObject.width/2, y:tempTop + canvasObject.height / 2}, fabric.util.degreesToRadians(canvasObject.angle ? canvasObject.angle : 0)).x;
                            if (hasUniboardData(obj)) {
                                this.socketController.objectModified(obj);
                            }
                            obj.left = tempLeft;
                            obj.top = tempTop;
                            obj.angle = tempAngle;
                        }
                    })
                } else {
                    if (hasUniboardData(canvasObject)) {
                        this.socketController.objectModified(canvasObject);
                    }
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

        if (obj.uniboardData.type == "uniboard/stickyNote") {
            if (objOnCanvas instanceof fabric.Group) {
                let textbox = objOnCanvas.getObjects('textbox')[0];
                if (textbox instanceof fabric.Textbox) {
                    textbox.set("text", obj.uniboardData.stickerText);
                    textbox.fire('changed');
                }
            }
        }

        if (obj.uniboardData.type == "line") {
            let {x1, y1, x2, y2, angle, ...other} = obj;
            obj = other;
            if (objOnCanvas instanceof fabric.Line) {
                objOnCanvas.angle = angle;
                objOnCanvas.x1 = x1;
                objOnCanvas.x2 = x2;
                objOnCanvas.y1 = y1;
                objOnCanvas.y2 = y2;
                this.canvas.renderAll();
            }
        }

        if (obj.uniboardData.type == "uniboard/pdf") {
            const {height, width, ...other} = obj;
            obj = other;
            if (objOnCanvas) {
                objOnCanvas.set(obj);
                objOnCanvas.fire("moving");
                this.canvas.renderAll();
            }
            return;
        }

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
            objOnCanvas.fire("deleted")
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

    public exportAsImage = () => {
        const canvasAsImage = this.canvas.toDataURL();
        fetch(canvasAsImage)
            .then((res) => res.blob()).then((blob) => {
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.setAttribute('download', `uniboard_${this.id}.png`);
            downloadLink.click();
            URL.revokeObjectURL(downloadLink.href);
        });
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
                    throw new Error("Некорректный тип объекта!!!");
                }

                let obj : fabric.Object & UniboardData = enlivenedObject;

                if (obj.uniboardData.type == "uniboard/svg") {
                    obj = await SVGUtil.enlivenFromObject(obj);
                }

                if (obj.uniboardData.type == "uniboard/image") {
                    obj = await ImageUtil.enlivenFromObject(obj);
                }

                if (obj.uniboardData.type == "uniboard/file") {
                    obj = await FilesUtil.enlivenFromObject(obj);
                }

                if (obj.uniboardData.type == "uniboard/stickyNote") {
                    obj = await StickyNoteUtil.enlivenFromObject(obj);
                }

                if (obj.uniboardData.type == "uniboard/pdf") {
                    obj = await PDFUtil.enlivenFromObject(obj);
                }

                if (this.canvas.getContext()) {
                    this.canvas.add(obj);
                }
            })
        }, "fabric");
    }
}