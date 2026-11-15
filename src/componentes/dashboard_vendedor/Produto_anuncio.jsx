import * as Icons from "react-bootstrap-icons"

export default function Produto_anuncio()
{
    return(
        <div className="border-2 w-238.75 h-25 rounded mt-4
        grid grid-cols-[125px_436px_80px_150px_80px_80px]
        [&_span]:border [&_span]:font-bold [&_span]:text-center [&_span]:text-[24px] [&_span]:flex [&_span]:items-center">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span className="justify-center cursor-pointer"><Icons.X className="text-[70px]"/></span>
            <span className="justify-center cursor-pointer"><Icons.Pencil className="text-[37px]"/></span>
        </div>
    )
}