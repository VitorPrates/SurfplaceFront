
import { useEffect, useRef, useState } from "react";
import * as Icons from "react-bootstrap-icons";

const API_ORIGIN = "http://localhost:4000";

export default function FotosProduto({
  fotos,
  setFotos,
  setMensagem,
  setErro
}) {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const urlsTemporarias = [];

    const imagens = fotos.map((foto) => {
      // Foto nova, selecionada no navegador
      if (foto instanceof File) {
        const url = URL.createObjectURL(foto);
        urlsTemporarias.push(url);
        return url;
      }

      // Foto existente no servidor
      return `${API_ORIGIN}${foto.caminho}`;
    });

    setPreviews(imagens);

    return () => {
      urlsTemporarias.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [fotos]);

  useEffect(() => {
    setIndiceAtual((indice) =>
      Math.max(0, Math.min(indice, fotos.length - 1))
    );
  }, [fotos.length]);

  function adicionarFotos(event) {
    const arquivos = Array.from(event.target.files || []);

    event.target.value = "";

    if (arquivos.length === 0) return;

    if (fotos.length + arquivos.length > 5) {
      setMensagem("O produto pode ter no máximo 5 fotos.");
      setErro(true);
      return;
    }

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    const invalidos = arquivos.some(
      (foto) =>
        !tiposPermitidos.includes(foto.type) ||
        foto.size > 5 * 1024 * 1024
    );

    if (invalidos) {
      setMensagem(
        "Utilize JPG, PNG ou WebP com até 5 MB por imagem."
      );
      setErro(true);
      return;
    }

    setFotos((anteriores) => [
      ...anteriores,
      ...arquivos
    ]);

    setMensagem("");
    setErro(false);
  }

  function removerFoto(indice) {
    setFotos((anteriores) =>
      anteriores.filter((_, i) => i !== indice)
    );

    setIndiceAtual((atual) => {
      if (indice < atual) return atual - 1;
      if (indice === atual) return Math.max(0, atual - 1);
      return atual;
    });
  }

  function fotoAnterior() {
    setIndiceAtual((atual) =>
      (atual - 1 + fotos.length) % fotos.length
    );
  }

  function proximaFoto() {
    setIndiceAtual((atual) =>
      (atual + 1) % fotos.length
    );
  }

  return (
    <div className="w-112.5 flex flex-col gap-2">
      <label className="text-[24px] font-bold">
        Fotos do produto
      </label>

      <div className="relative w-full h-78 border rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">

        {previews[indiceAtual] ? (
          <>
            <img
              src={previews[indiceAtual]}
              alt={`Foto ${indiceAtual + 1}`}
              className="w-full h-full object-contain"
            />

            <button
              type="button"
              onClick={() => removerFoto(indiceAtual)}
              aria-label="Remover foto selecionada"
              className="absolute top-2 right-2 bg-white
                text-red-600 rounded-full p-2 shadow
                cursor-pointer hover:bg-red-50"
            >
              <Icons.Trash size={20} />
            </button>

            {fotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={fotoAnterior}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2
                    -translate-y-1/2 bg-white/90
                    rounded-full p-2 shadow cursor-pointer"
                >
                  <Icons.ChevronLeft />
                </button>

                <button
                  type="button"
                  onClick={proximaFoto}
                  aria-label="Próxima foto"
                  className="absolute right-2 top-1/2
                    -translate-y-1/2 bg-white/90
                    rounded-full p-2 shadow cursor-pointer"
                >
                  <Icons.ChevronRight />
                </button>
              </>
            )}

            <span className="absolute bottom-2 left-2
              bg-black/60 text-white px-3 py-1
              rounded-full text-sm">
              {indiceAtual + 1} / {fotos.length}
            </span>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center
              gap-3 w-full h-full cursor-pointer text-gray-500"
          >
            <Icons.Images size={48} />
            <p className="text-base font-semibold">
              Adicionar fotos
            </p>
            <p className="text-sm">
              JPG, PNG ou WebP - Máximo 5 fotos
            </p>
          </button>
        )}
      </div>

      <div className="flex gap-2 w-full">
        {previews.map((url, indice) => (
          <button
            type="button"
            key={`${indice}-${url}`}
            onClick={() => setIndiceAtual(indice)}
            aria-label={`Visualizar foto ${indice + 1}`}
            className={`relative w-18 h-18 border-2
              rounded-lg overflow-hidden cursor-pointer ${
              indice === indiceAtual
                ? "border-azulforte"
                : "border-gray-300"
            }`}
          >
            <img
              src={url}
              alt={`Miniatura ${indice + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}

        {fotos.length < 5 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Adicionar mais fotos"
            className="w-18 h-18 border-2 border-dashed
              rounded-lg flex items-center justify-center
              cursor-pointer hover:bg-gray-100"
          >
            <Icons.Plus size={30} />
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500">
        {fotos.length}/5 imagens selecionadas
      </p>

      <input
        ref={inputRef}
        type="file"
        name="fotos"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={adicionarFotos}
        className="hidden"
        aria-label="Selecionar fotos do produto"
      />
    </div>
  );
}
