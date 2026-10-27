import { useState } from 'react';

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
    <div className="min-h-screen w-full bg-[#dbe7fd] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-700 p-8 shadow-sm">
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
              className="mt-4 text-xs text-[#29b6f6] underline hover:text-[#0288d1] transition-colors"
            >
              Voltar ao formulário
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            {/* Campo E-mail ou Telefone */}
            <div className="flex flex-col space-y-1.5">
              <label 
                htmlFor="emailOrPhone" 
                className="text-lg text-slate-800 font-normal tracking-wide pl-1"
              >
                E-mail ou telefone
              </label>
              <input
                id="emailOrPhone"
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                className="w-full h-10 px-4 rounded-full border border-slate-600 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-slate-800 text-sm"
              />
            </div>

            {/* Campo Senha */}
            <div className="flex flex-col space-y-1.5">
              <label 
                htmlFor="password" 
                className="text-lg text-slate-800 font-normal tracking-wide pl-1"
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
                  className="text-[11px] text-[#29b6f6] hover:underline"
                >
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            {/* Link Não possui cadastro */}
            <div className="pt-3 text-center">
              <a
                href="#register"
                onClick={(e) => e.preventDefault()}
                className="text-lg font-normal text-[#29b6f6] hover:underline"
              >
                Não possui cadastro?
              </a>
            </div>

            {/* Botão Continuar */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#14b8a6] hover:bg-[#0d9488] text-white text-lg font-medium rounded-lg transition-colors shadow-sm active:scale-[0.99] transition-transform"
              style={{ backgroundColor: '#18b8eb' }}
            >
              Continuar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}