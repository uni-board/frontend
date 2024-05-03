import {useEffect, useRef, useState} from "react";
import SwitchableTools from "@/app/board/[id]/utils/tools/tools-controller/SwitchableTools";
import clsx from "clsx";
import tool from "@/app/board/[id]/components/tool-bar/tool/tool.module.css";
import Image from "next/image";
import sticker from "@/app/board/[id]/components/tool-bar/icons/sticky-note.png";
import UniboardUtil from "@/app/board/[id]/utils/UniboardUtil";
import ToolsOptions from "@/app/board/[id]/utils/options/ToolsOptions";
import black from "./icons/black.png";
import blue from "./icons/blue.png";
import green from "./icons/green.png";
import red from "./icons/red.png";
import yellow from "./icons/yellow.png";
import "./sticky-note.css";

export default function StickyNoteTool({switchToolOn, actualToolType, setOption} : {switchToolOn: ((tool: keyof SwitchableTools) => void) | undefined, actualToolType: keyof SwitchableTools, setOption: UniboardUtil | undefined}) {
    const [stickerColor, setStickerColor] = useState<ToolsOptions["stickerColor"]>("yellow");
    const [active, setActive] = useState(false);
    const toolRef = useRef<HTMLDivElement>(null);
    const name: keyof SwitchableTools = "stickyNote";
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

    const setSticker = (color: ToolsOptions["stickerColor"]) => {
        return () => {
            if (setOption) {
                setOption.setOption("stickerColor", color);
                setOption.switchToolOn("stickyNote");
                setStickerColor(color);
            }
        }
    }

    return (
        <div ref={toolRef} className={"tool_wrapper"}>
            <button
                className={clsx(tool.tool, {[tool.active_tool]: actualToolType == name})}
                onClick={() => {setSticker(stickerColor)(); setActive(true);}}
            >
                <Image src={sticker} width={30} height={30} alt={`Выбор инструмента фигуры`}/>
            </button>
            {actualToolType == name ?
                <div className={"settings-wrapper "  + (active ? "active" : "")}>
                    <div className={"settings"}>
                        <div className={"flex stickers"}>
                            <button className={"sticker"}
                                onClick={setSticker("black")}
                            >
                                <Image src={black} alt={"Черный стикер"}/>
                            </button>
                            <button className={"sticker"}
                                onClick={setSticker("red")}
                            >
                                <Image src={red} alt={"Красный стикер"}/>
                            </button>
                            <button className={"sticker"}
                                onClick={setSticker("yellow")}
                            >
                                <Image src={yellow} alt={"Желтый стикер"}/>
                            </button>
                            <button className={"sticker"}
                                onClick={setSticker("green")}
                            >
                                <Image src={green} alt={"Зеленый стикер"}/>
                            </button>
                            <button className={"sticker"}
                                onClick={setSticker("blue")}
                            >
                                <Image src={blue} alt={"Синий стикер"}/>
                            </button>
                        </div>
                    </div>
                </div> : null
            }
        </div>
    )
}