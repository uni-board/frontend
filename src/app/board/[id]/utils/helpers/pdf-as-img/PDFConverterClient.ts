import * as pdfjs from 'pdfjs-dist';
import PdfAsImg from "@/app/board/[id]/utils/helpers/pdf-as-img/PdfAsImg";

export default class PDFConverterClient implements PdfAsImg{

    private file : File;
    constructor(file: File) {
        this.file = file;

    }
    async getAllPages(): Promise<HTMLImageElement[]> {
        return new Promise(async (resolve, reject) => {
            const res = [];
            let arrayBuffer : ArrayBuffer = await this.file.arrayBuffer();
            let pdf = await (pdfjs.getDocument(arrayBuffer).promise);
            for (let i = 0; i < pdf.numPages; i++) {
                res.push(await this.getPage(i+1));
            }
            resolve(res);
        })
    }

    getPage(num: number): Promise<HTMLImageElement> {
        return new Promise(async (resolve, reject) => {
            let arrayBuffer : ArrayBuffer = await this.file.arrayBuffer();
            let pdf = await (pdfjs.getDocument(arrayBuffer).promise);
            pdf.getPage(num).then((page) => {
                page.getOperatorList().then(ops => {
                    for (let i = 0; i < ops.fnArray.length; i++) {
                        if (ops.fnArray[i] == pdfjs.OPS.paintImageXObject) {
                            console.log(ops.argsArray[i][0]);
                            resolve(ops.argsArray[i][0])
                        }
                    }
                })
            })
        })

    }

    async getPagesCount(): Promise<number> {
        return new Promise(async (resolve) => {
            let arrayBuffer : ArrayBuffer = await this.file.arrayBuffer();
            let pdf = await (pdfjs.getDocument(arrayBuffer).promise);
            resolve(pdf.numPages);
        })
    }

}