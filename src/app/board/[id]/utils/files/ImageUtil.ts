import {fabric} from "fabric";
import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import {v4 as uuidv4} from "uuid";

export default class ImageUtil {
    private constructor() {
    }

    public static createFromFile(file: File) : Promise<fabric.Object & UniboardData> {
        let promise = new Promise<fabric.Object & UniboardData>((resolve, reject) => {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                reject(new Error("Попытка создания изображения из некорректных файлов"));
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async (imageElement) => {
                if (!imageElement.target || typeof imageElement.target.result !== 'string') {
                    reject(new Error("Некорректный файл"));
                    return;
                }
                const image = new Image();
                image.src = imageElement.target.result;

                const formData = new FormData();
                formData.append("somefile", file);
                let response = await fetch(`${process.env["NEXT_PUBLIC_API_URL"]}/storage/add`,
                    {
                        method: "POST",
                        body: formData,
                    });
                let {id} : {id: string} = await response.json();

                let obj = Object.assign(new fabric.Image(image), {
                    uniboardData: {
                        id: uuidv4(),
                        creator: "1",
                        persistedOnServer: false,
                        type: "uniboard/image",
                        data: id,
                    }
                });

                resolve(obj);


            }
        });

        return promise;
    }

    public static enlivenFromObject(object: fabric.Object & UniboardData) : Promise<fabric.Object & UniboardData> {
        let promise = new Promise<fabric.Object & UniboardData>(async (resolve, reject) => {
            if (object.uniboardData.type !== 'uniboard/image') {
                reject(new Error("Данный объект не является объектом типа \"uniboard\\image\""))
                return;
            }

            let res = await fetch(`${process.env["NEXT_PUBLIC_API_URL"]}/storage/${object.uniboardData.data}`, {
                method: "GET",
            });

            let blob = await res.blob();
            let fileReader = new FileReader();
            fileReader.readAsDataURL(blob);
            fileReader.onload = (imageElement) => {
                if (!imageElement.target || typeof imageElement.target.result !== 'string') {
                    reject(new Error("Некорректный файл"));
                    return;
                }

                let image = new Image();
                image.src = imageElement.target.result;

                image.onload = () => {
                    let obj = new fabric.Image(image);

                    obj.set(object.toObject());

                    let result = Object.assign(obj, {
                        uniboardData: object.uniboardData,
                    });

                    resolve(result);
                }
            }
        });

        return promise;
    }
}