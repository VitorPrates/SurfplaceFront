
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

const API_URL = "/api";
const API_ORIGIN = "https://cusp-bargraph-overhung.ngrok-free.dev";

export default function Produto() {
  const { lojaId, produtoId } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [loja, setLoja] = useState(null);
  const [fotoAtual, setFotoAtual] = useState(0);
  const [quantidade, setQuantidade] = useState(1);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function buscarProduto() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch(
          `${API_URL}/lojas/${lojaId}/produtos/${produtoId}`,
          { signal: controller.signal }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.mensagem || "Produto não encontrado."
          );
        }

        setProduto(dados.produto);
        setLoja(dados.loja);
        setFotoAtual(0);
        setQuantidade(1);

      } catch (error) {
        if (error.name !== "AbortError") {
          setErro(error.message);
        }

      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    buscarProduto();

    return () => controller.abort();
  }, [lojaId, produtoId]);

  if (carregando) {
    return (
      <main className="p-8">
        Carregando produto...
      </main>
    );
  }

  if (erro || !produto) {
    return (
      <main className="p-8 text-red-600">
        {erro || "Produto não encontrado."}
      </main>
    );
  }

  const fotos = produto.fotos || [];

  const preco = (produto.precoCentavos / 100)
    .toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  function comprarAgora() {
    if (!produto?._id) return;

    const tentativa = crypto.randomUUID();

    const parametros = new URLSearchParams({
        produtoId: produto._id,
        quantidade: String(quantidade),
        tentativa
    });

    navigate(`/checkout?${parametros.toString()}`);
    }

  return (
    <main className="bg-azulultraleve min-h-[calc(100dvh-170px)] p-5">
      <div className="max-w-250 mx-auto bg-white p-5 rounded">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-azulleve cursor-pointer mb-4"
        >
          &lt; Voltar
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* GALERIA */}
          <section>
            <div className="w-full h-90 bg-white border rounded flex items-center justify-center">
              {fotos.length > 0 ? (
                <img
                  src={`${API_ORIGIN}${fotos[fotoAtual]}`}
                  alt={produto.nome}
                  className="w-full h-full object-contain"
                />
              ) : (
                <p className="text-gray-400">
                  Produto sem imagem
                </p>
              )}
            </div>

            <div className="grid grid-cols-5 gap-2 mt-3">
              {fotos.map((foto, indice) => (
                <button
                  key={foto}
                  type="button"
                  onClick={() => setFotoAtual(indice)}
                  aria-label={`Ver foto ${indice + 1}`}
                  className={`h-17 border-2 rounded overflow-hidden cursor-pointer ${
                    fotoAtual === indice
                      ? "border-azulleve"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={`${API_ORIGIN}${foto}`}
                    alt={`Foto ${indice + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </section>

          {/* DADOS DO PRODUTO */}
          <section className="border rounded-lg p-4 flex flex-col gap-4">
            <h1 className="text-[26px] font-semibold leading-tight">
              {produto.nome}
            </h1>

            <p className="text-[27px] font-bold">
              {preco}
            </p>

            <p className="text-sm text-gray-500">
              Vendido por: {loja?.nome}
            </p>

            <p className="text-sm">
              {produto.quantidade > 0
                ? `${produto.quantidade} unidades disponíveis`
                : "Produto indisponível"}
            </p>

            <div className="flex items-center gap-3">
              <label htmlFor="quantidade">
                Quantidade:
              </label>

              <input
                id="quantidade"
                type="number"
                min="1"
                max={produto.quantidade}
                step="1"
                value={quantidade}
                onChange={(e) => {
                  const valor = Number(e.target.value);

                  if (Number.isInteger(valor)) {
                    setQuantidade(
                      Math.min(
                        produto.quantidade,
                        Math.max(1, valor)
                      )
                    );
                  }
                }}
                className="w-20 h-9 border rounded px-2"
              />
            </div>

            <button
              type="button"
              onClick={comprarAgora}
              disabled={produto.quantidade <= 0}
              className="bg-azulforte text-white font-bold rounded-full py-2 cursor-pointer disabled:opacity-50"
            >
              Comprar agora
            </button>

            <button
              type="button"
              disabled={produto.quantidade <= 0}
              className="bg-azulultraleve text-azulforte font-bold rounded-full py-2 disabled:opacity-50"
              title="Carrinho será implementado na próxima etapa"
            >
              Adicionar ao carrinho (em breve)
            </button>

            <h2 className="font-semibold">
              Descrição do produto
            </h2>

            <p className="text-sm whitespace-pre-wrap break-words">
              {produto.descricao}
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
