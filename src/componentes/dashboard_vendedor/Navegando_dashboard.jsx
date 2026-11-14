import { Link } from "react-router-dom"

export default function Navegando_dashboard() {
    return (
        <nav className="h-full w-58 bg-azulforte">
            <ul className=" h-full w-full pt-7.5 flex flex-col items-center gap-5.5">
                <Link to={"/vendedor/pedidos"}><li className="h-12.5 w-46.25 flex items-center justify-center bg-azulleve text-white font-bold text-[20px] rounded cursor-pointer hover:scale-105 transition">Pedidos</li></Link>
                <Link to={"/vendedor/anuncios"}><li className="h-12.5 w-46.25 flex items-center justify-center bg-azulleve text-white font-bold text-[20px] rounded cursor-pointer hover:scale-105 transition">Anuncios</li></Link>
                <Link to={"/vendedor/faturamento"}><li className="h-12.5 w-46.25 flex items-center justify-center bg-azulleve text-white font-bold text-[20px] rounded cursor-pointer hover:scale-105 transition">Faturamento</li></Link>
                <Link to={"/vendedor/configs"}><li className="h-12.5 w-46.25 flex items-center justify-center bg-azulleve text-white font-bold text-[20px] rounded cursor-pointer hover:scale-105 transition">Configurações</li></Link>
            </ul>
        </nav>
    )
}