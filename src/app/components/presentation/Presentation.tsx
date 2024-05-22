import presentation from "./presentation.module.css"

export default function Presentation() {
    return (
      <div className={presentation.presentation}>
          <div className={presentation.content}>
              <div className={presentation.video}>
                  <video width={759} height={491} autoPlay loop muted playsInline src={"/presentation.mp4"}>
                      Your browser does not support the video tag.
                  </video>
              </div>
          </div>
      </div>
    );
}