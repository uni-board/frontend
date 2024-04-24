'use client'

import ToolBar from "@/app/board/[id]/components/ToolBar";
import Canvas from "@/app/board/[id]/components/Canvas";
import UniboardUtil from "@/app/board/[id]/utils/UniboardUtil";
import {useEffect, useRef, useState} from "react";
import TopPanel from "@/app/board/[id]/components/top-panel/TopPanel";
import FullScreenButton from "@/app/board/[id]/components/full-screen-button/FullScreenButton";
import InfoButton from "@/app/board/[id]/components/info-button/InfoButton";

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
            <TopPanel id={id}/>
            <ToolBar switchToolOn={uniboardUtil?.switchToolOn}/>
            <Canvas id={id} canvasContainerRef={canvasContainerRef}/>
            <InfoButton
                style={{
                    position: "fixed",
                    left: "20px",
                    bottom: "20px",
                    zIndex: 10,
                }}
            />
            <FullScreenButton
                style={{
                    position: "fixed",
                    right: "20px",
                    bottom: "20px",
                    zIndex: 10,
                }}
            />
        </>
    );
}