import ArrowButton from "@/app/board/[id]/utils/files/pdf/ArrowButton";
import {Canvas, IEvent, Object, Point} from "fabric/fabric-impl";
import {fabric} from "fabric";

export default class NextButton extends ArrowButton {

    constructor(parent: Object, canvas: Canvas, onclick: (e?: IEvent) => (void | Promise<void>)) {
        super(parent, canvas, onclick, 0);
    }

    protected getRelativePosition(): Point  {
        const pdfObjWidth = this.parent.width || 0;
        const pdfObjHeight = this.parent.height || 0;
        const rectWidth = pdfObjWidth * 0.06
        const point = new fabric.Point(pdfObjWidth / 2 - rectWidth, -pdfObjHeight/2 - rectWidth * 1.25);
        return point;
    }


}