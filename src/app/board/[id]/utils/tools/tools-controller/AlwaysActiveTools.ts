import DeleteTool from "@/app/board/[id]/utils/tools/DeleteTool";
import AlwaysActiveTool from "@/app/board/[id]/utils/tools/marker-intefaces/AlwaysActiveTool";
import ScalingTool from "@/app/board/[id]/utils/tools/ScalingTool";

interface AlwaysActiveTools {
    delete: DeleteTool & AlwaysActiveTool,
    scaling: ScalingTool & AlwaysActiveTool,
}

export default AlwaysActiveTools;