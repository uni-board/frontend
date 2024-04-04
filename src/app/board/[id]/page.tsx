import Uniboard from "@/app/board/[id]/components/Uniboard";

export default function Page( { params } : { params: { id: string } } ) {
    return (
        <Uniboard id={params.id}/>
    )
}