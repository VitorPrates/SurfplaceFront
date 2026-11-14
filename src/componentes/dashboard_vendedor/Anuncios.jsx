import { useState } from "react"
import Navegando_dashboard from "./Navegando_dashboard"

export default function Anuncios() {
    const [btn_anuncio, setbtn] = useState("Anuncios")

    return (
        <main className="h-[calc(100dvh-170px)] bg-azulultraleve flex" >
            <Navegando_dashboard/>
            <div className="bg-azulultraleve w-full flex items-center justify-center">
                <div className="bg-white w-250 h-187.5 rounded border-2 flex flex-col">
                    <nav className="w-full border-b-2 h-12.5">
                        <button className={`${btn_anuncio == "Anuncios" ? "bg-azulforte text-amarelodestaque" : "bg-white text-black"} font-bold text-[24px] w-50 h-full border-r-2 border-black cursor-pointer`} onClick={() => setbtn("Anuncios")}>Anuncios</button>
                        <button className={`${btn_anuncio == "Anunciar" ? "bg-azulforte text-amarelodestaque" : "bg-white text-black"} font-bold text-[24px] w-50 h-full border-r-2 border-black cursor-pointer`} onClick={() => setbtn("Anunciar")}>Anunciar</button>
                    </nav>
                    <form action="" className="[&_label]:text-[24px] [&_label]:font-bold border-1 m-auto w-237.5 h-150 rounded-2xl p-3.75">
                        <div className="flex gap-3">
                            <span className="flex flex-col">
                                <label htmlFor="NomeProduto" >Nome do Produto</label>
                                <input type="text" className="w-170 h-10 border rounded-full "/>
                            </span>
                            <span className="flex flex-col">
                                <label htmlFor="NomeProduto">Preço (R$)</label>
                                <input type="text" className="w-56.25 h-10 border rounded-full "/>
                            </span>
                        </div>
                        <div className="flex">
                            <div className="w-fit flex flex-col">
                                <label htmlFor="fotoproduto">Fotos do produto</label>
                                <input type="file" className="w-112.5 h-112.5 border rounded-2xl"/>
                            </div>
                            <div className="flex flex-col w-full b h-fit">
                                <label htmlFor="fotoproduto" className="text-left w-112.5 mr-0 ml-auto">Descrição do Produto</label>
                                <textarea name="" id="" className="w-112.5 h-82.5 border rounded-2xl mr-0 ml-auto p-2"></textarea>
                                <label htmlFor="Tags" className="text-left w-112.5 mr-0 ml-auto">Tags do produto</label>
                                <input type="text" className="w-112.5 h-11.25 rounded border ml-auto"/>
                                <div className="w-full h-full flex items-center justify-evenly p-3">
                                    <button type="reset" className="bg-azulleve text-white font-bold text-[22px] w-50 h-7.5 rounded border border-black flex justify-center items-center">Reiniciar</button>
                                    <button type="submit" className="bg-azulforte text-white font-bold text-[22px] w-50 h-7.5 rounded border border-black flex justify-center items-center">Adicionar</button>
                                </div>
                            </div>
                        </div>
                        
                    </form>
                </div>
            </div>
        </main>
    )
}