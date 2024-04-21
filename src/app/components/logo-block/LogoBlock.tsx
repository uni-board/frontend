import logoBlock from "./logo-block.module.css";
import WhiteLogo from "@/app/components/logos/white-logo/WhiteLogo";
import {Caudex} from "next/font/google";

const caudex = Caudex({
    weight: "700",
    subsets: ["latin"]
});

export default function LogoBlock() {
    return (
        <div className={logoBlock.wrapper}>
            <WhiteLogo width={"193px"} height={"193px"}/>
            <div className={caudex.className} style={{fontSize: "72px", color: "white"}}>Uniboard</div>
        </div>
    )
}