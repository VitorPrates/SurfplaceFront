
import { useEffect, useMemo, useState } from "react";
import Navegando_dashboard from "./Navegando_dashboard";

const PERIODOS = [7, 30, 90];

function moeda(centavos = 0) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function dataHora(valor) {
  if (!valor) return "-";

  return new Date(valor).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short"
  });
}

function dataSP(valor) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(valor));
}

function legendaDia(iso) {
  const [ano, mes, dia] = iso.split("-").map(Number);

  return new Date(
    Date.UTC(ano, mes - 1, dia)
  ).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit"
  });
}

// Inclui os dias do intervalo retornado pelo backend,
// preenchendo os dias sem vendas com zero.
function montarGrafico(vendas = [], periodo) {
  if (!periodo?.inicio || !periodo?.fim) return [];

  const valores = new Map(
    vendas.map(item => [
      item.data,
      item.faturamentoCentavos
    ])
  );

  const inicio = dataSP(periodo.inicio);
  const fim = dataSP(periodo.fim);

  const cursor = new Date(`${inicio}T12:00:00Z`);
  const ultimo = new Date(`${fim}T12:00:00Z`);

  const resultado = [];

  while (cursor <= ultimo && resultado.length <= 92) {
    const dia = cursor.toISOString().slice(0, 10);

    resultado.push({
      data: dia,
      valor: valores.get(dia) || 0
    });

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return resultado;
}

function CardIndicador({ titulo, valor, descricao }) {
  return (
    <div className="rounded-xl border border-gray-200
      bg-white p-5 shadow-sm">

      <p className="text-sm text-gray-500">
        {titulo}
      </p>

      <p className="mt-2 break-words text-2xl
        font-bold text-gray-900">
        {valor}
      </p>

      {descricao && (
        <p className="mt-2 text-xs text-gray-500">
          {descricao}
        </p>
      )}
    </div>
  );
}

function GraficoVendas({ vendas, periodo }) {
  const dias = useMemo(
    () => montarGrafico(vendas, periodo),
    [vendas, periodo]
  );

  const maiorValor = Math.max(
    1,
    ...dias.map(dia => dia.valor)
  );

  const temVendas = dias.some(dia => dia.valor > 0);

  return (
    <section className="rounded-xl border
      border-gray-200 bg-white p-5 shadow-sm">

      <div className="mb-5">
        <h2 className="text-lg font-bold">
          Faturamento por dia
        </h2>

        <p className="text-sm text-gray-500">
          Pedidos simulados concluídos no período.
        </p>
      </div>

      {!temVendas && (
        <p className="mb-4 text-sm text-gray-500">
          Nenhuma venda concluída neste período.
        </p>
      )}

      <div className="overflow-x-auto pb-2">
        <div
          className="flex h-64 items-end gap-1.5
            border-b border-gray-200"
          style={{
            minWidth: Math.max(500, dias.length * 15)
          }}
        >
          {dias.map(dia => {
            const altura = dia.valor > 0
              ? Math.max(
                  2,
                  (dia.valor / maiorValor) * 100
                )
              : 0;

            return (
              <div
                key={dia.data}
                className="group relative flex h-full
                  min-w-0 flex-1 items-end"
                title={
                  `${legendaDia(dia.data)}: ` +
                  moeda(dia.valor)
                }
              >
                <div
                  className="w-full rounded-t
                    bg-blue-600 transition-colors
                    group-hover:bg-blue-800"
                  style={{ height: `${altura}%` }}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex justify-between
          text-xs text-gray-500">
          <span>
            {dias.length
              ? legendaDia(dias[0].data)
              : "-"}
          </span>

          <span>
            {dias.length
              ? legendaDia(dias[dias.length - 1].data)
              : "-"}
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Passe o mouse sobre as barras para consultar
        os valores de cada dia.
      </p>
    </section>
  );
}

export default function Financeiro() {
  const [dias, setDias] = useState(30);
  const [recarregar, setRecarregar] = useState(0);

  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function carregarFinanceiro() {
      setCarregando(true);
      setErro("");
      setDados(null);

      try {
        const resposta = await fetch(
          `/api/financeiro/resumo?dias=${dias}`,
          {
            credentials: "include",
            signal: controller.signal
          }
        );

        const resultado = await resposta.json();

        if (!resposta.ok || !resultado.sucesso) {
          throw new Error(
            resultado.mensagem ||
            "Não foi possível carregar o financeiro."
          );
        }

        if (!controller.signal.aborted) {
          setDados(resultado);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setErro(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarFinanceiro();

    return () => controller.abort();
  }, [dias, recarregar]);

  const indicadores = dados?.indicadores;

  return (
    <main className="w-full h-[calc(100dvh-170px)] bg-gray-50 flex">
        <Navegando_dashboard/>
        <div className="h-[calc(100dvh-170px)] overflow-y-scroll w-full p-5 md:p-8">
            <div className="mx-auto max-w-7xl">

            {/* Cabeçalho */}
            <div className="mb-6 flex flex-wrap
            items-center justify-between gap-4">

            <div>
                <h1 className="text-2xl font-bold">
                Financeiro
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                {dados?.loja?.nome || "Minha loja"}
                </p>

                <p className="mt-1 text-xs text-blue-700">
                Financeiro demonstrativo — não
                representa saldo recebido.
                </p>
            </div>

            <div className="flex items-center gap-2">

                <select
                value={dias}
                onChange={e =>
                    setDias(Number(e.target.value))
                }
                className="rounded-lg border
                    border-gray-300 bg-white
                    px-3 py-2"
                >
                {PERIODOS.map(periodo => (
                    <option
                    key={periodo}
                    value={periodo}
                    >
                    Últimos {periodo} dias
                    </option>
                ))}
                </select>

                <button
                type="button"
                onClick={() =>
                    setRecarregar(atual => atual + 1)
                }
                disabled={carregando}
                className="rounded-lg border
                    border-gray-300 bg-white
                    px-4 py-2 hover:bg-gray-100
                    disabled:opacity-50"
                >
                Atualizar
                </button>

            </div>
            </div>

            {/* Carregamento e erros */}
            {carregando && (
            <p className="py-10 text-center text-gray-500">
                Carregando dados financeiros...
            </p>
            )}

            {erro && (
            <div
                role="alert"
                className="mb-6 rounded-lg border
                border-red-200 bg-red-50
                p-4 text-red-700"
            >
                {erro}
            </div>
            )}

            {!carregando && dados && (
            <div className="space-y-6">

                {/* Indicadores principais */}
                <div className="grid grid-cols-1
                gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <CardIndicador
                    titulo="Faturamento concluído"
                    valor={moeda(
                    indicadores.faturamentoCentavos
                    )}
                    descricao="Total demonstrativo do período"
                />

                <CardIndicador
                    titulo="Pedidos concluídos"
                    valor={indicadores.pedidosConcluidos}
                    descricao="Retiradas confirmadas"
                />

                <CardIndicador
                    titulo="Unidades vendidas"
                    valor={indicadores.unidadesVendidas}
                    descricao="Unidades em pedidos concluídos"
                />

                <CardIndicador
                    titulo="Ticket médio"
                    valor={moeda(
                    indicadores.ticketMedioCentavos
                    )}
                    descricao="Média por pedido concluído"
                />

                </div>

                {/* Situação dos pedidos */}
                <div className="grid grid-cols-1 gap-4
                sm:grid-cols-3">

                <CardIndicador
                    titulo="Pendentes e em preparação"
                    valor={indicadores.pedidosPendentes}
                />

                <CardIndicador
                    titulo="Prontos para retirada"
                    valor={indicadores.pedidosProntos}
                />

                <CardIndicador
                    titulo="Cancelados"
                    valor={indicadores.pedidosCancelados}
                />

                </div>

                {/* Gráfico */}
                <GraficoVendas
                vendas={dados.vendasPorDia || []}
                periodo={dados.periodo}
                />

                {/* Histórico */}
                <section className="rounded-xl border
                border-gray-200 bg-white p-5
                shadow-sm">

                <div className="mb-5">
                    <h2 className="text-lg font-bold">
                    Últimas vendas concluídas
                    </h2>

                    <p className="text-sm text-gray-500">
                    Até 20 pedidos concluídos dentro
                    do período selecionado.
                    </p>
                </div>

                {!dados.ultimasVendas?.length ? (
                    <p className="py-6 text-gray-500">
                    Nenhuma venda concluída neste período.
                    </p>
                ) : (
                    <div className="overflow-x-auto">

                    <table className="w-full
                        min-w-[620px] text-left text-sm">

                        <thead className="bg-gray-50
                        text-gray-600">
                        <tr>
                            <th className="p-3">Pedido</th>
                            <th className="p-3">Produto</th>
                            <th className="p-3">Data</th>
                            <th className="p-3 text-right">
                            Valor
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {dados.ultimasVendas.map(
                            pedido => (
                            <tr
                                key={pedido._id}
                                className="border-t
                                border-gray-100"
                            >
                                <td className="p-3 font-medium">
                                #{pedido._id.slice(-8)}
                                </td>

                                <td className="p-3">
                                {pedido.itens
                                    ?.map(item => item.nome)
                                    .join(", ") || "-"}
                                </td>

                                <td className="p-3">
                                {dataHora(
                                    pedido.concluidoEm
                                )}
                                </td>

                                <td className="p-3
                                text-right font-semibold">
                                {moeda(
                                    pedido.totalCentavos
                                )}
                                </td>
                            </tr>
                            )
                        )}
                        </tbody>

                    </table>
                    </div>
                )}

                </section>

            </div>
            )}

        </div>
        </div>
    </main>
  );
}
