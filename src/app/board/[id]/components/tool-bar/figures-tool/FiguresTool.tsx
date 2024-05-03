import {useEffect, useRef, useState} from "react";
import {RGBColor, SketchPicker} from "react-color";
import SwitchableTools from "@/app/board/[id]/utils/tools/tools-controller/SwitchableTools";
import clsx from "clsx";
import tool from "@/app/board/[id]/components/tool-bar/tool/tool.module.css";
import Image from "next/image";
import shapes from "@/app/board/[id]/components/tool-bar/icons/shapes.png";
import Slider from "@/app/board/[id]/components/tool-bar/slider/Slider";
import UniboardUtil from "@/app/board/[id]/utils/UniboardUtil";
import "./figures-tool.css";

export default function FiguresTool({switchToolOn, actualToolType, setOption} : {switchToolOn: ((tool: keyof SwitchableTools) => void) | undefined, actualToolType: keyof SwitchableTools, setOption: UniboardUtil | undefined}) {
    const [width, setWidth] = useState<number>(5);
    const [color, setColor] = useState<RGBColor>({r: 88, g: 189, b: 106, a: 1});
    const [fill, setFill] = useState(true);
    const [name, setName] = useState<keyof SwitchableTools>("rectangle")
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

    const setTool = (name: keyof SwitchableTools) => {
        return () => {
            if (setOption) {
                setOption.setOption("currentWidth", width);
                setOption.setOption("currentColor", `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})`)
                setOption.setOption("fill", fill);
                setOption.switchToolOn(name);
                setName(name);
            }
        }
    }

    return (
        <div ref={toolRef} className={"tool_wrapper"}>
            <button
                className={clsx(tool.tool, {[tool.active_tool]: actualToolType == name})}
                onClick={() => {setTool(name)(); setActive(true);}}
            >
                <Image src={shapes} width={30} height={30} alt={`Выбор инструмента фигуры`}/>
            </button>
            {actualToolType == name ?
                <div className={"settings-wrapper "  + (active ? "active" : "")}>
                    <div className={"settings "}>
                        <div className={"shapes"}>
                            <button
                                className={"triangle"}
                                onClick={setTool('triangle')}
                            >
                                <svg width="40" height="40">
                                    <polygon points="20,4 4,36 36,36"
                                             style={{
                                                 stroke: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})`,
                                                 fill: fill ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})` : "transparent",
                                             }}
                                    />
                                </svg>
                            </button>
                            <button
                                className={"rectangle"}
                                onClick={setTool("rectangle")}
                            >
                                <svg width="40" height="40">
                                    <rect id="square" x="4" y="4" width="32" height="32"
                                          style={{
                                              stroke: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})`,
                                              fill: fill ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})` : "transparent",
                                          }}/>
                                </svg>
                            </button>
                            <button
                                className={"circle"}
                                onClick={setTool("circle")}
                            >
                                <svg width="40" height="40">
                                    <circle id="circle" cx="20" cy="20" r="16"
                                            style={{
                                                stroke: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})`,
                                                fill: fill ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})` : "transparent",
                                            }}
                                    />
                                </svg>
                            </button>
                            <button
                                className={"ellipse"}
                                onClick={setTool("ellipse")}
                            >
                                <svg width="40" height="40">
                                        <ellipse id="ellipse" cx="20" cy="20" rx="16" ry="12"
                                                 style={{
                                                     stroke: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})`,
                                                     fill: fill ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})` : "transparent",
                                                 }}
                                        />
                                </svg>
                            </button>
                            <button
                                className={"line"}
                                onClick={setTool("line")}
                            >
                                <svg width="40" height="40">
                                    <line id="line" x1="4" y1="36" x2="36" y2="4"
                                          style={{
                                              stroke: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})`,
                                              strokeWidth: "4px"
                                          }}/>
                                </svg>
                            </button>
                        </div>
                        {name != "line" ?
                            <div className={"fill"}>
                                <div className="flex items-center justify-start">
                                    <input checked={fill} onChange={(e) => {
                                        if (setOption) {
                                            setOption.setOption("fill", e.target.checked);
                                        }
                                        setFill(e.target.checked);
                                    }} id="checked-checkbox" type="checkbox" value=""
                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                    <label htmlFor="checked-checkbox"
                                           className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Заливка</label>
                                </div>
                            </div>
                            : null
                        }
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