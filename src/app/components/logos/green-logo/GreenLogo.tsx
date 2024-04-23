import whiteLogo from "@/app/components/logos/green-logo/green-logo.module.css";
import Image from "next/image";
import logo from "@/app/components/logos/green-logo/logo-white.png";

export default function GreenLogo({width, height} : {width: string, height: string}) {
    return (
        <div className={whiteLogo.background} style={{width: width, height: height}}>
            <div className={whiteLogo.inner}>
                <Image src={logo} alt={"Логотип Uniboard"} fill={true} className={"aspect-square"}></Image>
            </div>
        </div>
    )
}