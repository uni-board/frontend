import RectangleTool from "@/app/board/[id]/utils/tools/figure-tools/RectangleTool";
import SwitchableTool from "@/app/board/[id]/utils/tools/marker-intefaces/SwitchableTool";
import TriangleTool from "@/app/board/[id]/utils/tools/figure-tools/TriangleTool";
import LineTool from "@/app/board/[id]/utils/tools/figure-tools/LineTool";
import EllipseTool from "@/app/board/[id]/utils/tools/figure-tools/EllipseTool";
import CircleTool from "@/app/board/[id]/utils/tools/figure-tools/CircleTool";

interface SwitchableTools {
    rectangle: RectangleTool & SwitchableTool,
    triangle: TriangleTool & SwitchableTool,
    line: LineTool & SwitchableTool,
    ellipse: EllipseTool & SwitchableTool,
    circle: CircleTool & SwitchableTool,
}

export default SwitchableTools;