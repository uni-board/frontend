import Button from "@/app/board/[id]/utils/files/pdf/Button";
import {fabric} from "fabric";

export default abstract class ArrowButton extends Button {
    protected angle: number;
    constructor(parent: fabric.Object, canvas: fabric.Canvas, onclick: (e?: fabric.IEvent) => (void | Promise<void>), angle: number) {
        super(parent, canvas, onclick);
        this.angle = angle;
    }

    private object : fabric.Object | undefined;

    protected createObject(): fabric.Object {
        if (this.object) {
            return this.object;
        }
        const image = new Image();
        image.src = "/next-button.png";
        const group : fabric.Group = new fabric.Group([new fabric.Rect({
            width: 100,
            height: 100,
            fill: "#58BD6A",
        })], {
            lockMovementY: true,
            lockMovementX: true,
            hasBorders: false,
            hasControls: false,
            perPixelTargetFind: false,
            hoverCursor: "pointer",
            selectable: true,
        });
        image.onload = () => {
            const angle = group.angle || 0;
            group.rotate(0);
            const imgObj : fabric.Image = new fabric.Image(image,{
                top: group.top || 0,
                left: group.left || 0,
            });
            imgObj.set({
                scaleY: (group.height || 1) / image.height * (group.scaleY || 1),
                scaleX: (group.width || 1) / image.width * (group.scaleX || 1),
            })
            imgObj.rotate(this.angle);
            group.remove(...group.getObjects());
            group.addWithUpdate(imgObj);
            group.rotate(angle)
            this.canvas.renderAll();
        }
        this.object = group;
        return group;

    }

    protected abstract getRelativePosition(): fabric.Point;

    protected getSize(): { width: number; height: number } {
        const pdfObjWidth = this.parent.width || 0;
        const rectWidthAndHeight = pdfObjWidth * 0.06
        return {height: rectWidthAndHeight, width: rectWidthAndHeight};
    }
}