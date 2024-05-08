import GreenLogo from "@/app/components/logos/green-logo/GreenLogo";
import clsx from "clsx";
import topPanel from "./top-panel.module.css"
import Link from "next/link";
import BoardData from "@/app/board/[id]/components/top-panel/board-data/BoardData";
import Invite from "@/app/board/[id]/components/top-panel/invite/Invite";

export default function TopPanel({id, exportAsImage} : {id: string, exportAsImage: () => void}) {


    return (
        <div className={clsx("fixed top-0 left-0 w-max flex items-center", topPanel.top_panel)}>
            <Link href="/">
                <GreenLogo width={"60px"} height={"60px"}/>
            </Link>
            <BoardData style={{marginLeft: "20px"}} id={id} exportAsImage={exportAsImage}/>
            <Invite id={id}/>
        </div>
    );
}