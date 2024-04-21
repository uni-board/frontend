import ToolsOptions from "@/app/board/[id]/utils/options/ToolsOptions";

export default class OptionsController {
    private readonly options: ToolsOptions;

    constructor() {
        this.options = {
            currentColor: '#ff5900',
            currentWidth: 5,
            fill: false,
            stickerColor: "yellow",
        };
    }

    public set<K extends keyof ToolsOptions>(key : K, value : ToolsOptions[K]) : void {
        this.options[key] = value;
    }

    public get<K extends keyof ToolsOptions>(key: K) : ToolsOptions[K] {
        return this.options[key];
    }
}