import ToolBar from "@/app/board/[id]/components/ToolBar";
import Canvas from "@/app/board/[id]/components/Canvas";

export default function Uniboard({id} : {id: string}) {

    return (
        <>
            <ToolBar/>
            <Canvas id={id}/>
        </>
    );
}