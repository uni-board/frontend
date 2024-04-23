'use client'
import useBlock from "./use-block.module.css";
import {useRouter} from "next/navigation";
import Modal from "@/app/components/modal/Modal";
import {useState} from "react";

export default function UseBlock() {

    let router = useRouter();
    let [joinActive, setJoinActive] = useState(false);
    let [createActive, setCreateActive] = useState(false)
    let [boardId, setBoardId] = useState("");
    let [boardName, setBoardName] = useState("");
    let [boardDescription, setBoardDescription] = useState("");

    const createBoard = async () => {
        let res = fetch(`http://${process.env["NEXT_PUBLIC_API_HOST"]}:${process.env["NEXT_PUBLIC_API_PORT"]}/createboard`, {
            method: "POST",
        })
            .then((response) => response.json())
            .then( async (data) => {
                await fetch(`http://${process.env["NEXT_PUBLIC_API_HOST"]}:${process.env["NEXT_PUBLIC_API_PORT"]}/board/${data.id}/settings/edit`, {
                    method: "PUT",
                    body: "",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    mode: 'no-cors',
                }).catch((reason) => console.error(reason));
                router.push(`/board/${data.id}`)
            });
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
                        <label htmlFor="boardId"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Введите id доски:
                        </label>
                        <input
                            type="text"
                            name="boardId"
                            id="boardId"
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
                    <button className={useBlock.button} onClick={() => setCreateActive(true)}>Создать</button>
                </div>
                <Modal active={createActive} setActive={setCreateActive}>
                    <form className={useBlock.create_form}
                          onSubmit={(e) => {
                              e.preventDefault();
                              createBoard();
                              setCreateActive(false);
                          }}
                    >
                        <label htmlFor="boardName"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Введите название доски:
                        </label>
                        <input
                            type="text"
                            name="boardName"
                            id="boardName"
                            required
                            onChange={(e) => setBoardName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3"
                        />
                        <label htmlFor="message"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Введите описание доски:
                        </label>
                        <textarea id="message" rows={4} cols={50}
                                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Введите описание доски здесь..."
                                  onChange={(e) => setBoardDescription(e.target.value)}
                        >
                        </textarea>

                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
                        >
                            Создать
                        </button>
                    </form>
                </Modal>
            </div>

        </div>
    )
}