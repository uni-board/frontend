import footer from "./footer.module.css";
import WhiteLogo from "@/app/components/logos/white-logo/WhiteLogo";

import {Caudex} from "next/font/google";

const caudex = Caudex({
    weight: "700",
    subsets: ["latin"]
});

export default function Footer() {
    return (
        <div className={footer.footer}>
            <WhiteLogo width={"74px"} height={"74px"}/>
            <div className={footer.uniboard}>Uniboard</div>
        </div>
    );
}