
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:4000/api";

export default function Cadastro_user() {
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: ""
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function alterarCampo(event) {
    const { name, value } = event.target;

    setDados((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  async function cadastrar(event) {
    event.preventDefault();

    if (carregando) return;

    if (dados.senha !== dados.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (dados.senha.length < 8) {
      setErro("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch(`${API_URL}/cadastro`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: dados.nome,
          sobrenome: dados.sobrenome,
          email: dados.email,
          telefone: dados.telefone,
          senha: dados.senha
        })
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.mensagem || "Erro ao realizar cadastro."
        );
      }

      navigate("/login", {
        replace: true
      });

    } catch (error) {
      setErro(error.message);

    } finally {
      setCarregando(false);
    }
  }

  const campos = [
    { nome: "nome", titulo: "Nome", tipo: "text" },
    { nome: "sobrenome", titulo: "Sobrenome", tipo: "text" },
    { nome: "email", titulo: "E-mail", tipo: "email" },
    { nome: "telefone", titulo: "Telefone (DDD + número)", tipo: "tel" },
    { nome: "senha", titulo: "Senha (mín. 8 caracteres)", tipo: "password" },
    { nome: "confirmarSenha", titulo: "Confirmar senha", tipo: "password" }
  ];

  return (
    <div className="min-h-[calc(100dvh-170px)] w-full bg-azulultraleve flex items-center justify-center p-4 font-sans">
      <div className="w-125 max-w-full bg-white rounded px-5 py-5 border-2">

        <h3 className="font-bold text-[40px] text-center">
          Faça seu cadastro
        </h3>

        <form
          onSubmit={cadastrar}
          className="flex flex-col"
        >
          {campos.map((campo) => (
            <div
              key={campo.nome}
              className="flex flex-col"
            >
              <label
                htmlFor={campo.nome}
                className="text-[25px] font-light"
              >
                {campo.titulo}
              </label>

              <input
                id={campo.nome}
                name={campo.nome}
                type={campo.tipo}
                value={dados[campo.nome]}
                onChange={alterarCampo}
                required
                minLength={
                  campo.nome === "senha" ? 8 : undefined
                }
                maxLength={
                  campo.nome === "senha" ? 72 : undefined
                }
                autoComplete={
                  campo.nome === "senha"
                    ? "new-password"
                    : campo.nome === "confirmarSenha"
                      ? "new-password"
                      : undefined
                }
                className="px-4 w-full border rounded-3xl h-10"
              />
            </div>
          ))}

          {erro && (
            <p
              role="alert"
              className="text-red-600 text-center mt-3"
            >
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="bg-azulleve cursor-pointer text-white font-bold w-full rounded text-[28px] mt-8 disabled:opacity-50"
          >
            {carregando ? "Cadastrando..." : "Continuar"}
          </button>

          <Link
            to="/login"
            className="bg-azulforte text-white font-bold w-full rounded text-[28px] mt-2 text-center"
          >
            Voltar
          </Link>
        </form>
      </div>
    </div>
  );
}