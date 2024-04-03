import SwitchableTools from "@/app/board/[id]/utils/tools/tools-controller/SwitchableTools";

export default function ToolBar({switchToolOn} : {switchToolOn: ((tool: keyof SwitchableTools) => void) | undefined}) {
    return (
        <div className={"toolBar fixed top-0 left-0 z-20"}>
            <button
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"}
                onClick={() => switchToolOn ? switchToolOn('rectangle') : null}
            >
                Rectangle
            </button>

            <button
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"}
            >
                SelectMode
            </button>

            <button
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"}
            >
                Drawing
            </button>

            <button
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"}
                onClick={() => switchToolOn ? switchToolOn('triangle') : null}
            >
                Triangle
            </button>

            <button
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"}
                onClick={() => switchToolOn ? switchToolOn('ellipse') : null}
            >
                Ellipse
            </button>

            <button
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"}
                onClick={() => switchToolOn ? switchToolOn('circle') : null}
            >
                Circle
            </button>

            <button
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"}
                onClick={() => switchToolOn ? switchToolOn('line') : null}
            >
                Line
            </button>

            <button
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"}
            >
                Text
            </button>
            <button
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"}
            >
                Sticker
            </button>
        </div>
    );
};