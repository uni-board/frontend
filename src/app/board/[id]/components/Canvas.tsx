import {MutableRefObject} from "react";

export default function Canvas({ id, canvasContainerRef } : { id: string, canvasContainerRef: MutableRefObject<null>}) {
    return (
        <div ref={canvasContainerRef} className={"w-screen h-screen"}>
            <canvas id={id}/>
        </div>
    );
}