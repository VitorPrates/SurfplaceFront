
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function formatarPreco(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export default function Checkout() {
  const [params] = useSearchParams();

  const produtoId = params.get("produtoId");
  const quantidade = Number(params.get("quantidade"));
  const tentativa = params.get("tentativa");

  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [pagando, setPagando] = useState(false);
  const [erro, setErro] = useState("");

  const tentativaValida =
    typeof tentativa === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      .test(tentativa);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarResumo() {
      setCarregando(true);
      setResumo(null);
      setErro("");

      if (
        !produtoId ||
        !Number.isSafeInteger(quantidade) ||
        quantidade < 1 ||
        !tentativaValida
      ) {
        setErro("Dados da compra inválidos.");
        setCarregando(false);
        return;
      }

      try {
        const query = new URLSearchParams({
          produtoId,
          quantidade: String(quantidade)
        });

        const resposta = await fetch(
          `/api/checkout/resumo?${query}`,
          {
            credentials: "include",
            signal: controller.signal
          }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.mensagem ||
            "Não foi possível carregar o resumo."
          );
        }

        setResumo(dados);
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

    carregarResumo();

    return () => controller.abort();
  }, [produtoId, quantidade, tentativaValida]);

  async function continuarPagamento() {
    if (!resumo || pagando || !tentativaValida) {
      return;
    }

    setPagando(true);
    setErro("");

    try {
      const resposta = await fetch(
        "/api/checkout/criar",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            produtoId,
            quantidade,
            chaveCheckout: tentativa
          })
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
          "Não foi possível iniciar o pagamento."
        );
      }

      if (!dados.urlPagamento) {
        throw new Error(
          "O Mercado Pago não retornou a URL."
        );
      }

      const url = new URL(dados.urlPagamento);

      const dominioValido = [
        "mercadopago.com",
        "mercadopago.com.br"
      ].some(
        dominio =>
          url.hostname === dominio ||
          url.hostname.endsWith(`.${dominio}`)
      );

      if (
        url.protocol !== "https:" ||
        !dominioValido
      ) {
        throw new Error(
          "Endereço de pagamento inválido."
        );
      }

      window.location.assign(url.href);
    } catch (error) {
      setErro(error.message);
      setPagando(false);
    }
  }

  return (
    <main className="h-[calc(100dvh-170px)] bg-gray-50 p-5">
      <div className="mx-auto max-w-4xl">

        <h1 className="text-2xl font-bold mb-6">
          Finalizar compra
        </h1>

        {carregando && (
          <p>Carregando informações da compra...</p>
        )}

        {erro && (
          <p
            role="alert"
            className="text-red-600 mb-4"
          >
            {erro}
          </p>
        )}

        {resumo && !carregando && (
          <div className="grid gap-5 md:grid-cols-2">

            <section className="bg-white rounded-xl
              border p-5">

              <h2 className="text-lg font-bold mb-4">
                Sua compra
              </h2>

              <p className="font-semibold">
                {resumo.produto.nome}
              </p>

              <p className="text-gray-600 mt-2">
                Loja: {resumo.loja.nome}
              </p>

              <p className="mt-2">
                Quantidade: {resumo.quantidade}
              </p>

              <p className="mt-2">
                Preço unitário:{" "}
                {formatarPreco(
                  resumo.produto.precoCentavos
                )}
              </p>

            </section>

            <section className="bg-white rounded-xl
              border p-5">

              <h2 className="text-lg font-bold mb-4">
                Resumo do pedido
              </h2>

              <div className="flex justify-between
                font-bold text-xl">

                <span>Total</span>

                <span>
                  {formatarPreco(
                    resumo.totalCentavos
                  )}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-5">
                Você será redirecionado para o
                Mercado Pago para escolher a forma
                de pagamento.
              </p>

              <button
                type="button"
                onClick={continuarPagamento}
                disabled={pagando}
                className="w-full bg-blue-700
                  text-white rounded-lg py-3 mt-6
                  font-semibold disabled:opacity-50"
              >
                {pagando
                  ? "Preparando pagamento..."
                  : "Continuar para pagamento"}
              </button>

            </section>
          </div>
        )}

      </div>
    </main>
  );
}
