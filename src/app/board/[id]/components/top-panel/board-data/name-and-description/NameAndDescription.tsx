import {useState} from "react";
import Modal from "@/app/components/modal/Modal";
import nameAndDescription from "./nameAndDescription.module.css";

export default function NameAndDescription({name, description} : {name?: string, description?: string}) {
    let [fullDataActive, setFullDataActive] = useState(false);

    return (
        <div>
            <button onClick={() => setFullDataActive(!!description)}>
                {name ? name : "untitled"}
            </button>
            <Modal active={fullDataActive} setActive={setFullDataActive}>
                <div style={{
                    color: "black",
                    fontFamily: "\"Inter\", serif",
                }}>
                    <h2 className={"text-center"}>Информация о доске</h2>
                    <div>
                        <span className={nameAndDescription.name}>Имя доски: </span>
                        <span className={nameAndDescription.name_data}>{name ? name : "untitled"}</span>
                    </div>
                    {description &&
                        <div>
                            <div className={nameAndDescription.description_header}>Описание доски:</div>
                            <p className={nameAndDescription.description}>{description}</p>
                        </div>
                    }
                </div>
            </Modal>
        </div>
    )
}