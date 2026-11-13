import Navegando_dashboard from "./Navegando_dashboard"
export default function Faturamento() {
    return (
        <main className="h-[calc(100dvh-170px)] bg-azulultraleve flex" >
            <Navegando_dashboard/>
            <div className="bg-red-300 w-full">
                <h1>Faturamento</h1>
            </div>
        </main>
    )
}