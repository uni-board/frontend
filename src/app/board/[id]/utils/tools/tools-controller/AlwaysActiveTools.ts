import DeleteTool from "@/app/board/[id]/utils/tools/DeleteTool";
import AlwaysActiveTool from "@/app/board/[id]/utils/tools/marker-intefaces/AlwaysActiveTool";

interface AlwaysActiveTools {
    delete: DeleteTool & AlwaysActiveTool
}