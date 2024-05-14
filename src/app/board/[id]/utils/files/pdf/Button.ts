import {fabric} from "fabric";

export default abstract class Button {
    protected button : fabric.Object;
    protected readonly parent: fabric.Object;
    protected readonly onclick: ((e?: fabric.IEvent) => void | Promise<void>) | undefined;
    protected readonly canvas: fabric.Canvas;
    private onCanvas: boolean;
    protected constructor(parent: fabric.Object, canvas: fabric.Canvas, onclick?: (e?: fabric.IEvent) => void | Promise<void>) {
        this.parent = parent;
        this.canvas = canvas;
        this.onclick = onclick;
        this.onCanvas = false;
        this.button = this.createObject();
        this.updateSizeWithAngleAndMove();
        this.trackParentModifications();
        this.trackClickOnButton();
    }

    protected updateSizeWithAngleAndMove = () : void => {
        const buttonWidth = this.button.width || 0;
        const buttonHeight = this.button.height || 0;
        const matrix = this.parent.calcTransformMatrix()
        const size = this.getSize();
        const parentScaleX = this.parent.scaleX || 1;
        const parentScaleY = this.parent.scaleY || 1;
        const parentAngle = this.parent.angle || 0;
        const scaleX = (size.width / buttonWidth) * parentScaleX;
        const scaleY = (size.height / buttonHeight) * parentScaleY;
        this.button.rotate(parentAngle);
        this.button.set({
            scaleX,
            scaleY,
        });
        const relativePosition = this.getRelativePosition()
        const actualPoint = fabric.util.transformPoint(relativePosition, matrix);
        this.button.set({
            left: actualPoint.x,
            top: actualPoint.y,
        });
        if (this.onCanvas) {
            this.canvas.remove(this.button);
            this.canvas.add(this.button);
        }
    }

    private trackParentModifications = () : void => {
        const events = ["rotating", "scaling", "moving", "skewing"];
        events.forEach((event) => {
            this.parent.on(event, this.updateSizeWithAngleAndMove)
        })
    }

    private trackClickOnButton = () : void => {
        this.button.on("mousedown", (e) => {
            if (this.onclick) {
                this.onclick(e);
            }
            this.canvas.setActiveObject(this.parent);
        })
    }

    public add = () : void => {
        this.canvas.add(this.button);
        this.onCanvas = true;
    }

    public remove = () : void => {
        this.canvas.remove(this.button);
        this.onCanvas = false;
    }

    public isClicked = (e: fabric.IEvent) : boolean => {
        return e.target == this.button;
    }

    protected abstract createObject() : fabric.Object;
    protected abstract getRelativePosition() : fabric.Point;
    protected abstract getSize() : {width: number, height: number};
}