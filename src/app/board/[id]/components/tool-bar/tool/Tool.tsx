import clsx from "clsx";
import tool from "@/app/board/[id]/components/tool-bar/tool/tool.module.css";
import Image from "next/image";
import SwitchableTools from "@/app/board/[id]/utils/tools/tools-controller/SwitchableTools";
import {StaticImport} from "next/dist/shared/lib/get-img-props";

export default function Tool({switchToolOn, actualToolType, name, imageSrc} : {switchToolOn: ((tool: keyof SwitchableTools) => void) | undefined, actualToolType: keyof SwitchableTools, name: keyof SwitchableTools, imageSrc : string | StaticImport}) {
    return (
        <button
            className={clsx(tool.tool, {[tool.active_tool]: actualToolType == name})}
            onClick={() => switchToolOn ? switchToolOn(name) : null}
        >
            <Image src={imageSrc} width={30} height={30} alt={`Выбор инструмента {name}`}/>
        </button>
    )
}