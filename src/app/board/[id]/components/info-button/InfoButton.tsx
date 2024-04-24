import React, {useState} from "react";
import infoButton from "./infoButton.module.css";
import Image from "next/image";
import question from "./question-sign.png"
import Modal from "@/app/components/modal/Modal";
import GreenLogo from "@/app/components/logos/green-logo/GreenLogo";
import clsx from "clsx";
import KeysController from "@/app/board/[id]/utils/helpers/KeysController";


export default function InfoButton({style} : {style?: React.CSSProperties}) {
    let [infoMenuActive, setInfoMenuActive] = useState(false);
    let keyController = new KeysController();

    return (
        <>
            <button className={infoButton.button} style={style} onClick={() => setInfoMenuActive(true)}>
                <Image
                    src={question}
                    alt={"Изображение для открытия справки на доске"}
                    width={32}
                    height={32}
                />
            </button>
            <Modal active={infoMenuActive} setActive={setInfoMenuActive}>
                <div className={infoButton.info_modal}>
                    <div className={"flex flex-col items-center justify-center"}>
                        <GreenLogo width={"200px"} height={"200px"}/>
                        <h2 className={clsx("text-center", infoButton.logo_title)}>Uniboard</h2>
                    </div>
                    <hr/>
                    <div className={infoButton.project_about}>
                        <h3 className={infoButton.project_about__title}>О чем проект?</h3>
                        <p>
                            Uniboard - это онлайн-платформа для совместной работы, позволяющая проводить мозговые штурмы
                            и создавать потрясающие идеи.
                            Она обладает множеством функций, гармонично сочетающихся с минималистичным дизайном.
                        </p>
                    </div>
                    <hr/>
                    <div className={infoButton.shortcuts}>
                        <h3 className={infoButton.shortcuts__title}>Доступные комбинации клавиш</h3>
                        <ul>
                            <li className={"flex items-center pt-2 pb-2"}>
                                <div className={"w-1/3 text-center"}>
                                    <Key
                                        name={keyController.getPasteCombination().special == "Meta" ? "CMD" : keyController.getPasteCombination().special}/> + <Key
                                    name={keyController.getCopyCombination().main.toUpperCase()}/>
                                </div>
                                <div className={"w-2/3"}>
                                    Скопировать выделенные объекты
                                </div>
                            </li>
                            <li className={"flex items-center pt-2 pb-2"}>
                                <div className={"w-1/3 text-center"}>
                                    <Key
                                        name={keyController.getPasteCombination().special == "Meta" ? "CMD" : keyController.getPasteCombination().special}/> + <Key
                                    name={keyController.getPasteCombination().main.toUpperCase()}/>
                                </div>
                                <div className={"w-2/3"}>
                                    Вставить скопированные объекты
                                </div>
                            </li>
                            <li className={"flex items-center pt-2 pb-2"}>
                                <div className={"w-1/3 text-center"}>
                                    <Key name={keyController.getDeleteKey()}/>
                                </div>
                                <div className={"w-2/3"}>
                                    Удалить выделенные объекты
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </Modal>
        </>

    )
}

function Key({name}: { name: string }) {
    return (
        <span className={infoButton.key}>{name}</span>
    )
}
