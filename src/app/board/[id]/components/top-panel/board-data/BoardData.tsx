import boardData from "./board-data.module.css";
import {Caudex} from "next/font/google";
import React, {useState} from "react";
import ExportButton from "@/app/board/[id]/components/top-panel/board-data/export-button/ExportButton";
import NameAndDescription
    from "@/app/board/[id]/components/top-panel/board-data/name-and-description/NameAndDescription";

const caudex = Caudex({
    weight: "700",
    subsets: ["latin"]
});

export default function BoardData({style, id, exportAsImage} : {style?: React.CSSProperties, id:string, exportAsImage: () => void} ) {

    let [name, setName] = useState("");
    let [description, setDescription] = useState("");
    fetch(`${process.env["NEXT_PUBLIC_API_URL"]}/board/${id}/settings`, {
        method: "GET",
    })
        .then((response) => {
            return  response.json();
        })
        .then(value => {
            setName(value.name ? value.name : "");
            setDescription(value.description ? value.description : "");
        }, reason => {
            setName("");
            setDescription("");
        });

    return (
        <div className={boardData.board_data} style={style}>
            <div>Uniboard</div>
            <VerticalLine/>
            <NameAndDescription
                name={name}
                description={description}
            />
            <VerticalLine/>
            <ExportButton onclick={exportAsImage}/>
        </div>
    )

}

function VerticalLine() {
    return (
        <div className={boardData.vertical_line}></div>
    )
}