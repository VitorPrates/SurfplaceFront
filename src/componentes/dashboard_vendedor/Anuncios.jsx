
import { useRef, useState } from "react";
import Navegando_dashboard from "./Navegando_dashboard";

const API_URL = "http://localhost:4000/surfplace2";

export default function Anuncios() {
  const [btn_anuncio, setbtn] = useState("Anuncios");

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tags, setTags] = useState("");
  const [fotos, setFotos] = useState([]);

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  const inputFotosRef = useRef(null);

  // Formata o preço como 00,00
  function formatarPreco(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 15);

    if (!numeros) return "";

    const centavos = numeros.slice(-2).padStart(2, "0");
    const reais = numeros.slice(0, -2) || "0";

    return `${Number(reais)},${centavos}`;
  }

  function selecionarFotos(event) {
    const arquivos = Array.from(event.target.files || []);

    if (arquivos.length > 5) {
      setMensagem("Selecione no máximo 5 imagens.");
      setErro(true);
      event.target.value = "";
      setFotos([]);
      return;
    }

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    const arquivosInvalidos = arquivos.some(
      (arquivo) =>
        !tiposPermitidos.includes(arquivo.type) ||
        arquivo.size > 5 * 1024 * 1024
    );

    if (arquivosInvalidos) {
      setMensagem(
        "Use imagens JPG, PNG ou WebP de até 5 MB cada."
      );
      setErro(true);
      event.target.value = "";
      setFotos([]);
      return;
    }

    setFotos(arquivos);
    setMensagem("");
    setErro(false);
  }

  function reiniciarFormulario() {
    setNome("");
    setPreco("");
    setDescricao("");
    setTags("");
    setFotos([]);
    setMensagem("");
    setErro(false);

    if (inputFotosRef.current) {
      inputFotosRef.current.value = "";
    }
  }

  async function adicionarProduto(event) {
    event.preventDefault();

    if (carregando) return;

    setMensagem("");
    setErro(false);

    if (!nome.trim() || nome.trim().length > 60) {
      setMensagem("O nome deve ter entre 1 e 60 caracteres.");
      setErro(true);
      return;
    }

    if (!/^\d+,\d{2}$/.test(preco)) {
      setMensagem("Informe um preço válido, como 59,90.");
      setErro(true);
      return;
    }

    if (!descricao.trim()) {
      setMensagem("A descrição é obrigatória.");
      setErro(true);
      return;
    }

    const formData = new FormData();

    formData.append("nome", nome.trim());
    formData.append("preco", preco);
    formData.append("descricao", descricao.trim());
    formData.append("tags", tags);

    fotos.forEach((foto) => {
      formData.append("fotos", foto);
    });

    try {
      setCarregando(true);

      const resposta = await fetch(API_URL, {
        method: "POST",
        body: formData
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.mensagem || "Erro ao cadastrar produto."
        );
      }

      setMensagem("Produto cadastrado com sucesso!");
      setErro(false);

      reiniciarFormulario();
      setMensagem("Produto cadastrado com sucesso!");

    } catch (error) {
      setMensagem(error.message);
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="h-[calc(100dvh-170px)] bg-azulultraleve flex">
      <Navegando_dashboard />

      <div className="bg-azulultraleve w-full flex items-center justify-center">
        <div className="bg-white w-250 h-187.5 rounded border-2 flex flex-col">

          <nav className="w-full border-b-2 h-12.5">
            <button
              type="button"
              className={`${btn_anuncio === "Anuncios"
                ? "bg-azulforte text-amarelodestaque"
                : "bg-white text-black"
              } font-bold text-[24px] w-50 h-full border-r-2 border-black cursor-pointer`}
              onClick={() => setbtn("Anuncios")}
            >
              Anuncios
            </button>

            <button
              type="button"
              className={`${btn_anuncio === "Anunciar"
                ? "bg-azulforte text-amarelodestaque"
                : "bg-white text-black"
              } font-bold text-[24px] w-50 h-full border-r-2 border-black cursor-pointer`}
              onClick={() => setbtn("Anunciar")}
            >
              Anunciar
            </button>
          </nav>

          {btn_anuncio === "Anuncios" ? (
            <div></div>
          ) : (
            <form
              onSubmit={adicionarProduto}
              className="[&_label]:text-[24px] [&_label]:font-bold border-1 m-auto w-237.5 h-155 rounded-2xl p-3.75"
            >
              <div className="flex gap-3">
                <span className="flex flex-col">
                  <label htmlFor="NomeProduto">
                    Nome do Produto
                  </label>

                  <input
                    id="NomeProduto"
                    type="text"
                    name="nome"
                    maxLength={60}
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-170 h-10 border rounded-full pl-3 pr-3"
                  />

                  <small className="text-gray-500">
                    {nome.length}/60 caracteres
                  </small>
                </span>

                <span className="flex flex-col">
                  <label htmlFor="precoProduto">
                    Preço (R$)
                  </label>

                  <input
                    id="precoProduto"
                    type="text"
                    name="preco"
                    inputMode="numeric"
                    placeholder="0,00"
                    required
                    value={preco}
                    onChange={(e) =>
                      setPreco(formatarPreco(e.target.value))
                    }
                    className="w-56.25 h-10 border rounded-full pl-3 pr-3"
                  />
                </span>
              </div>

              <div className="flex">
                <div className="w-fit flex flex-col">
                  <label htmlFor="fotoproduto">
                    Fotos do produto
                  </label>

                  <input
                    id="fotoproduto"
                    ref={inputFotosRef}
                    type="file"
                    name="fotos"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={selecionarFotos}
                    className="w-112.5 h-112.5 border rounded-2xl"
                  />

                  <small className="text-gray-500">
                    {fotos.length}/5 imagens selecionadas
                  </small>
                </div>

                <div className="flex flex-col w-full h-fit">
                  <label
                    htmlFor="descricaoProduto"
                    className="text-left w-112.5 mr-0 ml-auto"
                  >
                    Descrição do Produto
                  </label>

                  <textarea
                    id="descricaoProduto"
                    name="descricao"
                    required
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-112.5 h-82.5 border rounded-2xl mr-0 ml-auto p-2"
                  />

                  <label
                    htmlFor="Tags"
                    className="text-left w-112.5 mr-0 ml-auto"
                  >
                    Tags do produto
                  </label>

                  <input
                    id="Tags"
                    type="text"
                    name="tags"
                    placeholder="tag1,tag2,tag3"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-112.5 h-11.25 rounded border ml-auto pl-3 pr-3"
                  />

                  <div className="w-full h-full flex items-center justify-evenly p-3">
                    <button
                      type="button"
                      onClick={reiniciarFormulario}
                      disabled={carregando}
                      className="bg-azulleve text-white font-bold text-[22px] w-50 h-7.5 rounded border border-black flex justify-center items-center cursor-pointer disabled:opacity-50"
                    >
                      Reiniciar
                    </button>

                    <button
                      type="submit"
                      disabled={carregando}
                      className="bg-azulforte text-white font-bold text-[22px] w-50 h-7.5 rounded border border-black flex justify-center items-center cursor-pointer disabled:opacity-50"
                    >
                      {carregando ? "Salvando..." : "Adicionar"}
                    </button>
                  </div>

                  {mensagem && (
                    <p
                      role="status"
                      className={`text-center text-sm font-medium ${
                        erro ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {mensagem}
                    </p>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
