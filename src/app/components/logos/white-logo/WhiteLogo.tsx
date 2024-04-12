import whiteLogo from "./white-logo.module.css";
import logo from "@/app/components/logos/white-logo/logo-green.png";
import Image from "next/image";

export default function WhiteLogo({width, height} : {width: string, height: string}) {
    return (
        <div className={whiteLogo.background} style={{width: width, height: height}}>
            <div className={whiteLogo.inner}>
                <Image src={logo} alt={"Логотип Uniboard"} fill={true} className={"aspect-square"}></Image>
            </div>
        </div>
    )
}