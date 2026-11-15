
import * as Icons from "react-bootstrap-icons";

const API_ORIGIN = "http://localhost:4000";

export default function Produto_anuncio({ produto }) {

  // Converter centavos em reais
  const precoFormatado = (produto.precoCentavos / 100)
    .toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  // Primeira foto será a capa
  const capa = produto.fotos?.[0]
    ? `${API_ORIGIN}${produto.fotos[0]}`
    : null;

  return (
    <div
      className="border-2 w-238.75 h-25 rounded mt-4
      grid grid-cols-[125px_436px_80px_150px_80px_80px]
      [&_span]:border
      [&_span]:text-center [&_span]:text-[24px]
      [&_span]:flex [&_span]:items-center"
    >

      {/* CAPA */}
      <span className="justify-center overflow-hidden">
        {capa ? (
          <img
            src={capa}
            alt={produto.nome}
            className="w-22 h-22 object-contain"
          />
        ) : (
          <Icons.Image className="text-[40px] " />
        )}
      </span>

      {/* NOME */}
      <span className="justify-start px-3 overflow-hidden">
        <p className="text-[25px] text-left leading-tight line-clamp-3">
          {produto.nome}
        </p>
      </span>

      {/* QUANTIDADE */}
      <span className="justify-center">
        {produto.quantidade ?? 0}
      </span>

      {/* PREÇO */}
      <span className="justify-center">
        {precoFormatado}
      </span>

      {/* EXCLUIR - próxima etapa */}
      <span className="justify-center">
        <Icons.X
          className="text-[70px] "
        />
      </span>

      {/* EDITAR - próxima etapa */}
      <span className="justify-center">
        <Icons.Pencil
          className="text-[37px] "
        />
      </span>

    </div>
  );
}
