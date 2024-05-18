import {fabric} from "fabric";
import UniboardData, {hasUniboardData} from "@/app/board/[id]/utils/tools/UniboardData";
import {v4 as uuidv4} from "uuid";

export default class FilesUtil {
    private constructor() {
    }

    private static readonly fileSVG : string = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

    public static createFromFile(file: File) : Promise<fabric.Object & UniboardData> {
        let promise : Promise<fabric.Object & UniboardData> = new Promise(async (resolve, reject) => {
            if (file.type == 'image/svg' || file.type == 'image/jpeg' || file.type == 'image/png') {
                reject(new Error("Попытка создать ссылку на изображение"));
                return;
            }

            const formData = new FormData();
            formData.append("somefile", file);

            let response = await fetch(`${process.env["NEXT_PUBLIC_API_URL"]}/storage/add`,
                {
                    method: "POST",
                    body: formData,
                });
            let {id} : {id: string} = await response.json();

            let obj = await this.createFileIcon(file.name);
            let res = Object.assign(obj, {
                uniboardData: {
                    id: uuidv4(),
                    creator: "1",
                    persistedOnServer: false,
                    type: "uniboard/file",
                    data: id,
                    fileName: file.name
                }
            });


            resolve(res);
        });

        return promise;
    }

    public static enlivenFromObject(object: fabric.Object & UniboardData) : Promise<fabric.Object & UniboardData> {
        let promise : Promise<fabric.Object & UniboardData> = new Promise(async (resolve, reject) => {
            if (object.uniboardData.type !== 'uniboard/file') {
                reject(new Error("Данный объект не является объектом типа \"uniboard\\file\""));
                return;
            }

            if (!object.uniboardData.data || !object.uniboardData.fileName) {
                reject(new Error("Некорректные данные в поле uniboardData"));
                return;
            }

            let obj = await this.createFileIcon(object.uniboardData.fileName);

            obj.set(object.toObject());

            let res = Object.assign(obj, {
                uniboardData: object.uniboardData,
            })

            resolve(res);
        });

        return promise;
    }

    private static createFileIcon(fileName: string): Promise<fabric.Group> {
        return new Promise<fabric.Group>((resolve, reject) => {
            fabric.loadSVGFromURL('/file.svg', (objects, options) => {
                let obj = fabric.util.groupSVGElements(objects, options);

                if (!(obj instanceof fabric.Group)) {
                    throw new Error("Что-то не так с иконкой файла");
                }


                let text = new fabric.IText(fileName);
                text.set({
                    top:  - 100,
                    originX: "center",
                    left: 0,
                })

                obj.add(text);
                obj.on("mousedblclick", async (e) => {
                    if (!e.target) return;

                    if (!hasUniboardData(e.target) || !e.target.uniboardData.fileName) {
                        throw new Error("Некорректный элемент: отсутсвует или некорректная uniboardData.")
                    }

                    let blob = await fetch(`${process.env["NEXT_PUBLIC_API_URL"]}/storage/${e.target.uniboardData.data}`, {
                        method: "GET",
                    }).then((value) => value.blob());

                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = e.target.uniboardData.fileName;
                    try {
                        link.click();
                    } catch (err) {
                        console.error("Ошибка при загрузке файла");
                    }
                });

                resolve(obj);
            });
        });
    }

}