
import {
  useLocation,
  useNavigate
} from "react-router-dom";

function formatarPreco(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export default function ConfirmacaoCompra() {
  const location = useLocation();
  const navigate = useNavigate();

  const pedido = location.state;

  if (
    !pedido?.simulado ||
    !pedido?.pedidoId
  ) {
    return (
      <main className="min-h-[70vh] p-6
        flex items-center justify-center">

        <div className="text-center">
          <h1 className="text-xl font-bold">
            Confirmação indisponível
          </h1>

          <p className="text-gray-600 mt-3">
            Não encontramos os dados desta compra
            na navegação atual.
          </p>

          <button
            onClick={() => navigate("/home")}
            className="mt-5 bg-blue-700
              text-white px-6 py-3 rounded-lg"
          >
            Voltar ao Surfplace
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-[calc(100dvh-170px)] bg-gray-50
      flex items-center justify-center p-5">

      <section className="bg-white border rounded-2xl
        shadow-sm p-8 w-full max-w-lg text-center">

        <div className="mx-auto w-16 h-16
          rounded-full bg-green-100
          flex items-center justify-center mb-5">

          <span className="text-green-700 text-3xl">
            ✓
          </span>
        </div>

        <h1 className="text-2xl font-bold">
          Compra simulada realizada!
        </h1>

        <p className="text-gray-600 mt-3">
          Seu pedido foi registrado no Surfplace.
          Nenhum pagamento real foi efetuado.
        </p>

        <div className="bg-gray-50 rounded-xl
          p-5 mt-6 text-left space-y-4">

          <div>
            <p className="text-sm text-gray-500">
              Número do pedido
            </p>

            <p className="font-semibold break-all">
              {pedido.pedidoId}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Valor demonstrativo
            </p>

            <p className="font-semibold">
              {formatarPreco(
                pedido.totalCentavos
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Pagamento
            </p>

            <p className="font-semibold text-green-700">
              Aprovado (simulação)
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Situação do pedido
            </p>

            <p className="font-semibold">
              Aguardando preparação pela loja
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/home")}
          className="mt-7 w-full bg-blue-700
            text-white font-semibold
            rounded-lg py-3"
        >
          Voltar ao Surfplace
        </button>

      </section>
    </main>
  );
}
