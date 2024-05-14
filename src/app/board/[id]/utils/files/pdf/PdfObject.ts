import PdfAsImg from "@/app/board/[id]/utils/helpers/pdf-as-img/PdfAsImg";
import {fabric} from "fabric";
import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import Button from "@/app/board/[id]/utils/files/pdf/Button";
import NextButton from "@/app/board/[id]/utils/files/pdf/NextButton";
import PrevButton from "@/app/board/[id]/utils/files/pdf/PrevButton";
import {IEvent} from "fabric/fabric-impl";

export class PdfObject {

    private readonly pdf: PdfAsImg;
    private image: fabric.Image;
    private readonly object: fabric.Group & UniboardData;
    private page: number;
    private mouseIn: boolean;
    private nextButton: Button | undefined;
    private prevButton: Button | undefined;

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
        this.changePageOn(1);
    }

    private readonly prevPage = async () => {
        this.changePageOn(-1);
    }

    private readonly changePageOn = async (n: number) => {
        const pagesCount = await this.pdf.getPagesCount();
        this.page += n;
        if (this.page > pagesCount) {
            this.page = 1;
        }

        if (this.page < 1) {
            this.page = pagesCount;
        }

        const newImage = await this.getPageImage(this.page);
        const pdfObjSettings = this.getPdfObjSettingsAndSetToDefault();
        const point = this.calcActualImagePos();
        this.positionImage(newImage, point);
        this.updateImage(newImage);
        this.returnSettingsToPrevious(pdfObjSettings);
        this.object.fire("moving");
    }

    private readonly getPageImage = (page: number): Promise<fabric.Image> => {
        return new Promise(async (resolve, reject) => {
            const firstPage = await this.pdf.getPage(page);
            const image = new fabric.Image(firstPage);
            resolve(image);
        })
    }

    private readonly getPdfObjSettingsAndSetToDefault = (): { angle: number, scaleX: number, scaleY: number } => {
        let res = {
            angle: this.object.angle || 0,
            scaleX: this.object.scaleX || 1,
            scaleY: this.object.scaleY || 1,
        }
        this.object.rotate(0);
        this.object.scale(1);

        return res;
    }

    private readonly calcActualImagePos = (): fabric.Point => {
        const matrix = this.object.calcTransformMatrix();
        const point = fabric.util.transformPoint(new fabric.Point(this.image.left || 0, this.image.top || 0), matrix);
        return point;
    }

    private readonly positionImage = (image: fabric.Image, point: fabric.Point) => {
        image.set({
            left: point.x,
            top: point.y
        })
    }

    private readonly updateImage = (newImage: fabric.Image) => {
        const background = PdfObject.createBackgroundObjectFor(newImage);
        this.object.remove(...this.object.getObjects());
        this.object.addWithUpdate(background)
        this.object.addWithUpdate(newImage);
        this.image = newImage;
    }

    private readonly returnSettingsToPrevious = (prevSettings: { angle: number, scaleX: number, scaleY: number }) => {
        this.object.set({
            scaleX: prevSettings.scaleX,
            scaleY: prevSettings.scaleY,
        })
        this.object.rotate(prevSettings.angle);
        if (this.object.canvas) {
            this.object.canvas.requestRenderAll();
        }
    }

    private trackMousePosition = () => {
        this.object.on("mouseover", () => this.mouseIn = true);
        this.object.on("mouseout", () => this.mouseIn = false);
    }

    private readonly handleClickInside = () => {
        this.object.on("mousedown", this.setupButtons)
    }

    private readonly setupButtons = () => {
        if (this.nextButton || this.prevButton) {
            return;
        }
        if (this.object.canvas) {
            const buttonNext = new NextButton(this.object, this.object.canvas, this.nextPage);
            const buttonPrev = new PrevButton(this.object, this.object.canvas, this.prevPage);
            buttonNext.add();
            buttonPrev.add();
            this.nextButton = buttonNext;
            this.prevButton = buttonPrev;
            const handleClickOutside = (e: IEvent) => {
                if (this.mouseIn || buttonNext.isClicked(e) || buttonPrev.isClicked(e)) {
                    return;
                }
                buttonNext.remove();
                buttonPrev.remove();
                this.nextButton = undefined;
                this.prevButton = undefined;
                this.object.canvas?.off("mouse:down", handleClickOutside);
            }

            this.object.canvas.on("mouse:down", handleClickOutside);
        }
    }

    public static createPdfObject(pdf: PdfAsImg, uniboardData: UniboardData): Promise<PdfObject> {
        return new Promise(async (resolve, reject) => {
            const image: fabric.Image = await this.getPageAsFabricImage(pdf, 1);
            const object: fabric.Group & UniboardData = this.createPDFObject(image, uniboardData);
            const pdfObj = new PdfObject(pdf, image, object);
            resolve(pdfObj)
        });
    }

    private static getPageAsFabricImage(pdf: PdfAsImg, page: number): Promise<fabric.Image> {
        return new Promise(async (resolve, reject) => {
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

    private static readonly createBackgroundObjectFor = (image: fabric.Image): fabric.Object => {
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

    public get = (): fabric.Object & UniboardData => {
        return this.object;
    }
}