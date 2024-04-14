import {fabric} from "fabric";
import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import {v4 as uuidv4} from "uuid";

export default class SVGUtil {
    private constructor() {
    }

    public static createFromFile(file: File) : Promise<(fabric.Object | fabric.Group) & UniboardData> {
        let promise = new Promise<(fabric.Object | fabric.Group) & UniboardData>((resolve, reject) => {
            if (file.type != "image/svg+xml") {
                reject(new Error("Попытка создания svg-объекта не из svg-файла"));
                return;
            }

            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (svgElement) => {
                if (!svgElement.target || typeof svgElement.target.result !== 'string') {
                    reject(new Error("Некорректный файл"));
                    return;
                }

                fabric.loadSVGFromString(svgElement.target.result,  async (objects, options) => {
                    const svgObject = fabric.util.groupSVGElements(objects, options);
                    let resultObj : fabric.Object & UniboardData;

                    if (svgObject instanceof fabric.Group) {
                        const formData = new FormData();
                        formData.append("somefile", file);
                        let response = await fetch(`http://${process.env["NEXT_PUBLIC_API_HOST"]}:${process.env["NEXT_PUBLIC_API_PORT"]}/storage/add`,
                            {
                                method: "POST",
                                body: formData,
                            });

                        let {id} : {id: string} = await response.json();
                        resultObj = Object.assign(svgObject, {
                            uniboardData: {
                                id: uuidv4(),
                                creator: "1",
                                persistedOnServer: false,
                                type: "uniboard/svg",
                                data: id,
                            }
                        });
                    } else {
                        if (!svgObject.type) {
                            reject(new Error("Непредвиденная ошибка: тип созданного объекта не определен"));
                            return;
                        }
                        resultObj = Object.assign(svgObject, {
                            uniboardData: {
                                id: uuidv4(),
                                creator: "1",
                                persistedOnServer: false,
                                type: svgObject.type,
                            }
                        });
                    }

                    resolve(resultObj);
                });
            }
        });

        return promise;
    }


    public static enlivenFromObject(object: fabric.Object & UniboardData) : Promise<fabric.Object & UniboardData> {
        let promise = new Promise<fabric.Object & UniboardData>(async (resolve, reject) => {
            if (object.uniboardData.type !== 'uniboard/svg') {
                reject(new Error("Данный объект не является объектом типа \"uniboard\\svg\""));
                return;
            }

            let res = await fetch(`http://${process.env["NEXT_PUBLIC_API_HOST"]}:${process.env["NEXT_PUBLIC_API_PORT"]}/storage/${object.uniboardData.data}`, {
                method: "GET",
            });

            let blob = await res.blob();
            let fileReader = new FileReader();
            fileReader.readAsText(blob);

            fileReader.onload = (svgElement) => {
                if (!svgElement.target || typeof svgElement.target.result !== 'string') {
                    reject(new Error("Некорректный файл"));
                    return;
                }

                fabric.loadSVGFromString(svgElement.target.result, (objects, options) => {
                    let svg = fabric.util.groupSVGElements(objects, options);

                    svg.set(object.toObject());

                    let obj: UniboardData & fabric.Object = Object.assign(svg, {
                        uniboardData: object.uniboardData,
                    })

                    resolve(obj);
                })
            }
        });


        return promise;
    }
}