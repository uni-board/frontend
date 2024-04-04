'use client'
import {useRouter} from "next/navigation";

export default function Home() {
  let router = useRouter();

  const createBoard = async () => {
    let res = fetch('http://localhost:80/createboard', {
      method: "POST",
    })
        .then((response) => response.json())
        .then((data) => router.push(`/board/${data.id}`));
  }
  return (
      <div className={"flex justify-center w-screen h-screen items-center flex-col"}>
        <h1>Главная страница</h1>
        <div>
          <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"}
                  onClick={createBoard}
          >
            Coздать доску
          </button>
        </div>
      </div>
  )
}
