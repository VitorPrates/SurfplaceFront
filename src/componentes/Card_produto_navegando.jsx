import { useNavigate } from "react-router-dom";
const API_ORIGIN = "http://localhost:4000";

function formatarPreco(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export default function Card_produto_navegando({
  produto,
  lojaId
}) {
    const imagem = produto.fotos?.[0]
    ? `${API_ORIGIN}${produto.fotos[0]}`
    : null;
    const navigate = useNavigate();

    function abrirProduto() {
        navigate(`/loja/${lojaId}/produto/${produto._id}`);
    }
  return (
    <article
      className="bg-azulultraleve w-full
        min-h-17 rounded-md p-2
        flex items-center gap-2"
        onClick={abrirProduto}
        
    >
        
      {/* FOTO */}
      <div
        className="bg-white rounded-md
          w-16 h-16 shrink-0
          flex items-center justify-center overflow-hidden"
      >
        {imagem ? (
          <img
            src={imagem}
            alt={produto.nome}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-gray-400 text-xs text-center">
            Sem foto
          </span>
        )}
      </div>

      {/* INFORMAÇÕES */}
      <div className="min-w-0 flex-1">
        <h3 className="text-[12px] leading-tight text-black font-medium line-clamp-3">
          {produto.nome}
        </h3>

        <p className="text-[13px] font-bold text-azulforte mt-1">
          {formatarPreco(produto.precoCentavos)}
        </p>

        <p className="text-[11px] text-gray-500">
          {produto.quantidade > 0
            ? `${produto.quantidade} disponíveis`
            : "Indisponível"}
        </p>
      </div>
    </article>
  );
}
