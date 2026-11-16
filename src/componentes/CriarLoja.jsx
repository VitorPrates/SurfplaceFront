
import { useState } from "react";
import {
  useLocation,
  useNavigate
} from "react-router-dom";

const API_URL = "http://localhost:4000/api";

export default function CriarLoja() {
  const navigate = useNavigate();
  const location = useLocation();

  const cnpj = location.state?.cnpj || "";

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function cadastrarLoja(event) {
    event.preventDefault();

    if (carregando) return;

    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch(`${API_URL}/lojas`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          descricao,
          cnpj
        })
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.mensagem || "Erro ao cadastrar loja."
        );
      }

      // Depois do cadastro, entrar no dashboard.
      navigate("/vendedor/anuncios", {
        replace: true
      });

    } catch (error) {
      setErro(error.message);

    } finally {
      setCarregando(false);
    }
  }

  // Sem CNPJ, retornar ao início do cadastro
  if (!/^\d{14}$/.test(cnpj)) {
    return (
      <main className="min-h-[70vh] bg-azulultraleve
        flex flex-col items-center justify-center gap-4">

        <p>Informe um CNPJ antes de criar sua loja.</p>

        <button
          onClick={() => navigate("/minha-conta")}
          className="bg-azulforte text-white px-6 py-2
            rounded-lg cursor-pointer"
        >
          Voltar para minha conta
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100dvh-170px)]
      bg-azulultraleve p-6">

      <div className="max-w-225 mx-auto grid
        grid-cols-1 md:grid-cols-2 gap-8">

        {/* FORMULÁRIO */}
        <section className="bg-white border rounded-lg p-5">
          <h2 className="text-xl font-bold text-center">
            Criar Cadastro de Vendedor
          </h2>

          <hr className="my-4 border-azulleve" />

          <form
            onSubmit={cadastrarLoja}
            className="flex flex-col gap-3"
          >
            <div>
              <label>CNPJ</label>
              <input
                value={cnpj}
                readOnly
                className="w-full border rounded-full
                  h-10 px-3 bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="nomeLojaCadastro">
                Nome da loja
              </label>

              <input
                id="nomeLojaCadastro"
                type="text"
                required
                maxLength={80}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border rounded-full
                  h-10 px-3"
              />
            </div>

            <div>
              <label htmlFor="descricaoLoja">
                Descrição da loja
              </label>

              <textarea
                id="descricaoLoja"
                value={descricao}
                onChange={(e) =>
                  setDescricao(e.target.value)
                }
                maxLength={1000}
                rows={5}
                className="w-full border rounded-lg p-3
                  resize-none"
              />
            </div>

            <p className="text-xs text-gray-500">
              A logo poderá ser adicionada quando
              implementarmos o upload da loja.
            </p>

            {erro && (
              <p role="alert" className="text-red-600 text-sm">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-azulforte text-white
                font-bold rounded-full cursor-pointer
                disabled:opacity-50"
            >
              {carregando ? "Criando loja..." : "Criar Loja"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/minha-conta")}
              className="w-full bg-azulultraleve
                rounded-full cursor-pointer"
            >
              Cancelar
            </button>
          </form>
        </section>

        {/* INFORMAÇÕES */}
        <aside className="bg-white border rounded-lg
          p-5 h-fit">
          <h2 className="text-xl font-semibold text-center">
            Informações importantes
          </h2>

          <hr className="my-4 border-azulleve" />

          <div className="flex flex-col gap-4 text-sm">
            <p>Você pode criar uma loja nesta versão do Surfplace.</p>

            <p>Os dados poderão ser editados futuramente.</p>

            <p>A localização será adicionada nas configurações da loja.</p>

            <p>Os produtos serão associados à loja na próxima etapa.</p>
          </div>
        </aside>

      </div>
    </main>
  );
}
