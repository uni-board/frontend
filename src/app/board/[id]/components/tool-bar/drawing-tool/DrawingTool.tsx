import SwitchableTools from "@/app/board/[id]/utils/tools/tools-controller/SwitchableTools";
import UniboardUtil from "@/app/board/[id]/utils/UniboardUtil";
import drawing from "@/app/board/[id]/components/tool-bar/icons/pencil.png";
import Slider from "@/app/board/[id]/components/tool-bar/slider/Slider";
import "./drawing-tool.css";
import {RefObject, useEffect, useRef, useState} from "react";
import clsx from "clsx";
import tool from "@/app/board/[id]/components/tool-bar/tool/tool.module.css";
import Image from "next/image";
import {RGBColor, SketchPicker} from 'react-color';
export default function DrawingTool({switchToolOn, actualToolType, setOption} : {switchToolOn: ((tool: keyof SwitchableTools) => void) | undefined, actualToolType: keyof SwitchableTools, setOption: UniboardUtil | undefined}) {
    const [width, setWidth] = useState<number>(5);
    const [color, setColor] = useState<RGBColor>({r: 88, g: 189, b: 106, a: 1});
    const [active, setActive] = useState(false);
    const toolRef = useRef<HTMLDivElement>(null);
    const name : keyof SwitchableTools = "drawing";

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
                        setOption.setOption("currentWidth", width);
                        setOption.setOption("currentColor", `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})`);
                        setOption.switchToolOn(name);
                        setActive(true);
                    }
                }}
            >
                <Image src={drawing} width={30} height={30} alt={`Выбор инструмента {name}`}/>
            </button>
            {actualToolType == name ?
                <div className={"settings-wrapper " + (active ? "active" : "")}>
                    <div className={"settings"}>
                        <Slider min={1} max={60} value={width} steps={1}
                                onChange={(value: number) => {
                                    if (setOption) {
                                        setOption.setOption("currentWidth", value);
                                        setOption.switchToolOn(name);
                                    }
                                    setWidth(value);
                                }}
                                style={{backgroundColor: "#f3f3f3", width: "250px", height: "50px"}}/>
                        <div>
                            <SketchPicker color={color} onChange={(clr) => {
                                if (setOption) {
                                    setOption.setOption("currentColor", `rgba(${clr.rgb.r}, ${clr.rgb.g}, ${clr.rgb.b}, ${clr.rgb.a ? clr.rgb.a : 1})`);
                                    setOption.switchToolOn(name);
                                }
                                setColor(clr.rgb);
                            }}/>
                        </div>
                    </div>
                </div> : null
            }
        </div>
    )
}