import React, {Dispatch, SetStateAction} from "react";
import modal from "./modal.module.css";
import clsx from "clsx";

export default function Modal({active, setActive, children, bgc} : {active: boolean, setActive: Dispatch<SetStateAction<boolean>>, children: React.ReactNode, bgc?: string}) {
    return (
        <div className={clsx(modal.modal, {[modal.active]: active})} onClick={() => setActive(false)} style={{backgroundColor: bgc ? bgc : "rgba(0, 0, 0, 0.4)"}}>
            <div className={modal.content} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}