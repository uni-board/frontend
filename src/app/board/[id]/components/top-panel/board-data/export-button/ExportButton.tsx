import Image from "next/image";
import exportImage from "./arrow.png";
import {MouseEventHandler} from "react";

export default function ExportButton({onclick} : {onclick? : MouseEventHandler<HTMLButtonElement>}) {
    return (
        <button className={"items-center inline-flex"} onClick={onclick}>
            <div>
                <Image src={exportImage} alt={"Иконка клика"} width={32} height={32}/>
            </div>
            <div>
                export board
            </div>
        </button>
    )
}