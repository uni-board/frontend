import PdfAsImg from "@/app/board/[id]/utils/helpers/pdf-as-img/PdfAsImg";
export default class PDFConverterBackend implements PdfAsImg {
    private readonly pdfId: string;
    private pagesId: string[] | undefined;
    private readonly pages: Map<number, HTMLImageElement>
    constructor(pdfId: string) {
        this.pdfId = pdfId;
        this.pages = new Map();
    }
    public getAllPages(): Promise<HTMLImageElement[]> {
        return new Promise(async (resolve, reject) => {
            const pages: HTMLImageElement[] = [];
            const pagesCount : number = await this.getPagesCount();
            for (let i = 0; i < pagesCount; i++) {
                pages.push(await this.getPage(i))
            }
            resolve(pages);
        })
    }

    public async getPage(num: number): Promise<HTMLImageElement> {
        num = num - 1;
        return new Promise(async (resolve, reject) => {
            let page = this.pages.get(num);
            if (page) {
                resolve(page);
                return;
            }

            const pagesId = await this.getPagesId();
            const image = await this.loadPage(pagesId[num]);
            this.pages.set(num, image);
            resolve(image);
        });
    }

    private async loadPage(pageId: string) : Promise<HTMLImageElement> {
        return new Promise(async (resolve, reject) => {
            const res =  await fetch(`http://${process.env["NEXT_PUBLIC_API_HOST"]}:${process.env["NEXT_PUBLIC_API_PORT"]}/storage/${pageId}`, {
                method: "GET",
            });
            let blob = await res.blob();
            const reader = new FileReader();
            reader.onload = (imageElement) => {
                if (!imageElement.target || typeof imageElement.target.result !== 'string') {
                    reject(new Error("Некорректный файл"));
                    return;
                }

                let image = new Image();
                image.src = imageElement.target.result;
                image.onload = () => {
                    console.log("image get");
                    resolve(image);
                }
            }
            reader.readAsDataURL(blob);
        })

    }

    public getPagesCount(): Promise<number> {
        return new Promise(async (resolve, reject) => {
            const _pagesId = await this.getPagesId();
            resolve(_pagesId.length);
        });
    }

    private async getPagesId() : Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            if (this.pagesId) {
                resolve(this.pagesId);
                return;
            }

            await this.loadPagesData();
            if (!this.pagesId) {
                reject(new Error("Ошибка загрузки информации о страницах"));
                return;
            }

            resolve(this.pagesId);
        });
    }

    private async loadPagesData()  {
        const res = await fetch(`http://${process.env["NEXT_PUBLIC_API_HOST"]}:${process.env["NEXT_PUBLIC_API_PORT"]}/pdf/split?id=${this.pdfId}`, {
            method: "POST",
        });
        let data : string[] = await res.json();
        this.pagesId = data;
        console.log("pages data loaded")
    }


}