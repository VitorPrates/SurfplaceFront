
import {
  useCallback,
  useEffect,
  useState
} from "react";

const API_URL = "/api/pedidos";

const ABAS = [
  { id: "andamento", nome: "Em andamento" },
  { id: "concluidas", nome: "Concluídas" },
  { id: "canceladas", nome: "Canceladas" }
];

function formatarPreco(centavos) {
  return (centavos / 100).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );
}

function formatarData(data) {
  if (!data) return "-";

  return new Date(data).toLocaleString(
    "pt-BR",
    {
      dateStyle: "short",
      timeStyle: "short"
    }
  );
}

function obterSituacao(pedido) {
  if (pedido.statusPedido === "cancelado") {
    return "Cancelado";
  }

  if (pedido.statusPagamento !== "aprovado") {
    const situacoesPagamento = {
      aguardando: "Aguardando pagamento",
      recusado: "Pagamento recusado",
      estornado: "Pagamento estornado"
    };

    return (
      situacoesPagamento[pedido.statusPagamento] ||
      "Pagamento não confirmado"
    );
  }

  const situacoes = {
    pendente: "Aguardando preparação",
    em_preparacao: "Em preparação",
    pronto: "Pronto para retirada",
    concluido: "Concluído"
  };

  return situacoes[pedido.statusPedido] ||
    pedido.statusPedido;
}

function obterAba(pedido) {
  if (pedido.statusPedido === "cancelado") {
    return "canceladas";
  }

  if (pedido.statusPedido === "concluido") {
    return "concluidas";
  }

  return "andamento";
}

export default function MinhasCompras() {
  const [pedidos, setPedidos] = useState([]);
  const [abaAtiva, setAbaAtiva] =
    useState("andamento");

  const [carregando, setCarregando] = useState(true);
  const [atualizandoId, setAtualizandoId] =
    useState(null);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const carregarPedidos = useCallback(async () => {
    try {
      setErro("");

      const resposta = await fetch(
        `${API_URL}/meus`,
        {
          credentials: "include"
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(
          dados.mensagem ||
          "Não foi possível carregar suas compras."
        );
      }

      setPedidos(
        Array.isArray(dados.pedidos)
          ? dados.pedidos
          : []
      );

    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  async function cancelarPedido(pedidoId) {
    if (atualizandoId !== null) return;

    const confirmado = window.confirm(
      "Deseja cancelar esta compra simulada?"
    );

    if (!confirmado) return;

    try {
      setAtualizandoId(pedidoId);
      setErro("");
      setMensagem("");

      const resposta = await fetch(
        `${API_URL}/${pedidoId}/cancelar`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(
          dados.mensagem ||
          "Não foi possível cancelar a compra."
        );
      }

      // Atualiza a interface após a confirmação
      // do backend, que já restaurou o estoque.
      setPedidos(anteriores =>
        anteriores.map(pedido =>
          pedido._id === pedidoId
            ? {
                ...pedido,
                statusPedido: "cancelado",
                statusPagamento: "cancelado",
                codigoRetirada: null
              }
            : pedido
        )
      );

      setMensagem(
        dados.reutilizado
          ? "Esta compra já estava cancelada."
          : "Compra simulada cancelada com sucesso."
      );

    } catch (error) {
      setErro(error.message);

      // Recarrega o estado verdadeiro do servidor
      // em caso de conflito ou alteração simultânea.
      await carregarPedidos();
    } finally {
      setAtualizandoId(null);
    }
  }

  const pedidosFiltrados = pedidos.filter(
    pedido => obterAba(pedido) === abaAtiva
  );

  const contagens = {
    andamento: pedidos.filter(
      p => obterAba(p) === "andamento"
    ).length,

    concluidas: pedidos.filter(
      p => obterAba(p) === "concluidas"
    ).length,

    canceladas: pedidos.filter(
      p => obterAba(p) === "canceladas"
    ).length
  };

  return (
    <main className="min-h-[75vh] bg-gray-50 p-5 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Cabeçalho */}
        <div className="flex flex-wrap
          justify-between items-center
          gap-4 mb-6">

          <div>
            <h1 className="text-2xl font-bold">
              Minhas compras
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Acompanhe seus pedidos e retiradas.
            </p>
          </div>

          <button
            type="button"
            disabled={carregando}
            onClick={() => {
              setCarregando(true);
              carregarPedidos();
            }}
            className="border rounded-lg bg-white
              px-4 py-2 disabled:opacity-50"
          >
            Atualizar pedidos
          </button>
        </div>

        {/* Abas */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ABAS.map(aba => (
            <button
              key={aba.id}
              type="button"
              onClick={() => setAbaAtiva(aba.id)}
              className={`rounded-lg px-4 py-3
                font-semibold ${
                  abaAtiva === aba.id
                    ? "bg-blue-700 text-white"
                    : "bg-white border text-gray-700"
                }`}
            >
              {aba.nome} ({contagens[aba.id]})
            </button>
          ))}
        </div>

        {/* Mensagens */}
        {erro && (
          <div
            role="alert"
            className="mb-5 rounded-lg border
              border-red-200 bg-red-50
              p-4 text-red-700"
          >
            {erro}
          </div>
        )}

        {mensagem && (
          <div
            role="status"
            className="mb-5 rounded-lg border
              border-green-200 bg-green-50
              p-4 text-green-800"
          >
            {mensagem}
          </div>
        )}

        {carregando ? (
          <p className="text-gray-500">
            Carregando suas compras...
          </p>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="bg-white border
            rounded-xl p-10 text-center">

            <p className="font-semibold">
              Nenhuma compra nesta categoria.
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Seus pedidos aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">

            {pedidosFiltrados.map(pedido => {
              const podeCancelar =
                pedido.simulado === true &&
                pedido.statusPagamento === "aprovado" &&
                pedido.statusPedido === "pendente";

              const podeMostrarCodigo =
                pedido.simulado === true &&
                pedido.statusPagamento === "aprovado" &&
                pedido.statusPedido === "pronto" &&
                Boolean(pedido.codigoRetirada);

              return (
                <article
                  key={pedido._id}
                  className="bg-white border
                    rounded-xl p-5 shadow-sm"
                >

                  {/* Pedido e valor */}
                  <div className="flex flex-wrap
                    justify-between gap-3">

                    <div>
                      <h2 className="font-bold">
                        Pedido #
                        {pedido._id.slice(-8)}
                      </h2>

                      <p className="text-gray-500
                        text-sm mt-1">
                        {formatarData(
                          pedido.createdAt
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatarPreco(
                          pedido.totalCentavos
                        )}
                      </p>

                      {pedido.simulado && (
                        <p className="text-blue-700
                          text-xs mt-1">
                          Compra simulada
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t my-4" />

                  {/* Loja */}
                  <p className="text-sm mb-4">
                    <span className="text-gray-500">
                      Vendido por:{" "}
                    </span>

                    <span className="font-semibold">
                      {pedido.loja?.nome ||
                        "Loja não disponível"}
                    </span>
                  </p>

                  {/* Produtos */}
                  <div className="space-y-3">
                    {pedido.itens?.map(
                      (item, index) => (
                        <div
                          key={`${item.produto}-${index}`}
                          className="flex justify-between
                            gap-3"
                        >
                          <div>
                            <p className="font-medium">
                              {item.nome}
                            </p>

                            <p className="text-gray-500
                              text-sm mt-1">
                              {item.quantidade}
                              {" "}unidade(s)
                            </p>
                          </div>

                          <p className="font-medium">
                            {formatarPreco(
                              item.precoUnitarioCentavos *
                              item.quantidade
                            )}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  <div className="border-t my-4" />

                  {/* Situação */}
                  <div className="flex flex-wrap
                    items-center justify-between
                    gap-3">

                    <span className="bg-gray-100
                      rounded-full px-4 py-2
                      text-sm font-semibold">
                      {obterSituacao(pedido)}
                    </span>

                    {podeCancelar && (
                      <button
                        type="button"
                        disabled={
                          atualizandoId !== null
                        }
                        onClick={() =>
                          cancelarPedido(pedido._id)
                        }
                        className="rounded-lg border
                          border-red-500 text-red-600
                          px-5 py-2 font-semibold
                          hover:bg-red-50
                          disabled:opacity-50"
                      >
                        {atualizandoId === pedido._id
                          ? "Cancelando..."
                          : "Cancelar compra"}
                      </button>
                    )}
                  </div>

                  {/* Código de retirada */}
                  {podeMostrarCodigo && (
                    <div className="mt-5
                      rounded-xl bg-blue-50
                      border border-blue-200 p-5">

                      <h3 className="font-bold
                        text-blue-900">
                        Código de retirada
                      </h3>

                      <p className="text-sm
                        text-blue-800 mt-2">
                        Apresente este código
                        ao vendedor para confirmar
                        a retirada do pedido.
                      </p>

                      <div className="mt-4
                        rounded-lg bg-white
                        border border-blue-200
                        px-4 py-3 text-center">

                        <span className="font-mono
                          font-bold text-xl
                          tracking-widest break-all">
                          {pedido.codigoRetirada}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            pedido.codigoRetirada
                          ).then(
                            () => setMensagem(
                              "Código copiado!"
                            ),
                            () => setErro(
                              "Não foi possível copiar o código."
                            )
                          )
                        }
                        className="mt-3 text-sm
                          font-semibold text-blue-700
                          underline"
                      >
                        Copiar código
                      </button>
                    </div>
                  )}

                  {pedido.statusPedido === "concluido" && (
                    <p className="mt-4 text-sm
                      text-green-700">
                      Retirada concluída em{" "}
                      {formatarData(pedido.concluidoEm)}
                    </p>
                  )}

                  {pedido.statusPedido === "cancelado" && (
                    <p className="mt-4 text-sm
                      text-gray-500">
                      Esta compra foi cancelada.
                    </p>
                  )}

                </article>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
