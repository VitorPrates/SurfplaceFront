import * as Icons from "react-bootstrap-icons"
import { Link } from "react-router-dom"

export default function Bemvindo()
{
    return(<>
        <div className=" bemvindo absolute z-9999 w-full h-[calc(100dvh-170px)] bg-azulultraleve overflow-hidden grid items-center grid-cols-2">
            <article className="ml-auto mr-50 w-117.5 h-175 bg-white rounded-2xl border-2 pt-5 pointer-events-auto flex flex-col">
                <h3 className="font-bold text-[24px] text-center">Bem vindo ao projeto surplace!</h3>
                <p className="text-[24px] pl-5 pr-5 pt-3 ">Este projeto tem como objetivo fomentar o comércio e visitações de lojas de surf. Seja em suas viagens ou descobrindo lojas da sua região, encontre lojas e os melhores produtos perto de você!</p>
                <span className=" bg-azulforte w-full h-12.5 flex items-center justify-center mt-5 text-amarelodestaque font-bold text-[24px] text-center relative overflow-hidden">
                    Como funciona
                    <span className="w-45 h-2.5 bg-azulleve rotate-45 absolute -left-14.5"></span>
                    <span className="w-45 h-2.5 bg-azulleve rotate-45 absolute -left-20"></span>
                    <span className="w-45 h-2.5 bg-azulleve rotate-45 absolute -right-17.5"></span>
                    <span className="w-45 h-2.5 bg-azulleve rotate-45 absolute -right-23"></span>               
                </span>
                <p className="text-[24px] pl-4.5 pr-4.5 pt-3 ">
                    O mapa tem como função demonstar as lojas de acordo com as <span className="font-bold">localizações que você pesquisar.</span> Caso existam lojas próximas da localização pesquisada, elas aparecerão no mapa, clicáveis para você dar uma olhada!
                </p>
                
                <Link to={"/home"} className="m-auto"><button className="flex items-center gap-1 bg-azulforte text-white font-bold text-[27px] rounded-3xl justify-center w-100 h-12.5  cursor-pointer">Ver mapa<Icons.ArrowRight/></button></Link>
            </article>
        </div>
    </>)
}