import Card_produto_navegando from "./Card_produto_navegando"
import { useState, useEffect } from "react"


export default function Vizualizador_produtos({vendo})
{
    // const [abrir, setAbrir] = useState(false)

    // useEffect(() => {
    // async function carregarDados() {
    //     // const resposta = await api.buscar();
    //     setAbrir(vendo); // Isso é assíncrono, não gera o erro
    // }
    // carregarDados();
    // }, [vendo]);

    return(<>
        <div className={`absolute z-9999 w-87.5 right-0 h-[calc(100dvh-170px)]  pointer-events-none overflow-hidden`}>
            <div className={`w-full h-full bg-azulforte absolute flex justify-center transition-all hover:left-0 pointer-events-auto`}>
                <Card_produto_navegando/>
            </div>
        </div>
    </>)
}
// left-[${vendo ? "0%":"97%"}]
// ${vendo ? "left-0" : "left-[98%] hover:left-0"}