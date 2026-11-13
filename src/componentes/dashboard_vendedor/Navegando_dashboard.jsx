import { Link } from "react-router-dom"

export default function Navegando_dashboard() {
    return (
        <nav className="h-full w-58 bg-azulforte">
            <ul className=" h-full w-full pt-7.5 flex flex-col items-center gap-5.5">
                <li className="h-12.5 w-46.25 flex items-center justify-center bg-azulleve text-white font-bold text-[20px] rounded cursor-pointer hover:scale-105 transition"><Link to={"/vendedor/pedidos"}>Pedidos</Link></li>
                <li className="h-12.5 w-46.25 flex items-center justify-center bg-azulleve text-white font-bold text-[20px] rounded cursor-pointer hover:scale-105 transition"><Link to={"/vendedor/anuncios"}>Anuncios</Link></li>
                <li className="h-12.5 w-46.25 flex items-center justify-center bg-azulleve text-white font-bold text-[20px] rounded cursor-pointer hover:scale-105 transition"><Link to={"/vendedor/faturamento"}>Faturamento</Link></li>
                <li className="h-12.5 w-46.25 flex items-center justify-center bg-azulleve text-white font-bold text-[20px] rounded cursor-pointer hover:scale-105 transition"><Link to={"/vendedor/configs"}>Configurações</Link></li>
            </ul>
        </nav>
    )
}