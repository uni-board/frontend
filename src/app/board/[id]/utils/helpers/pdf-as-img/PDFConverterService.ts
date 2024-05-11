import PdfAsImg from "@/app/board/[id]/utils/helpers/pdf-as-img/PdfAsImg";

export default class PDFConverterService implements PdfAsImg {

    private pdfId : string;
    private pdfLength : number | undefined;
    constructor(pdfId: string) {
        this.pdfId = pdfId;
    }

    async getAllPages(): Promise<HTMLImageElement[]> {
        let pages : Promise<HTMLImageElement>[] = [];
        let length = await this.getPagesCount();
        for (let i = 1; i <= length; i++) {
            pages.push(this.getPage(i));
        }
        return  Promise.all(pages)
    }

    getPage(num: number): Promise<HTMLImageElement> {
        return new Promise( async (resolve, reject) => {
            const dataURL = await fetch(`http://localhost:3022/parse/page?id=${this.pdfId}&page=${num}`)
                .then(res => res.text());
            const img = new Image();
            img.src = dataURL;
            img.onload = () => resolve(img)
        })
    }

    async getPagesCount(): Promise<number> {
        if (this.pdfLength) {
            return Promise.resolve(this.pdfLength);
        }
        const res = await fetch(`http://localhost:3022/parse/length?id=${this.pdfId}`, {
            method: "GET",
        });
        const value_1 = await res.json();
        return value_1.length;
    }
}