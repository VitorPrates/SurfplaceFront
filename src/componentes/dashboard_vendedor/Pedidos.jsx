import Navegando_dashboard from "./Navegando_dashboard"
export default function Pedidos() {
    return (
        <main className="h-[calc(100dvh-170px)] bg-azulultraleve flex" >
            <Navegando_dashboard/>
            <div className="bg-red-300 w-full">
                <h1>Pedidos</h1>
            </div>
        </main>
    )
}