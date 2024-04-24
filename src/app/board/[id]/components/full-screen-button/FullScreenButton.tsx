import React, {useState} from "react";
import fullscreen from "./fullscreen.png";
import minimize from "./minimize.png";
import Image from "next/image";
import fullScreenButton from "./fullScreenButton.module.css";

export default function FullScreenButton({style} : {style?: React.CSSProperties}) {
    let [isFullScreen, setIsFullScreen] = useState(false);

    const changeScreen = () => {
        if (isFullScreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsFullScreen(false)
        } else {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            }
            setIsFullScreen(true);
        }
    }

    return (
        <button className={fullScreenButton.button} style={style} onClick={changeScreen}>
            <Image
                src={isFullScreen ? minimize : fullscreen}
                alt={"Изображение для перехода в полноэкранный режим или для выхода их него"}
                width={32}
                height={32}
            />
        </button>
    )
}