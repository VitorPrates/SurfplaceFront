
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./VerificadorLogin";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (carregando) return;

    try {
      setCarregando(true);
      setErro("");

      await login(email, senha);

      navigate("/home", { replace: true });

    } catch (error) {
      setErro(error.message);

    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="h-[calc(100dvh-170px)] w-full bg-azulultraleve flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded border-2 w-125 min-h-117.5 px-5 pt-6.25 pb-5">

        <form
          onSubmit={handleSubmit}
          className="flex flex-col"
        >
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-[32px] tracking-wide font-light"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 px-4 rounded-full border outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="senha"
              className="text-[32px] pl-1 font-light mt-2"
            >
              Senha
            </label>

            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full h-10 px-4 rounded-full border outline-none"
            />
          </div>

          {erro && (
            <p role="alert" className="text-red-600 mt-3 text-center">
              {erro}
            </p>
          )}

          <div className="mt-20 mb-3 text-center">
            <Link
              to="/Cadastro_user"
              className="text-[32px] font-normal text-azulleve hover:underline"
            >
              Não possui cadastro?
            </Link>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-azulleve cursor-pointer text-white text-[32px] font-medium rounded-lg shadow-sm disabled:opacity-50"
          >
            {carregando ? "Entrando..." : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}