import ToolsOptions from "@/app/board/[id]/utils/options/ToolsOptions";

export default class OptionsController {
    public readonly options: ToolsOptions;

    constructor() {
        this.options = {
            currentColor: '#ff5900',
            currentWidth: 5,
            fill: false,
            stickerColor: "yellow",
        };
    }

}