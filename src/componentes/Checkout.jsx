export default function Checkout()
{
    const API_URL = "http://localhost:4000/api";

    async function iniciarPagamento({
    lojaId,
    produtoId,
    quantidade
    }) {
    const resposta = await fetch(
        `${API_URL}/checkout/criar-preferencia`,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            lojaId,
            produtoId,
            quantidade
        })
        }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
        dados.mensagem || "Erro ao iniciar pagamento."
        );
    }

    const url = new URL(dados.urlPagamento);

    // Não redirecionar para uma URL arbitrária
    if (
        url.protocol !== "https:" ||
        ![
        "mercadopago.com.br",
        "mercadopago.com"
        ].some(
        (dominio) =>
            url.hostname === dominio ||
            url.hostname.endsWith(`.${dominio}`)
        )
    ) {
        throw new Error("URL de pagamento inválida.");
    }

    window.location.assign(url.href);
    }

}