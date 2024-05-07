interface PdfAsImg {
    getPage(num: number) : Promise<HTMLImageElement>;
    getAllPages() : Promise<HTMLImageElement[]>;
    getPagesCount() : Promise<number>;
}

export default PdfAsImg;