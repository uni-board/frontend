
export default function Canvas({ id } : { id: string}) {
    return (
        <div className={"w-screen h-screen"}>
            <canvas id={id}/>
        </div>
    );
}