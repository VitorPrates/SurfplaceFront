import { useState } from 'react';
import { Link } from "react-router-dom"

export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailOrPhone && password) {
      setSubmitted(true);
    }
  };

  return (
    <div className="h-[calc(100dvh-170px)] w-full bg-azulultraleve flex items-center justify-center p-4 font-sans">
      <div className=" bg-white rounded border-2 w-125 h-117.5 pl-5 pr-5 pt-6.25">
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-sky-100 text-[#00aeeef] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-xl font-medium text-slate-800">Login realizado!</h2>
            <p className="text-sm text-slate-600">
              Bem-vindo(a) de volta, <span className="font-semibold">{emailOrPhone}</span>.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setEmailOrPhone('');
                setPassword('');
              }}
              className="mt-4 text-xs text-azulleve underline transition-colors"
            >
              Voltar ao formulário
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col ">
            {/* Campo E-mail ou Telefone */}
            <div className="flex flex-col">
              <label 
                htmlFor="emailOrPhone" 
                className="text-[32px] tracking-wide m-0  font-light"
              >
                E-mail ou telefone
              </label>
              <input
                id="emailOrPhone"
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                className="w-full h-10 px-4 rounded-full border outline-none"
              />
            </div>

            {/* Campo Senha */}
            <div className="flex flex-col ">
              <label 
                htmlFor="password" 
                className="text-[32px] pl-1 font-light mt-2"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-10 px-4 rounded-full border border-slate-600 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-slate-800 text-sm"
              />
              {/* Link Esqueceu sua senha */}
              <div className="pt-0.5 pl-1">
                <a
                  href="#forgot-password"
                  onClick={(e) => e.preventDefault()}
                  className="text-[16px] text-azulleve hover:underline"
                >
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            {/* Link Não possui cadastro */}
            <div className="mt-20 mb-3 text-center">
              <a
                href="#register"
                onClick={(e) => e.preventDefault()}
                className="text-[32px]  font-normal text-azulleve hover:underline"
              >
                <Link to={"/Cadastro_user"}>Não possui cadastro?</Link>
              </a>
            </div>

            {/* Botão Continuar */}
            <button
              type="submit"
              className="w-full mb-0 bg-azulleve text-white text-[32px] font-medium rounded-lg shadow-sm active:scale-[0.99] transition-transform"
            >
              Continuar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}