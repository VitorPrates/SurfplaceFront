import logo from "../assets/logo-sem-fundo.png"
import * as Icons from "react-bootstrap-icons"
import { Link } from "react-router-dom"

export default function Header()
{
    return(<>
    <header className="bg-azulforte h-25 flex items-center relative overflow-hidden">
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute left-[-50px]"></span>
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute left-[-100px]"></span>
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute right-[-50px]"></span>
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute right-[-100px]"></span>
        
        
        <div className="flex items-center w-fit m-auto gap-[58px]">
            <div className="h-full w-fit">
                <Link to={"/"}><div className="logo w-20"><img src={logo} alt="logo surflace" className=""/></div></Link>
                
            </div>
            <form action="" className="flex gap-5 items-center">
                <Icons.Search className="text-white rotate-y-180" size={40}/>
                <input type="text" className="bg-white rounded-2xl w-132.5 h-7.5 pl-3 pr-3"/>
            </form>
            <nav>
                {/* <a href="" className="font-bold text-amarelodestaque text-[30px]">Login</a> */}
                <Link to={"/Login"} className="font-bold text-amarelodestaque text-[30px]">Login</Link>
            </nav>
        </div>'
        {/* <a href="" className="text-amarelodestaque font-bold text-[30px]">Login</a> */}

        
    </header>
    </>)
}