import SwitchableTools from "@/app/board/[id]/utils/tools/tools-controller/SwitchableTools";
import UniboardUtil from "@/app/board/[id]/utils/UniboardUtil";
import {useEffect, useRef, useState} from "react";
import {RGBColor, SketchPicker} from "react-color";
import clsx from "clsx";
import tool from "@/app/board/[id]/components/tool-bar/tool/tool.module.css";
import Image from "next/image";
import textbox from "@/app/board/[id]/components/tool-bar/icons/letter-t.png";

export default function TextboxTool({switchToolOn, actualToolType, setOption} : {switchToolOn: ((tool: keyof SwitchableTools) => void) | undefined, actualToolType: keyof SwitchableTools, setOption: UniboardUtil | undefined}) {
    const [color, setColor] = useState<RGBColor>({r: 88, g: 189, b: 106, a: 1});
    const name : keyof SwitchableTools = "textbox";

    const [active, setActive] = useState(false);
    const toolRef = useRef<HTMLDivElement>(null);


    const handleClick = (e : MouseEvent) => {
        if (toolRef.current &&  !toolRef.current.contains(e.target as Node)) {
            setActive(false);
            return;
        }
    }

    useEffect(() => {
        window.addEventListener("pointerdown", handleClick);
        return () => {
            window.removeEventListener("pointerdown", handleClick)
        }
    }, []);
    return (
        <div className={"tool_wrapper"} ref={toolRef}>
            <button
                className={clsx(tool.tool, {[tool.active_tool]: actualToolType == name})}
                onClick={() => {
                    if (setOption) {
                        setOption.setOption("currentColor", `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})`);
                        setOption.switchToolOn(name);
                    }
                    setActive(true);
                }}
            >
                <Image src={textbox} width={30} height={30} alt={`Выбор инструмента {name}`}/>
            </button>
            {actualToolType == name ?
                <div className={"settings-wrapper "  + (active ? "active" : "")}>
                    <div className={"settings"}>
                        <div>
                            <SketchPicker color={color} onChange={(clr) => {
                                if (setOption) {
                                    console.log("color text")
                                    setOption.setOption("currentColor", `rgba(${clr.rgb.r}, ${clr.rgb.g}, ${clr.rgb.b}, ${clr.rgb.a ? clr.rgb.a : 1})`);
                                    setOption.switchToolOn("textbox");
                                }
                                console.log(clr.rgb)
                                setColor(clr.rgb);
                            }}/>
                        </div>
                    </div>
                </div> : null
            }
        </div>
    )
}