import {fabric} from "fabric";
import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import PdfAsImg from "@/app/board/[id]/utils/helpers/pdf-as-img/PdfAsImg";
import PDFConverterBackend from "@/app/board/[id]/utils/helpers/pdf-as-img/PDFConverterBackend";
import {v4 as uuidv4} from "uuid";
import {IEvent} from "fabric/fabric-impl";


class PdfObject {

    private readonly pdf: PdfAsImg;
    private image: fabric.Image;
    private readonly object: fabric.Group & UniboardData;
    private page: number;
    private mouseIn: boolean;
    private nextButton : fabric.Object | undefined;
    private prevButton: fabric.Object | undefined;

    constructor(pdf: PdfAsImg, image: fabric.Image, object: fabric.Group & UniboardData) {
        this.pdf = pdf;
        this.image = image;
        this.object = object;
        this.page = 1;
        this.mouseIn = false;
        this.setUpPdfObject();
    }

    private readonly setUpPdfObject = () => {
        this.object.on("mousedblclick", this.nextPage);
        this.trackMousePosition();
        this.handleClickInside();
    }

    private readonly nextPage = async () => {
        const pagesCount = await this.pdf.getPagesCount();
        this.page++;
        if (this.page > pagesCount) {
            this.page = 1;
        }

        const newImage = await this.getPageImage(this.page);
        const pdfObjSettings = this.getPdfObjSettingsAndSetToDefault();
        const point = this.calcActualImagePos();
        this.positionImage(newImage, point);
        this.updateImage(newImage);
        this.returnSettingsToPrevious(pdfObjSettings);
        this.object.fire("moving");
    }

    private readonly getPageImage = (page: number) : Promise<fabric.Image>  => {
        return new Promise(async (resolve, reject) => {
            const firstPage = await this.pdf.getPage(page);
            const image = new fabric.Image(firstPage);
            resolve(image);
        })
    }

    private readonly getPdfObjSettingsAndSetToDefault =  () : {angle: number, scaleX: number, scaleY: number} => {
            const pdfObj = this.object;
            let res =  {
                angle: pdfObj.angle || 0,
                scaleX: pdfObj.scaleX || 1,
                scaleY: pdfObj.scaleY || 1,
            }
            pdfObj.rotate(0);
            pdfObj.scale(1);

            return res;
    }

    private readonly calcActualImagePos = () : fabric.Point => {
        const pdfObj = this.object;
        const image = this.image;
        const matrix = pdfObj.calcTransformMatrix();
        const point = fabric.util.transformPoint(new fabric.Point(image.left || 0, image.top || 0), matrix);
        return point
    }

    private readonly positionImage = (image: fabric.Image, point: fabric.Point)  => {
        image.set({
            left: point.x,
            top: point.y
        })
    }

    private readonly updateImage = (newImage: fabric.Image) => {
        const pdfObj = this.object;
        const oldImage = this.image;
        const background = PdfObject.createBackgroundObjectFor(newImage);
        pdfObj.remove(...pdfObj.getObjects());
        pdfObj.addWithUpdate(background)
        pdfObj.addWithUpdate(newImage);
        this.image = newImage;
    }

    private readonly returnSettingsToPrevious = (prevSettings: {angle: number, scaleX: number, scaleY: number}) => {
        const pdfObj = this.object;
        pdfObj.set({
            scaleX: prevSettings.scaleX,
            scaleY: prevSettings.scaleY,
        })
        pdfObj.rotate(prevSettings.angle);
        if (pdfObj.canvas) {
            pdfObj.canvas.requestRenderAll();
        }
    }

    private trackMousePosition = () => {
        const pdfObj = this.object;
        pdfObj.on("mouseover", () => this.mouseIn = true);
        pdfObj.on("mouseout", () => this.mouseIn = false);
    }

    private readonly handleClickInside = () => {
        const pdfObj = this.object;
        pdfObj.on("mousedown", this.setUpNextButton)
    }

    private readonly setUpNextButton = () => {
        if (this.nextButton) {
            return;
        }
        const pdfObj = this.object;
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
                lockMovementY: true,
                lockMovementX: true,
                hasBorders: false,
                hasControls: false,
                perPixelTargetFind: false,
                hoverCursor: "pointer",
                selectable: true,
                scaleX: pdfObj.scaleX || 1,
                scaleY: pdfObj.scaleY || 1,
            });
            button.rotate(pdfObj.angle || 0);
            button.set({
                top: newPoint.y,
                left: newPoint.x,
            })
            this.nextButton = button;
            pdfObj.canvas.add(button);
            const calcPos = () => {
                const pdfObjWidth = pdfObj.width || 0;
                const pdfObjHeight = pdfObj.height || 0;
                const rectWidth = pdfObjWidth * 0.06
                const point = new fabric.Point(pdfObjWidth / 2 - rectWidth, -pdfObjHeight/2 - rectWidth * 1.25);
                button.rotate(pdfObj.angle || 0);
                button.set({
                    height: rectWidth,
                    width: rectWidth,
                    scaleX: pdfObj.scaleX || 1,
                    scaleY: pdfObj.scaleY || 1,
                });
                const pos = fabric.util.transformPoint(point, pdfObj.calcTransformMatrix())
                button.set({
                    top: pos.y,
                    left: pos.x,
                })
                if (pdfObj.canvas) {
                    pdfObj.canvas.remove(button);
                    pdfObj.canvas.add(button);
                }
            }
            pdfObj.on("rotating", calcPos);
            pdfObj.on("scaling", calcPos);
            pdfObj.on("moving", calcPos);
            pdfObj.on("skewing", calcPos);

            button.on("mousedown", ()=> {
                this.nextPage();
                pdfObj.canvas?.setActiveObject(pdfObj);
            })
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

    public static createPdfObject(pdf: PdfAsImg, uniboardData: UniboardData) : Promise<PdfObject> {
        return new Promise(async (resolve, reject) => {
            const image : fabric.Image = await this.getPageAsFabricImage(pdf, 1);
            const object: fabric.Group & UniboardData = this.createPDFObject(image, uniboardData);
            const pdfObj = new PdfObject(pdf, image, object);
            resolve(pdfObj)
        });
    }

    private static getPageAsFabricImage(pdf: PdfAsImg, page: number) : Promise<fabric.Image> {
        return new Promise( async (resolve, reject) => {
            const img = await pdf.getPage(page);
            resolve(new fabric.Image(img));
        })
    }

    private static createPDFObject(firstPage: fabric.Image, uniboardData: UniboardData) {
        const background = this.createBackgroundObjectFor(firstPage);
        const objectWithoutUniboardData = new fabric.Group([background, firstPage]);
        const object = Object.assign(objectWithoutUniboardData, uniboardData)
        return object;
    }

    private static readonly createBackgroundObjectFor = (image: fabric.Image) : fabric.Object => {
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

    public get = () : fabric.Object & UniboardData => {
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
            let pdf : PdfAsImg = new PDFConverterBackend (fileId);

            let pdfObj = await PdfObject.createPdfObject(pdf, {
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
            let pdfObj = await PdfObject.createPdfObject(pdf, {uniboardData: object.uniboardData});
            const  obj = await pdfObj.get();
            const {height, width, ...other} = object.toObject()
            obj.set(other);
            resolve(obj)
        });
    }
}