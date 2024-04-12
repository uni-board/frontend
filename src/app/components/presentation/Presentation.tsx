import presentation from "./presentation.module.css"
import Image from "next/image";
import image from "./presentation.png"

export default function Presentation() {
    return (
      <div className={presentation.presentation}>
          <div className={presentation.content}>
              <div className={presentation.video}>
                  <Image src={image} fill={true} alt={"Видео-презентация онлайн-доски"}></Image>
              </div>
          </div>
      </div>
    );
}