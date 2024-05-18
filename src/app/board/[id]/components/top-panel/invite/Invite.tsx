import Image from "next/image";
import InviteImage from "./invite.png";
import Modal from "@/app/components/modal/Modal";
import {useState} from "react";
import invite from "./invite.module.css"
import clsx from "clsx";


export default function Invite({id} : {id: string}) {

    let [inviteMenuActive, setInviteMenuActive] = useState(false);
    let [copied, setCopied] = useState(false);
    let link : string = `${process.env["NEXT_PUBLIC_CLIENT_URL"]}/board/${id}`;

    return (
        <>
            <button
                className={"inline-flex items-center"}
                style={{
                    backgroundColor: "#EC6B31",
                    padding: "9px 15px",
                    borderRadius: "20px",
                    height: "50px",
                    marginLeft: "20px",
                }}
                onClick={() => setInviteMenuActive(true)}
            >

                <div>
                    <Image src={InviteImage} alt={"Иконка прилашения на доску"} width={32} height={32}/>
                </div>
                <div style={{
                    marginLeft: "15px",
                    color: "white",
                    fontFamily: "\"Caudex\", serif",
                    fontSize: "32px"
                }}>
                    invite
                </div>
            </button>
            <Modal active={inviteMenuActive} setActive={setInviteMenuActive}>
                <div>
                    <h2 className={"mb-3 font-bold"}>Поделись этой доской</h2>
                    <div className={invite.share_group}>
                        <div className={invite.share_by}>Поделись по id: </div>
                        <div className={invite.share_data}>{id}</div>
                    </div>
                    <div className={invite.share_group}>
                        <div className={invite.share_by}>Поделись по ссылке: </div>
                        <div className={invite.share_data}>{link}</div>
                    </div>
                    <button
                        className={clsx(invite.copy_button, {[invite.copy_button__copied] : copied})}
                        onClick={() => {
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(link).then(() => setCopied(true))
                            }
                        }}
                    >
                        Скопировать ссылку
                    </button>
                </div>
            </Modal>
        </>
    )
}