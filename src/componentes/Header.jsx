import logo from "../assets/logo-sem-fundo.png"
import * as Icons from "react-bootstrap-icons"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './VerificadorLogin.jsx';

export default function Header()
{
    const { user, loading, logout } = useAuth();

    if (loading) return <p>Carregando...</p>;
    const navigate = useNavigate();

    async function sair() {
    try {
        await logout();
        navigate("/login", { replace: true });
    } catch (erro) {
        console.error("Erro ao encerrar sessão:", erro);
    }
    }

    return(<>
    <header className="bg-azulforte h-25 flex items-center relative overflow-hidden">
       <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute -left-12.5"></span>
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute -left-25"></span>
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute -right-12.5"></span>
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute -right-25"></span>
        
        
        <div className="flex items-center w-fit m-auto gap-14.5">
            <div className="h-full w-fit">
                <Link to={"/home"}><div className="logo w-20"><img src={logo} alt="logo surflace" className=""/></div></Link>
                
            </div>
            <form action="" className="flex gap-5 items-center">
                <Icons.Search className="text-white rotate-y-180" size={40}/>
                <input type="text" className="bg-white rounded-2xl w-132.5 h-7.5 pl-3 pr-3"/>
            </form>
           
            <nav className="flex items-center gap-4">
            {user ? (
                <>
                <Link
                    to="/minha-conta"
                    className="font-bold text-amarelodestaque
                        text-[24px] hover:underline"
                    >
                    Olá, {user.nome}!
                </Link>

                <Link to="/minhas-compras" className="font-bold text-amarelodestaque
                        text-[24px] hover:underline">
                    Minhas compras
                </Link>
                <button
                    type="button"
                    onClick={sair}
                    className="text-white font-bold cursor-pointer hover:underline"
                >
                    Sair
                </button>
                
                </>
            ) : (
                <Link
                to="/login"
                className="font-bold text-amarelodestaque text-[30px]"
                >
                Login
                </Link>
            )}
            </nav>
        </div>'
        {/* <a href="" className="text-amarelodestaque font-bold text-[30px]">Login</a> */}

        
    </header>
    </>)
}