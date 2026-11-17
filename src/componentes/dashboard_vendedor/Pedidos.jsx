
import { useCallback, useEffect, useState } from "react";
import Navegando_dashboard from "./Navegando_dashboard";
const API_URL = "/api/pedidos";

const ABAS = [
  { id: "pendentes", nome: "Pendentes" },
  { id: "prontos", nome: "Prontos" },
  { id: "concluidos", nome: "Concluídos" }
];

function formatarPreco(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatarData(data) {
  if (!data) return "-";

  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function nomeComprador(comprador) {
  if (!comprador) return "Comprador não disponível";

  const nome = [
    comprador.nome,
    comprador.sobrenome
  ].filter(Boolean).join(" ");

  return nome || "Comprador";
}

function obterSituacao(status) {
  const situacoes = {
    pendente: "Aguardando preparação",
    em_preparacao: "Em preparação",
    pronto: "Pronto para retirada",
    concluido: "Concluído",
    cancelado: "Cancelado"
  };

  return situacoes[status] || status;
}

export default function Pedidos() {
  const [abaAtiva, setAbaAtiva] = useState("pendentes");
  const [pedidos, setPedidos] = useState([]);
  const [loja, setLoja] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizandoId, setAtualizandoId] = useState(null);

  // Consulta somente os pedidos da loja autenticada
  const carregarPedidos = useCallback(async () => {
    try {
      setErro("");

      const resposta = await fetch(
        `${API_URL}/minha-loja`,
        {
          credentials: "include"
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
          "Não foi possível carregar os pedidos."
        );
      }

      setPedidos(
        Array.isArray(dados.pedidos)
          ? dados.pedidos
          : []
      );

      setLoja(dados.loja);

    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  // Atualiza somente a situação de preparação
  async function alterarStatus(pedidoId, novoStatus) {
    if (atualizandoId) return;

    try {
      setAtualizandoId(pedidoId);
      setErro("");

      const resposta = await fetch(
        `${API_URL}/${pedidoId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            statusPedido: novoStatus
          })
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
          "Não foi possível atualizar o pedido."
        );
      }

      // Atualiza a lista usando o estado confirmado
      // pelo backend, não apenas a escolha do botão.
      setPedidos(anteriores =>
        anteriores.map(pedido =>
          pedido._id === pedidoId
            ? { ...pedido, ...dados.pedido }
            : pedido
        )
      );

    } catch (error) {
      setErro(error.message);
      await carregarPedidos();
    } finally {
      setAtualizandoId(null);
    }
  }

  // Apenas pedidos com pagamento aprovado
  // participam das abas de preparação.
  const pedidosAprovados = pedidos.filter(
    pedido => pedido.statusPagamento === "aprovado"
  );

  const pedidosFiltrados = pedidosAprovados.filter(pedido => {
    if (abaAtiva === "pendentes") {
      return [
        "pendente",
        "em_preparacao"
      ].includes(pedido.statusPedido);
    }

    if (abaAtiva === "prontos") {
      return pedido.statusPedido === "pronto";
    }

    return pedido.statusPedido === "concluido";
  });

  const contagens = {
    pendentes: pedidosAprovados.filter(
      p => ["pendente", "em_preparacao"].includes(
        p.statusPedido
      )
    ).length,

    prontos: pedidosAprovados.filter(
      p => p.statusPedido === "pronto"
    ).length,

    concluidos: pedidosAprovados.filter(
      p => p.statusPedido === "concluido"
    ).length
  };

  return (
    <main className="w-full h-[calc(100dvh-170px)] flex">
        <Navegando_dashboard/>
        <div className="w-full p-5 overflow-y-auto">
            <div className="flex flex-wrap items-center
                justify-between gap-4 mb-6">

                <div>
                <h1 className="text-2xl font-bold">
                    Pedidos
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    {loja?.nome || "Minha loja"}
                </p>
                </div>

                <button
                type="button"
                onClick={() => {
                    setCarregando(true);
                    carregarPedidos();
                }}
                disabled={carregando}
                className="px-4 py-2 border rounded-lg
                    bg-white hover:bg-gray-50
                    disabled:opacity-50"
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
                    className={`px-4 py-3 rounded-lg
                    font-semibold transition-colors ${
                        abaAtiva === aba.id
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 text-gray-700"
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
                className="bg-red-50 text-red-700
                    border border-red-200 rounded-lg
                    p-4 mb-5"
                >
                {erro}
                </div>
            )}

            {carregando ? (
                <p className="text-gray-500">
                Carregando pedidos...
                </p>
            ) : pedidosFiltrados.length === 0 ? (
                <div className="bg-white border rounded-xl
                p-10 text-center">

                <p className="font-semibold">
                    Nenhum pedido nesta categoria.
                </p>

                <p className="text-gray-500 text-sm mt-2">
                    Os pedidos da loja aparecerão aqui.
                </p>
                </div>
            ) : (
                <div className="grid gap-4">

                {pedidosFiltrados.map(pedido => (
                    <article
                    key={pedido._id}
                    className="bg-white border rounded-xl
                        p-5 shadow-sm"
                    >

                    <div className="flex flex-wrap
                        justify-between gap-3">

                        <div>
                        <h2 className="font-bold">
                            Pedido #{pedido._id.slice(-8)}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {formatarData(pedido.createdAt)}
                        </p>
                        </div>

                        <div className="text-right">
                        <p className="font-bold text-lg">
                            {formatarPreco(
                            pedido.totalCentavos
                            )}
                        </p>

                        {pedido.simulado && (
                            <span className="text-xs text-blue-700">
                            Compra simulada
                            </span>
                        )}
                        </div>

                    </div>

                    <div className="border-t my-4" />

                    {/* Comprador */}
                    <p className="text-sm mb-3">
                        <span className="text-gray-500">
                        Comprador:{" "}
                        </span>

                        <span className="font-medium">
                        {nomeComprador(pedido.comprador)}
                        </span>
                    </p>

                    {/* Produtos */}
                    <div className="space-y-3">
                        {pedido.itens?.map((item, index) => (
                        <div
                            key={`${item.produto}-${index}`}
                            className="flex justify-between gap-3"
                        >
                            <div>
                            <p className="font-medium">
                                {item.nome}
                            </p>

                            <p className="text-sm text-gray-500">
                                {item.quantidade} unidade(s)
                            </p>
                            </div>

                            <p className="font-medium">
                            {formatarPreco(
                                item.precoUnitarioCentavos *
                                item.quantidade
                            )}
                            </p>
                        </div>
                        ))}
                    </div>

                    <div className="border-t my-4" />

                    {/* Status e ações */}
                    <div className="flex flex-wrap
                        items-center justify-between gap-3">

                        <span className="text-sm font-semibold
                        bg-gray-100 rounded-full
                        px-4 py-2">
                        {obterSituacao(
                            pedido.statusPedido
                        )}
                        </span>

                        {pedido.statusPedido === "pendente" && (
                        <button
                            type="button"
                            disabled={
                            atualizandoId !== null
                            }
                            onClick={() =>
                            alterarStatus(
                                pedido._id,
                                "em_preparacao"
                            )
                            }
                            className="bg-blue-700 text-white
                            rounded-lg px-5 py-2
                            font-semibold disabled:opacity-50"
                        >
                            {atualizandoId === pedido._id
                            ? "Atualizando..."
                            : "Iniciar preparação"}
                        </button>
                        )}

                        {pedido.statusPedido ===
                        "em_preparacao" && (
                        <button
                            type="button"
                            disabled={
                            atualizandoId !== null
                            }
                            onClick={() =>
                            alterarStatus(
                                pedido._id,
                                "pronto"
                            )
                            }
                            className="bg-blue-700 text-white
                            rounded-lg px-5 py-2
                            font-semibold disabled:opacity-50"
                        >
                            {atualizandoId === pedido._id
                            ? "Atualizando..."
                            : "Marcar como pronto"}
                        </button>
                        )}

                        {pedido.statusPedido === "pronto" && (
                        <p className="text-sm text-gray-500">
                            Aguardando retirada do comprador
                        </p>
                        )}

                        {pedido.statusPedido === "concluido" && (
                        <p className="text-sm text-green-700">
                            Pedido finalizado
                        </p>
                        )}

                    </div>

                    </article>
                ))}
                </div>
            )}
        </div>
      {/* Cabeçalho */}
      

    </main>
  );
}
