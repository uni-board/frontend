import SwitchableTools from "@/app/board/[id]/utils/tools/tools-controller/SwitchableTools";
import select from "@/app/board/[id]/components/tool-bar/icons/selection-tool.png";
import "./select-tool.css"
import UniboardUtil from "@/app/board/[id]/utils/UniboardUtil";
import clsx from "clsx";
import tool from "@/app/board/[id]/components/tool-bar/tool/tool.module.css";
import Image from "next/image";

export default function SelectTool({switchToolOn, actualToolType, setOption} : {switchToolOn: ((tool: keyof SwitchableTools) => void) | undefined, actualToolType: keyof SwitchableTools, setOption: UniboardUtil | undefined}) {
    const name : keyof SwitchableTools = "select";

    return (
        <div className={"tool_wrapper"}>
            <button
                className={clsx(tool.tool, {[tool.active_tool]: actualToolType == name})}
                onClick={() => {
                    if (setOption) {
                        setOption.switchToolOn(name);
                    }
                }}
            >
                <Image src={select} width={30} height={30} alt={`Выбор инструмента {name}`}/>
            </button>
        </div>
    )
}