import logo from "../assets/logo-sem-fundo.png"
import * as Icons from "react-bootstrap-icons"


export default function Header()
{
    return(<>
    <header className="bg-azulforte h-20 flex items-center relative overflow-hidden">
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute left-[-50px]"></span>
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute left-[-100px]"></span>
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute right-[-50px]"></span>
        <span className="w-45 h-6.25 bg-azulleve -rotate-45 absolute right-[-100px]"></span>
        
        
        <div className="flex items-center w-fit m-auto">
            <div className="h-full w-fit">
                <div className="logo w-[85px]"><img src={logo} alt="logo surflace" className=""/></div>
            </div>
            <Icons.Search className="text-white rotate-y-180" size={40}/>
        </div>'
        {/* <a href="" className="text-amarelodestaque font-bold text-[30px]">Login</a> */}

        
    </header>
    </>)
}