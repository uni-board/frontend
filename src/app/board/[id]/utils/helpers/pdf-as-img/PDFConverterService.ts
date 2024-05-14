import PdfAsImg from "@/app/board/[id]/utils/helpers/pdf-as-img/PdfAsImg";

export default class PDFConverterService implements PdfAsImg {

    private totalPages: number;
    private images: Promise<HTMLImageElement>[]
    constructor(totalPages: number, images: Promise<HTMLImageElement>[]) {
        this.totalPages = totalPages;
        this.images = images;
    }


    getAllPages(): Promise<HTMLImageElement[]> {
        return Promise.all(this.images);
    }

    getPage(num: number): Promise<HTMLImageElement> {
        return this.images[num-1];
    }

    getPagesCount(): Promise<number> {
        return Promise.resolve(this.totalPages);
    }

    public static async convert(pdfId: string) {
        const {totalPages, images} = await this.loadData(pdfId);;
        return new PDFConverterService(totalPages, images);
    }

    private static async loadData(pdfId: string) : Promise<{totalPages: number, images: Promise<HTMLImageElement>[]}> {
        const start = new Date().getTime();
        const res = await fetch(`http://localhost:3021/parse/stream?id=${pdfId}`, {
            method: "GET",
            headers: {
                "Access-Control-Request-Headers": "X-Total-Pages",
            }
        });
        console.log(`fetch in ${new Date().getTime() - start}`);

        if (!res.body) throw new Error();
        const totalPagesHeader = res.headers.get("X-Total-Pages");
        const totalPages = totalPagesHeader ? +totalPagesHeader : 0;


        const images : Promise<HTMLImageElement>[] = [];
        const imagesResolve: ((value: (HTMLImageElement | PromiseLike<HTMLImageElement>)) => void)[] = [];
        for (let i = 0; i < totalPages; i++) {
            const {promise, resolve} = Promise.withResolvers<HTMLImageElement>()
            images.push(promise);
            imagesResolve.push(resolve);
        }


        const read = async (reader : ReadableStreamDefaultReader<Uint8Array>) => {
            let buffer = "";
            const decoder = new TextDecoder();
            let imageIdx = 0;
            while (true) {

                const {done, value} = await reader.read();
                if (done || !value) break;

                buffer += decoder.decode(value, {stream: true});
                const boundary = buffer.lastIndexOf("\n");
                if (boundary !== -1) {
                    const completeData = buffer.substring(0, boundary);
                    buffer = buffer.substring(boundary + 1);

                    completeData.split(`\n`).forEach(chunk => {
                        if (chunk) {
                            const image = new Image();
                            const resolve = imagesResolve[imageIdx];
                            console.log(`image ${imageIdx} ready in ${new Date().getTime() - start}`)
                            image.src = chunk;
                            image.onload = () => resolve(image);
                            imageIdx++;
                        }
                    });
                }
            }
        }
        read(res.body.getReader());

        return {totalPages, images}
    }
}