import {fabric} from "fabric";
import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import PdfAsImg from "@/app/board/[id]/utils/helpers/pdf-as-img/PdfAsImg";
import PDFConverterBackend from "@/app/board/[id]/utils/helpers/pdf-as-img/PDFConverterBackend";
import {v4 as uuidv4} from "uuid";
import {IEvent} from "fabric/fabric-impl";


class PdfObject {

    private readonly pdf: PdfAsImg;
    private image: Promise<fabric.Image>;
    private readonly object: Promise<fabric.Group & UniboardData>;
    private readonly uniboardData: UniboardData;
    private page: number;
    private mouseIn: boolean;
    private nextButton : fabric.Object | undefined;
    private prevButton: fabric.Object | undefined;

    constructor(pdf: PdfAsImg, uniboardData: UniboardData) {
        this.pdf = pdf;
        this.uniboardData = uniboardData;
        this.page = 1;
        this.image = this.getFirstPageImage();
        this.object = new Promise(this.createPdfObject);
        this.mouseIn = false;
        this.setUpPdfObject();
    }

    private readonly getFirstPageImage = () => {
        return this.getPageImage(1);
    }

    private readonly createPdfObject = async (resolve: (value: (PromiseLike<fabric.Group & UniboardData> | fabric.Group & UniboardData)) => void, reject: (reason?: any) => void) => {
        const image = await this.image;
        const background = this.createBackgroundObjectFor(image);
        const objectWithoutUniboardData = new fabric.Group([background, image]);
        const object = Object.assign(objectWithoutUniboardData, this.uniboardData)
        resolve(object);
    }

    private readonly createBackgroundObjectFor = (image: fabric.Image) : fabric.Object => {
        let imageBoundingRect = image.getBoundingRect();
        const border = imageBoundingRect.width * 0.02;
        return new fabric.Rect({
            top: imageBoundingRect.top - border,
            left: imageBoundingRect.left - border,
            width: imageBoundingRect.width + border * 2,
            height: imageBoundingRect.height + border * 2,
            fill: "gray",
        });
    }

    private readonly setUpPdfObject = async () => {
        const pdfObject = await this.object;
        pdfObject.on("mousedblclick", this.nextPage);
        await this.trackMousePosition();
        await this.handleClickInside();
    }

    private readonly nextPage = async () => {
        const pagesCount = await this.pdf.getPagesCount();
        this.page++;
        if (this.page > pagesCount) {
            this.page = 1;
        }

        const newImage = await this.getPageImage(this.page);
        const pdfObjSettings = await this.getPdfObjSettingsAndSetToDefault();
        const point = await this.calcActualImagePos();
        this.positionImage(newImage, point);
        await this.updateImage(newImage);
        await this.returnSettingsToPrevious(pdfObjSettings);
    }

    private readonly prevPage = async () => {
        const pagesCount = await this.pdf.getPagesCount();
        this.page++;
        if (this.page < 1) {
            this.page = pagesCount;
        }

        const newImage = await this.getPageImage(this.page);
        const pdfObjSettings = await this.getPdfObjSettingsAndSetToDefault();
        const point = await this.calcActualImagePos();
        this.positionImage(newImage, point);
        await this.updateImage(newImage);
        await this.returnSettingsToPrevious(pdfObjSettings);
    }

    private readonly getPageImage = (page: number) : Promise<fabric.Image>  => {
        return new Promise(async (resolve, reject) => {
            const firstPage = await this.pdf.getPage(page);
            const image = new fabric.Image(firstPage);
            resolve(image);
        })
    }

    private readonly getPdfObjSettingsAndSetToDefault =  () : Promise<{angle: number, scaleX: number, scaleY: number}> => {
        return new Promise(async (resolve, reject) => {
            const pdfObj = await this.object;
            let res =  {
                angle: pdfObj.angle || 0,
                scaleX: pdfObj.scaleX || 1,
                scaleY: pdfObj.scaleY || 1,
            }
            pdfObj.rotate(0);
            pdfObj.scale(1);

            resolve(res);
        })
    }

    private readonly calcActualImagePos = () : Promise<fabric.Point> => {
        return new Promise( async (resolve, reject) => {
            const pdfObj = await this.object;
            const image = await this.image;
            const matrix = pdfObj.calcTransformMatrix();
            const point = fabric.util.transformPoint(new fabric.Point(image.left || 0, image.top || 0), matrix);
            resolve(point);
        })

    }

    private readonly positionImage = (image: fabric.Image, point: fabric.Point)  => {
        image.set({
            left: point.x,
            top: point.y
        })
    }

    private readonly updateImage = async (newImage: fabric.Image) => {
        const pdfObj = await this.object;
        const oldImage = await this.image;
        pdfObj.remove(oldImage);
        pdfObj.addWithUpdate(newImage);
        this.image = new Promise((resolve) => resolve(newImage));
    }

    private readonly returnSettingsToPrevious = async (prevSettings: {angle: number, scaleX: number, scaleY: number}) => {
        const pdfObj = await this.object;
        pdfObj.set({
            scaleX: prevSettings.scaleX,
            scaleY: prevSettings.scaleY,
        })
        pdfObj.rotate(prevSettings.angle);
        if (pdfObj.canvas) {
            pdfObj.canvas.requestRenderAll();
        }
    }

    private trackMousePosition = async () => {
        const pdfObj = await this.object;
        pdfObj.on("mouseover", () => this.mouseIn = true);
        pdfObj.on("mouseout", () => this.mouseIn = false);
    }

    private readonly handleClickInside = async () => {
        const pdfObj = await this.object;
        pdfObj.on("mousedown", this.setUpNextButton)
    }

    private readonly setUpNextButton = async () => {
        if (this.nextButton) {
            return;
        }
        const pdfObj = await this.object;
        if (pdfObj.canvas) {
            const pdfObjWidth = pdfObj.width || 0;
            const pdfObjHeight = pdfObj.height || 0;
            const rectWidth = pdfObjWidth * 0.06
            const point = new fabric.Point(pdfObjWidth / 2 - rectWidth, -pdfObjHeight/2 - rectWidth * 1.25);
            const newPoint = fabric.util.transformPoint(point, pdfObj.calcTransformMatrix());
            const button : fabric.Object = new fabric.Rect({
                width: rectWidth,
                height: rectWidth,
                fill: "red",
                top: newPoint.y,
                left: newPoint.x,
                lockMovementY: true,
                lockMovementX: true,
                hasBorders: false,
                hasControls: false,
                perPixelTargetFind: false,
                hoverCursor: "pointer",
                selectable: true,
            });
            this.nextButton = button;
            console.log("added");
            pdfObj.canvas.add(button);
            const calcPos = () => {
                pdfObj.canvas?.remove(button);
                button.off("mousedown", this.nextPage);
                button.rotate(pdfObj.angle || 0);
                button.set({
                    scaleX: pdfObj.scaleX || 1,
                    scaleY: pdfObj.scaleY || 1,
                });
                const pos = fabric.util.transformPoint(point, pdfObj.calcTransformMatrix())
                button.set({
                    top: pos.y,
                    left: pos.x,
                })
                pdfObj.canvas?.add(button);
                button.on("mousedown", this.nextPage);
                pdfObj.canvas?.renderAll();
            }
            pdfObj.on("rotating", calcPos);
            pdfObj.on("scaling", calcPos);
            pdfObj.on("moving", calcPos);
            pdfObj.on("skewing", calcPos);

            button.on("mousedown", this.nextPage);

            const handleClickOutside = (e: IEvent) => {
                if (this.mouseIn || e.target == button) {
                    return;
                }
                pdfObj.canvas?.remove(button);
                this.nextButton = undefined;
                pdfObj.off("rotating", calcPos);
                pdfObj.off("scaling", calcPos);
                pdfObj.off("moving", calcPos);
                pdfObj.off("skewing", calcPos);
                pdfObj.canvas?.off("mousedown", handleClickOutside);
            }

            pdfObj.canvas.on("mouse:down", handleClickOutside);

        }
    }

    public get = async () : Promise<fabric.Object & UniboardData> => {
        return this.object;
    }
}


export default class PDFUtil {
    private constructor() {
    }

    public static async createFromFile(file: File) : Promise<fabric.Object & UniboardData> {
        return new Promise(async (resolve, reject) => {
            if (file.type != 'application/pdf') {
                reject(new Error("Попытка создания pdf из некорректного файла"));
            }
            const fileId = await this.putFileInStorageAndGetId(file);
            let pdf : PdfAsImg = new PDFConverterBackend(fileId);

            let pdfObj = new PdfObject(pdf, {
                uniboardData: {
                    id: uuidv4(),
                    creator: "1",
                    persistedOnServer: false,
                    type: "uniboard/pdf",
                    data: fileId,
                }
            });
            console.log("PDFUtil/155")
            resolve(pdfObj.get());
        })
    }

    private static putFileInStorageAndGetId(file: File) : Promise<string> {
        return new Promise( async (resolve, reject) => {
            const formData = new FormData();
            formData.append("somefile", file);
            let response = await fetch(`http://${process.env["NEXT_PUBLIC_API_HOST"]}:${process.env["NEXT_PUBLIC_API_PORT"]}/storage/add`,
                {
                    method: "POST",
                    body: formData,
                });
            let {id} : {id: string} = await response.json();
            resolve(id);
        });
    }

    public static enlivenFromObject(object: fabric.Object & UniboardData) : Promise<fabric.Object & UniboardData> {
        return new Promise(async (resolve, reject) => {
            if (object.uniboardData.type != "uniboard/pdf" || !object.uniboardData.data) {
                reject(new Error("Данный объект не является объектом типа \"uniboard\\pdf\" или у него отсутсвует id файла"));
                return;
            }

            let pdf : PdfAsImg = new PDFConverterBackend(object.uniboardData.data);
            let pdfObj = new PdfObject(pdf, {uniboardData: object.uniboardData});
            resolve(pdfObj.get())
        });
    }
}