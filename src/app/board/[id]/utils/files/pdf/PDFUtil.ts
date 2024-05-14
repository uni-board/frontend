import {fabric} from "fabric";
import UniboardData from "@/app/board/[id]/utils/tools/UniboardData";
import PdfAsImg from "@/app/board/[id]/utils/helpers/pdf-as-img/PdfAsImg";
import PDFConverterBackend from "@/app/board/[id]/utils/helpers/pdf-as-img/PDFConverterBackend";
import {v4 as uuidv4} from "uuid";
import {PdfObject} from "@/app/board/[id]/utils/files/pdf/PdfObject";


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