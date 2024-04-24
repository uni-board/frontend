import slider from "./slider.module.css";
import clsx from "clsx";
import {useRef, useState} from "react";

export default function Slider({min, max, onChange, value, steps} : {min: number, max: number, onChange?: () => void, value: number, steps: number}) {
    let [sliderValue, setSliderValue] = useState(value);
    let [show, setShow] = useState(false);

    return (
        <div className={slider.range}>
            <div className={slider.slider_value}>
                <span className={clsx(slider.slider_value__span, {[slider.show] : show})} style={{
                    left: sliderValue * (100/(max-min)) + "%",
                }}>
                    {sliderValue}
                </span>
            </div>
            <div className={slider.field}>
                <div className={clsx(slider.value, slider.left)}>
                    {min}
                </div>
                <input className={slider.input} type="range" min={min} max={max}  step={steps} value={sliderValue}
                onChange={(e) => {
                    setSliderValue(Number.parseInt(e.target.value))
                    setShow(true);
                    if (onChange) {
                        onChange();
                    }
                }}
                onBlur={() => setShow(false)}/>
                <div className={clsx(slider.value, slider.right)}>
                    {max}
                </div>
            </div>
        </div>
    )
}