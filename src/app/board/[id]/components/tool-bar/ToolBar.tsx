import SwitchableTools from "@/app/board/[id]/utils/tools/tools-controller/SwitchableTools";
import toolbar from "./toolbar.module.css";
import stickyNote from "./icons/sticky-note.png";
import Tool from "@/app/board/[id]/components/tool-bar/tool/Tool";
import SelectTool from "@/app/board/[id]/components/tool-bar/select-tool/SelectTool";
import UniboardUtil from "@/app/board/[id]/utils/UniboardUtil";
import DrawingTool from "@/app/board/[id]/components/tool-bar/drawing-tool/DrawingTool";
import TextboxTool from "@/app/board/[id]/components/tool-bar/textbox-tool/TextboxTool";
import FiguresTool from "@/app/board/[id]/components/tool-bar/figures-tool/FiguresTool";
import "./styles.css";
import StickyNoteTool from "@/app/board/[id]/components/tool-bar/sticky-note-tool/StickyNoteTool";
export default function ToolBar({switchToolOn, actualToolType, setOption} : {switchToolOn: ((tool: keyof SwitchableTools) => void) | undefined, actualToolType: keyof SwitchableTools, setOption: UniboardUtil | undefined}) {
    return (
        <div className={toolbar.toolbar}>
            <SelectTool switchToolOn={switchToolOn} actualToolType={actualToolType} setOption={setOption}/>
            <DrawingTool switchToolOn={switchToolOn} actualToolType={actualToolType} setOption={setOption}/>
            <FiguresTool switchToolOn={switchToolOn} actualToolType={actualToolType} setOption={setOption}/>
            <TextboxTool switchToolOn={switchToolOn} actualToolType={actualToolType} setOption={setOption}/>
            <StickyNoteTool switchToolOn={switchToolOn} actualToolType={actualToolType} setOption={setOption}/>
        </div>
    );
};