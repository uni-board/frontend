'use client'
import useBlock from "./use-block.module.css";
import {useRouter} from "next/navigation";
import Modal from "@/app/components/modal/Modal";
import {useState} from "react";

export default function UseBlock() {

    let router = useRouter();
    let [joinActive, setJoinActive] = useState(false);
    let [boardId, setBoardId] = useState("");

    const createBoard = async () => {
        let res = fetch('http://localhost:80/createboard', {
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => router.push(`/board/${data.id}`));
    }

    const join = (id: string) => {
        if (id) {
            router.push(`/board/${id}`);
        }
    }

    return (
        <div className={useBlock.use_block}>

            <div className={useBlock.content}>
                <div className={useBlock.call_to_action_block}>
                    <h2 className={useBlock.header}>Присоединись</h2>
                    <p className={useBlock.text}>Твоя команда уже ждет тебя</p>
                    <button className={useBlock.button} onClick={() => setJoinActive(true)}>Присоединиться</button>
                </div>
                <Modal active={joinActive} setActive={setJoinActive}>
                    <form className={useBlock.join_form}
                        onSubmit={(e) => {
                            e.preventDefault();
                            join(boardId);
                        }}
                    >
                        <label htmlFor="first_name"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Введите id доски:
                        </label>
                        <input
                            type="text"
                            name="boardId"
                            required
                            onChange={(e) => setBoardId(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-auto"
                        >
                            Присоединиться
                        </button>
                    </form>
                </Modal>
            </div>


            <div className={useBlock.or_block}>
                <div className={useBlock.line}></div>
                <div className={useBlock.or}>ИЛИ</div>
                <div className={useBlock.line}></div>
            </div>

            <div className={useBlock.content}>
                <div className={useBlock.call_to_action_block}>
                    <h2 className={useBlock.header}>Создай</h2>
                    <p className={useBlock.text}>Твоя команда уже ждет тебя</p>
                    <button className={useBlock.button} onClick={createBoard}>Создать</button>
                </div>
            </div>

        </div>
    )
}