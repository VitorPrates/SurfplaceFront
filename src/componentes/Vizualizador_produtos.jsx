export default function Vizualizador_produtos({vendo})
{
    return(<>
        <div className={`absolute z-9999 w-87.5 right-0 h-[calc(100dvh-170px)]  pointer-events-none overflow-hidden`}>
            <div className={`w-full h-full bg-azulforte absolute left-[${vendo? "0":"97%"}] transition-all hover:left-0 pointer-events-auto`}></div>
        </div>
    </>)
}