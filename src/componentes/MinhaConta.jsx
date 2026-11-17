
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./VerificadorLogin";

const API_URL = "/api";

export default function MinhaConta() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cnpj, setCnpj] = useState("");
  const [nomeLoja, setNomeLoja] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function formatarCnpj(valor) {
    const n = valor.replace(/\D/g, "").slice(0, 14);

    return n
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  function seguirCadastro() {
    if (cnpj.replace(/\D/g, "").length !== 14) {
      setErro("Informe um CNPJ de 14 dígitos.");
      return;
    }

    navigate("/criar-loja", {
      state: { cnpj: cnpj.replace(/\D/g, "") }
    });
  }

  async function acessarLoja(event) {
    event.preventDefault();

    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch(
        `${API_URL}/lojas/minha`,
        { credentials: "include" }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.mensagem || "Erro ao buscar loja."
        );
      }

      if (!resultado.loja) {
        throw new Error("Você ainda não possui uma loja.");
      }

      if (
        resultado.loja.nome.trim().toLowerCase() !==
        nomeLoja.trim().toLowerCase()
      ) {
        throw new Error("Nome da loja não corresponde.");
      }

      navigate("/vendedor/anuncios");

    } catch (error) {
      setErro(error.message);

    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-170px)]
      bg-azulultraleve p-6">

      <div className="max-w-240 mx-auto grid
        grid-cols-1 md:grid-cols-2 gap-8">

        {/* DADOS PESSOAIS */}
        <section className="bg-white border rounded-lg p-5">
          <h2 className="text-2xl font-bold text-center">
            Atualizar Cadastro
          </h2>

          <hr className="my-4 border-azulleve" />

          <div className="flex flex-col gap-4">
            <div>
              <label>Nome</label>
              <input
                value={`${user?.nome || ""} ${user?.sobrenome || ""}`}
                readOnly
                className="w-full border rounded-full
                  px-3 h-10 bg-gray-100"
              />
            </div>

            <div>
              <label>Email</label>
              <input
                value={user?.email || ""}
                readOnly
                className="w-full border rounded-full
                  px-3 h-10 bg-gray-100"
              />
            </div>

            <p className="text-sm text-gray-500">
              Seus dados podem ser consultados aqui.
              A edição cadastral e a alteração de senha
              serão habilitadas em uma etapa específica.
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-5">

          {/* CADASTRAR LOJA */}
          <section className="bg-white border rounded-lg p-5">
            <h2 className="text-xl font-semibold text-center">
              Quero ser Vendedor
            </h2>

            <hr className="my-4 border-azulleve" />

            <p className="text-sm mb-4">
              Para continuar, informe um CNPJ.
              Nesta versão de desenvolvimento,
              são aceitos CNPJs fictícios.
            </p>

            <input
              type="text"
              inputMode="numeric"
              placeholder="00.000.000/0000-00"
              value={cnpj}
              onChange={(e) =>
                setCnpj(formatarCnpj(e.target.value))
              }
              className="w-full border rounded-full
                px-3 h-10 text-center"
            />

            <button
              type="button"
              onClick={seguirCadastro}
              className="w-full bg-azulforte text-white
                font-bold rounded-full mt-3 cursor-pointer"
            >
              Seguir para cadastro
            </button>
          </section>

          {/* ACESSAR LOJA */}
          <section className="bg-white border rounded-lg p-5">
            <h2 className="text-xl font-semibold text-center">
              Acessar minha loja
            </h2>

            <hr className="my-4 border-azulleve" />

            <form
              onSubmit={acessarLoja}
              className="flex flex-col gap-3"
            >
              <div>
                <label htmlFor="nomeLoja">
                  Nome da loja
                </label>

                <input
                  id="nomeLoja"
                  value={nomeLoja}
                  onChange={(e) =>
                    setNomeLoja(e.target.value)
                  }
                  required
                  className="w-full border rounded-full
                    px-3 h-10"
                />
              </div>

              <p className="text-xs text-gray-500">
                A autenticação é feita pela sua conta.
                Não é necessária outra senha.
              </p>

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-azulforte text-white
                  font-bold rounded-full cursor-pointer
                  disabled:opacity-50"
              >
                {carregando ? "Acessando..." : "Ir para loja"}
              </button>
            </form>
          </section>

          {erro && (
            <p role="alert" className="text-red-600 text-center">
              {erro}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
