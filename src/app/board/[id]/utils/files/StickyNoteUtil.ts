import {fabric} from "fabric";
import UniboardData, {hasUniboardData} from "@/app/board/[id]/utils/tools/UniboardData";
import {v4 as uuidv4} from "uuid";
import {Group, Textbox} from "fabric/fabric-impl";

class StickyNote {
    public sticker : fabric.Group;
    public textbox: fabric.Textbox;
    public isEditing: boolean;
    public overText: boolean;


    constructor(sticker: Group, textbox: Textbox) {
        this.sticker = sticker;
        this.textbox = textbox;
        this.isEditing = false;
        this.overText = false;
    }
}

export default class StickyNoteUtil {
    private constructor() {
    }

    public static create(color : "black" | "blue" | "green" | "red" | "yellow") : Promise<fabric.Group & UniboardData> {
        return new Promise(async (resolve, reject) => {
            const stickyNote = await this.createStickyNoteWithoutUniboardData(color);
            this.addUniboardData(stickyNote, color)
            if (hasUniboardData(stickyNote.sticker)) {
                resolve(stickyNote.sticker);
            } else {
                reject(new Error("Непредвиденная ошибка: не удалось создать поле uniboardData"));
            }
        });
    }

    private static async createStickyNoteWithoutUniboardData(color: "black" | "blue" | "green" | "red" | "yellow") : Promise<StickyNote> {
        return new Promise(async (resolve, reject) => {
            const SVGObject: fabric.Object = await this.createSVGObjectForStickyNoteFromURL(this.getURL(color));
            const text: fabric.Textbox = this.createTextboxForStickyNote(SVGObject, color);
            this.positionSVGObjectAndTextbox(SVGObject, text);

            const stickyNote = new StickyNote(
                this.groupSVGObjectAndTextbox(SVGObject, text),
                text,
            );

            this.addStickyNoteSettings(stickyNote);
            this.addTextboxSettings(stickyNote);

            resolve(stickyNote);
        })
    }

    private static async createSVGObjectForStickyNoteFromURL(url: string) : Promise<fabric.Object> {
        return new Promise((resolve, reject) => {
            fabric.loadSVGFromURL(url, (objects, options) => {
                const SVGObject = fabric.util.groupSVGElements(objects, options);

                resolve(SVGObject);
            })
        })
    }

    private static getURL(color: string): string {
        return `/${color}.svg`;
    }

    private static createTextboxForStickyNote(SVGObject: fabric.Object, color: "black" | "blue" | "green" | "red" | "yellow") {
        return new fabric.Textbox('Text', {
            left: 100,
            top: 100,
            width: (SVGObject.width ? SVGObject.width : 100) - 20,
            fontSize: 166.6,
            lockScalingY: true,
            fill: color == "black" ? 'rgb(255,255,255)' : 'rgb(0,0,0)',
            fontFamily: 'Arial',
        });
    }

    private static positionSVGObjectAndTextbox(SVGObject: fabric.Object, text: fabric.Textbox) {
        SVGObject.set({
            left: (text.left ? text.left : 100) - 10,
            top: (text.top ? text.top : 100) - 10,
        });
    }

    private static groupSVGObjectAndTextbox(SVGObject: fabric.Object, text: fabric.Textbox) {
        return new fabric.Group([SVGObject, text], {
            scaleX: 1,
            scaleY: 1,
            selectable: true,
            evented: true,
        });
    }

    private static addStickyNoteSettings(stickyNote: StickyNote) {
        this.setInvisibleControls(stickyNote);

        stickyNote.sticker.on("mousedblclick", () => {
            this.setUnmodifiable(stickyNote);
            this.enterEditingStickyNote(stickyNote);

            this.handleStopEditing(stickyNote);
        })
    }

    private static setInvisibleControls(stickyNote: StickyNote) {
        const invisibleControls = ['mt', 'mr', 'ml', 'mb', "mtr"];
        invisibleControls.forEach((side) => {
            stickyNote.sticker.setControlVisible(side, false);
        });
    }

    private static setUnmodifiable(stickyNote: StickyNote) {
        stickyNote.sticker.set({
            selectable: false,
            evented: false,
        });

        if (!stickyNote.sticker.canvas) {
            throw new Error("У объекта нет Canvas");
        }

        stickyNote.sticker.canvas.fire("object:modified", {
            target: stickyNote.sticker,
        });
    }

    private static enterEditingStickyNote(stickyNote: StickyNote) {
        const textbox = stickyNote.textbox;
        if (!stickyNote.sticker.canvas) {
            throw new Error("Стикер не имеет Canvas");
        }

        if (!(textbox instanceof fabric.Textbox)) {
            throw new Error("Объект не является Textbox")
        }
        // @ts-ignore
        textbox.scaleX *= stickyNote.sticker.scaleX;
        // @ts-ignore
        textbox.scaleY *= stickyNote.sticker.scaleY;
        // @ts-ignore
        textbox.left = stickyNote.sticker.left + (10 * textbox.scaleX);
        // @ts-ignore
        textbox.top = stickyNote.sticker.top + (10 * textbox.scaleY);

        stickyNote.sticker.remove(textbox);

        stickyNote.sticker.canvas.add(textbox);
        stickyNote.sticker.canvas.setActiveObject(textbox);

        textbox.enterEditing();
        stickyNote.isEditing = true;
    }

    private static handleStopEditing(stickyNote: StickyNote) {
        if (!stickyNote.sticker.canvas) {
            throw new Error("Объект не имеет Canvas");
        }

        const canvas = stickyNote.sticker.canvas;

        const callback = () => {
            if (stickyNote.isEditing && !stickyNote.overText) {
                this.leaveEditing(stickyNote);
                canvas.off("mouse:down", callback);
            }
        }

        canvas.on("mouse:down", callback);
    }

    private static leaveEditing(stickyNote: StickyNote) {
        stickyNote.textbox.exitEditing();
        stickyNote.sticker.canvas?.remove(stickyNote.textbox);
        stickyNote.sticker.addWithUpdate(stickyNote.textbox);
        stickyNote.sticker.canvas?.setActiveObject(stickyNote.sticker);

        this.setModifiable(stickyNote);
        stickyNote.sticker.canvas?.renderAll();
    }

    private static setModifiable(stickyNote: StickyNote) {
        stickyNote.sticker.set({
            selectable: true,
            evented: true,
        });

        if (!stickyNote.sticker.canvas) {
            throw new Error("У объекта нет Canvas");
        }

        stickyNote.sticker.canvas.fire("object:modified", {
            target: stickyNote.sticker,
        });
    }

    private static addTextboxSettings(stickyNote: StickyNote) {
        let {textbox} = stickyNote;
        textbox.on('mouseover', () => {
            stickyNote.overText = true;
        });
        textbox.on('mouseout', () => {
            stickyNote.overText = false;
        });
        textbox.on('changed', () => {
            this.resizeFont(stickyNote);
            if (hasUniboardData(stickyNote.sticker)) {
                stickyNote.sticker.uniboardData.stickerText = textbox.text ? textbox.text : "";
            }
        });

        textbox.set({
            hasControls: false,
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
        });
    }

    private static resizeFont(stickyNote: StickyNote) {
        let textBox = stickyNote.textbox;
        let group = stickyNote.sticker;

        let lineNumber = 0;
        let maxLineTextWidth = 0;

        // Calculation of the maximum line length
        textBox._textLines.forEach(() => {
            const LineTextWidth = textBox.getLineWidth(lineNumber);
            if (LineTextWidth > maxLineTextWidth) { maxLineTextWidth = LineTextWidth; }
            lineNumber += 1;
        });
        textBox.width = maxLineTextWidth;

        // Automatic change of the FontSize
        // @ts-ignore
        const maxfixedWidth = group.item(0).width - 20;
        // @ts-ignore
        const maxfixedHeight = group.item(0).height - 20;
        // @ts-ignore
        const maxfontSize = group.item(0).height - 20;

        let newfontSize = textBox.fontSize;
        // if the text width is too long or too short
        // @ts-ignore
        newfontSize *= maxfixedWidth / (textBox.width + 1);
        // @ts-ignore
        if (newfontSize > maxfontSize) {
            newfontSize = maxfontSize;
            textBox.set({ fontSize: maxfontSize });
        } else {
            textBox.set({ fontSize: newfontSize });
        }
        textBox.width = maxfixedWidth;

        // if the text height is too long or too short
        // @ts-ignore
        while (textBox.height > maxfixedHeight) {
            // @ts-ignore
            const scale = textBox.height / maxfixedHeight;
            // @ts-ignore
            if (textBox.fontSize > maxfontSize) {
                textBox.fontSize = maxfontSize;
            }
            if (scale >= 4) {
                // @ts-ignore
                newfontSize -= scale;
            } else if (scale < 4 && scale >= 1) {
                // @ts-ignore
                newfontSize -= 4;
            } else {
                // @ts-ignore
                newfontSize -= 1;
            }

            textBox.set({ fontSize: newfontSize });
        }

        if (stickyNote.sticker.canvas) {
            stickyNote.sticker.canvas.renderAll();
        }
    }

    private static addUniboardData(stickyNote: StickyNote, color: "black" | "blue" | "green" | "red" | "yellow")  {
        stickyNote.sticker = Object.assign(stickyNote.sticker, {
            uniboardData: {
                id: uuidv4(),
                creator: "1",
                persistedOnServer: false,
                type: "uniboard/stickyNote",
                stickerColor: color,
                stickerText: stickyNote.textbox.text,
            }
        })
    }

    public static async enlivenFromObject(object: fabric.Object & UniboardData) : Promise<fabric.Object & UniboardData> {
        return new Promise(async (resolve, reject) => {
            if (object.uniboardData.type != "uniboard/stickyNote" || !object.uniboardData.stickerColor) {
                reject(new Error("Данный объект не является объектом типа \"uniboard\\styckyNote\" или его цвет не указан"));
                return;
            }
            const stickyNote = await this.createStickyNoteWithoutUniboardData(object.uniboardData.stickerColor);
            stickyNote.sticker.set(object.toObject());
            stickyNote.textbox.set({
                text: object.uniboardData.stickerText,
            })
            this.resizeFont(stickyNote);
            resolve(Object.assign(stickyNote.sticker, {
                uniboardData: object.uniboardData,
            }));
        })
    }
}