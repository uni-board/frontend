import DeleteTool from "@/app/board/[id]/utils/tools/DeleteTool";
import AlwaysActiveTool from "@/app/board/[id]/utils/tools/marker-intefaces/AlwaysActiveTool";
import ScalingTool from "@/app/board/[id]/utils/tools/ScalingTool";
import DragAndDropTool from "@/app/board/[id]/utils/tools/DragAndDropTool";
import CopyAndPasteTool from "@/app/board/[id]/utils/tools/CopyAndPasteTool";

interface AlwaysActiveTools {
    delete: DeleteTool & AlwaysActiveTool,
    scaling: ScalingTool & AlwaysActiveTool,
    dragAndDrop: DragAndDropTool & AlwaysActiveTool,
    copyAndPaste: CopyAndPasteTool & AlwaysActiveTool,
}

export default AlwaysActiveTools;