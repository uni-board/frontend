'use client'

import ToolBar from "@/app/board/[id]/components/ToolBar";
import Canvas from "@/app/board/[id]/components/Canvas";
import UniboardUtil from "@/app/board/[id]/utils/UniboardUtil";
import {useEffect, useRef, useState} from "react";

export default function Uniboard({id} : {id: string}) {

    const [uniboardUtil, setUniboardUtil] = useState<UniboardUtil>();
    const canvasContainerRef = useRef(null);

    useEffect( () => {
        let uniboardUtil = new UniboardUtil(id);
        setUniboardUtil(uniboardUtil);

        if (canvasContainerRef.current) {
            uniboardUtil.updateCanvasSize(
                canvasContainerRef.current['clientWidth'],
                canvasContainerRef.current['clientHeight'],
            )
        }

        let disableResizingHandler = handleResizing(uniboardUtil);


        return ()=> {
            uniboardUtil.stop();
            disableResizingHandler();
        }
    }, [id] )

    function handleResizing(uniboardUtil : UniboardUtil) {
        let resizingHandler = () => {
            if (canvasContainerRef.current) {
                uniboardUtil.updateCanvasSize(
                    canvasContainerRef.current['clientWidth'],
                    canvasContainerRef.current['clientHeight'],
                )
            }
        }

        window.addEventListener('resize', resizingHandler);

        return () => window.removeEventListener('resize', resizingHandler);
    }

    return (
        <>
            <ToolBar switchToolOn={uniboardUtil?.switchToolOn}/>
            <Canvas id={id} canvasContainerRef={canvasContainerRef}/>
        </>
    );
}