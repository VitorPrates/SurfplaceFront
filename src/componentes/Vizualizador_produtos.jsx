
import * as Icons from "react-bootstrap-icons";
import Card_produto_navegando from "./Card_produto_navegando";

export default function Vizualizador_produtos({
  vendo,
  loja,
  produtos = [],
  carregando,
  erro,
  fechar
}) {
  return (
    <div
      className="absolute z-[1000] right-0 top-0
        w-87.5 max-w-[90vw] h-full
        pointer-events-none overflow-hidden"
    >
      <div
        className={`absolute top-0 w-full h-full
          bg-azulforte flex flex-col
          transition-all duration-300
          pointer-events-auto
          ${vendo
            ? "left-0"
            : "left-full"
          }`}
      >
        {/* CABEÇALHO DA LOJA */}
        <div className="p-3 shrink-0">

          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar visualizador"
            className="bg-azulleve text-azulforte
              w-11 h-11 rounded-md
              flex items-center justify-center
              cursor-pointer hover:brightness-110"
          >
            <Icons.X size={38} />
          </button>

          <div className="mt-3 mx-5 border-y border-azulleve py-2">
            <h2
              className="text-white text-[26px]
                text-center font-light uppercase
                leading-tight wrap-break-word"
            >
              {loja?.nome || "Loja"}
            </h2>
          </div>

          {loja?.endereco && (
            <p className="text-center text-white/70 text-xs mt-2">
              {[
                loja.endereco.cidade,
                loja.endereco.uf
              ].filter(Boolean).join(" - ")}
            </p>
          )}
        </div>

        {/* LISTA DE PRODUTOS */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-5">

          {carregando ? (
            <p className="text-white text-center mt-5">
              Carregando produtos...
            </p>

          ) : erro ? (
            <p
              role="alert"
              className="text-red-300 text-center mt-5"
            >
              {erro}
            </p>

          ) : produtos.length === 0 ? (
            <p className="text-white/80 text-center mt-5">
              Esta loja ainda não possui produtos cadastrados.
            </p>

          ) : (
            <div className="flex flex-col gap-3">
              {produtos.map((produto) => (
                <Card_produto_navegando
                  key={produto._id}
                  produto={produto}
                  lojaId={loja._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
