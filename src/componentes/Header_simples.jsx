import logo from "../assets/logo-sem-fundo.png"
import * as Icons from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import { useAuth } from './VerificadorLogin.jsx';

export default function Header_simples()
{
    const { user, loading } = useAuth();

    if (loading) return <p>Carregando...</p>;

    return(<>
    <header className="bg-azulforte h-25 flex items-center relative overflow-hidden">
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute -left-12.5"></span>
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute -left-25"></span>
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute -right-12.5"></span>
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute -right-25"></span>
        
        
        <div className="flex items-center w-fit m-auto gap-14.5">
            <div className="h-full w-fit">
                <Link to={"/"}><div className="logo w-20"><img src={logo} alt="logo surflace" className=""/></div></Link>
            </div>
        </div>'
        {/* <a href="" className="text-amarelodestaque font-bold text-[30px]">Login</a> */}

        
    </header>
    </>)
}