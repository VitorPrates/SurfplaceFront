export default function Cadastro_user()
{
    return(<div className="h-[calc(100dvh-170px)] w-full bg-azulultraleve flex items-center justify-center p-4 font-sans">
        <div className="w-125 h-[98%] bg-white rounded px-5 pt-5 pb-5 border-2">
            <h3 className="font-bold text-[40px] text-center">Faça seu cadastro</h3>
            <form action="" className="flex flex-col">
                <label htmlFor="Nome" className="text-[30px] font-light">Nome</label>
                <input type="text" required className="w-full border rounded-3xl h-10"/>
                <label htmlFor="email" className="text-[30px] font-light">E-mail</label>
                <input type="text" required className="w-full border rounded-3xl h-10"/>
                <label htmlFor="Telefone" required className="text-[30px] font-light">Telefone <span className="text-[16px]">(DDD+ Número)</span> </label>
                <input type="text" className="w-full border rounded-3xl h-10"/>
                <label htmlFor="Senha" className="text-[30px] font-light">Senha <span className="text-[16px]">(Min 8 caracteres)</span></label>
                <input type="text" className="w-full border rounded-3xl h-10"/>
                <label htmlFor="ConfirmarSenha" className="text-[30px] font-light">Confirmar Senha</label>
                <input type="text" className="w-full border rounded-3xl h-10"/>

                <button type="submit" className="bg-azulleve text-white font-bold w-full rounded text-[32px] mt-25">Continuar</button>
                <button type="reset" className="bg-azulforte text-white font-bold w-90 rounded text-[32px] mt-2 m-auto">Voltar</button>
            </form>
        </div>
    </div>)
}