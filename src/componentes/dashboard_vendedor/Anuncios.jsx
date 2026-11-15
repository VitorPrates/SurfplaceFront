import { useEffect, useRef, useState } from "react";
import Navegando_dashboard from "./Navegando_dashboard";
import FotosProduto from "./FotosProduto";

import Produto_anuncio from "./Produto_anuncio"

const API_URL = "http://localhost:4000/api/produtos";

export default function Anuncios() {
  const [btn_anuncio, setbtn] = useState("Anuncios");

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tags, setTags] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [fotos, setFotos] = useState([]);

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);
  

  const [produtos, setProdutos] = useState([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [erroProdutos, setErroProdutos] = useState("");
  const [excluindoId, setExcluindoId] = useState(null);
  const [produtoEditando, setProdutoEditando] = useState(null);

  const inputFotosRef = useRef(null);


useEffect(() => {
  const controller = new AbortController();

  async function buscarProdutos() {
    try {
        setCarregandoProdutos(true);
        setErroProdutos("");

        const resposta = await fetch(API_URL, {
          signal: controller.signal
        });

        if (!resposta.ok) {
          throw new Error("Erro ao buscar produtos.");
        }

        const resultado = await resposta.json();

        if (!Array.isArray(resultado.produtos)) {
          throw new Error("Resposta inválida do servidor.");
        }
        console.log(resultado.produtos)
        setProdutos(resultado.produtos);

      } catch (erro) {
        if (erro.name === "AbortError") return;

        console.error(erro);
        setErroProdutos(erro.message);

      } finally {
        if (!controller.signal.aborted) {
          setCarregandoProdutos(false);
        }
      }
    }

    buscarProdutos();

    return () => controller.abort();
  }, []);



  function editarProduto(produto) {
    setProdutoEditando(produto);

    setNome(produto.nome);
    setPreco(
      (produto.precoCentavos / 100).toFixed(2).replace(".", ",")
    );
    setDescricao(produto.descricao);
    setTags((produto.tags || []).join(","));
    setQuantidade(String(produto.quantidade ?? 0));

    // As imagens existentes são representadas
    // pelos caminhos salvos no MongoDB.
    setFotos(
      (produto.fotos || []).map((caminho) => ({
        caminho
      }))
    );

    setMensagem("");
    setErro(false);

    setbtn("Editando");
  }

  function cancelarEdicao() {
    setProdutoEditando(null);
    reiniciarFormulario();
    setbtn("Anuncios");
  }
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
    setQuantidade("")
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
    if (
      !/^\d+$/.test(quantidade.trim()) ||
      !Number.isSafeInteger(Number(quantidade))
    ) {
      setMensagem("Informe uma quantidade inteira maior ou igual a zero.");
      setErro(true);
      return;
    }
    const formData = new FormData();

    formData.append("nome", nome.trim());
    formData.append("preco", preco);
    formData.append("descricao", descricao.trim());
    formData.append("tags", tags);
    formData.append("quantidade", quantidade);

    const fotosMantidas = fotos
      .filter((foto) => !(foto instanceof File))
      .map((foto) => foto.caminho);

    const fotosNovas = fotos.filter(
      (foto) => foto instanceof File
    );

    // Durante a edição, informa ao backend
    // quais fotos antigas continuarão no produto.
    if (produtoEditando) {
      formData.append(
        "fotosMantidas",
        JSON.stringify(fotosMantidas)
      );
    }

    // Somente fotos novas precisam de upload.
    fotosNovas.forEach((foto) => {
      formData.append("fotos", foto);
    });


    try {
      setCarregando(true);

      const url = produtoEditando
        ? `${API_URL}/${produtoEditando._id}`
        : API_URL;

      const resposta = await fetch(url, {
        method: produtoEditando ? "PUT" : "POST",
        body: formData
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.mensagem || "Erro ao cadastrar produto."
        );
      }
      
      if (produtoEditando) {

        // Atualiza somente o produto editado
        setProdutos((produtosAtuais) =>
          produtosAtuais.map((produto) =>
            produto._id === resultado.produto._id
              ? resultado.produto
              : produto
          )
        );

        setProdutoEditando(null);
        reiniciarFormulario();
        setbtn("Anuncios");

      } else {

        // Adiciona o novo produto à listagem
        setProdutos((produtosAtuais) => [
          resultado.produto,
          ...produtosAtuais.filter(
            (produto) => produto._id !== resultado.produto._id
          )
        ]);

        reiniciarFormulario();
      }

      setMensagem(
        produtoEditando
          ? "Produto atualizado com sucesso!"
          : "Produto cadastrado com sucesso!"
      );
      setErro(false);


    } catch (error) {
      setMensagem(error.message);
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }


  async function excluirProduto(id) {
    // Impede exclusões simultâneas
    if (excluindoId !== null) return;

    const confirmado = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmado) return;

    try {
      setExcluindoId(id);
      setMensagem("");
      setErro(false);

      const resposta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.mensagem || "Erro ao excluir produto."
        );
      }

      // Atualiza a lista sem recarregar a página
      setProdutos((produtosAtuais) =>
        produtosAtuais.filter(
          (produto) => produto._id !== id
        )
      );

      setMensagem("Produto excluído com sucesso!");
      setErro(false);

    } catch (error) {
      setMensagem(error.message);
      setErro(true);

      console.error("Erro ao excluir produto:", error);

    } finally {
      setExcluindoId(null);
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
              onClick={() => {
                setProdutoEditando(null);
                reiniciarFormulario();
                setbtn("Anuncios");
              }}
            >
              Anuncios
            </button>

            <button
              type="button"
              className={`${btn_anuncio === "Anunciar"
                ? "bg-azulforte text-amarelodestaque"
                : "bg-white text-black"
              } font-bold text-[24px] w-50 h-full border-r-2 border-black cursor-pointer`}
              onClick={() => {
                setProdutoEditando(null);
                reiniciarFormulario();
                setbtn("Anunciar");
              }}
            >
              Anunciar
            </button>
            {produtoEditando && (
              <button
                type="button"
                onClick={() => setbtn("Editando")}
                className={`${
                  btn_anuncio === "Editando"
                    ? "bg-azulforte text-amarelodestaque"
                    : "bg-white text-black"
                } font-bold text-[24px] w-50 h-full
                  border-r-2 border-black cursor-pointer`}
              >
                Editando
              </button>
            )}

          </nav>

          {btn_anuncio === "Anuncios" ? (
            <div className="w-[97%] h-[90%] m-auto">
              <div className="
                grid grid-cols-[125px_436px_80px_150px_160px] items-center
                [&_span]:border-2 [&_span]:font-bold [&_span]:text-center [&_span]:rounded [&_span]:text-[24px] [&_span]:h-8.25 [&_span]:flex [&_span]:items-center [&_span]:justify-center
                ">
                  {/* 85px_370px_70px_130px_140px */}
                <span className="w-21.25 m-auto">Capa</span>
                <span className="w-92.5 m-auto">Nome</span>
                <span className="w-17.5 m-auto">QTD</span>
                <span className="w-32.5 m-auto">Preço(R$)</span>
                <span className="w-35 m-auto">Ações</span>
              </div>
              {mensagem && (
                <p
                  role="status"
                  className={`text-center p-2 font-semibold ${
                    erro ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {mensagem}
                </p>
              )}
              <div className="mt-3 h-[calc(100%-65px)] overflow-y-auto">
                {carregandoProdutos ? (
                  <p className="text-center mt-5">
                    Carregando produtos...
                  </p>
                ) : erroProdutos ? (
                  <p className="text-center mt-5 text-red-600">
                    {erroProdutos}
                  </p>
                ) : produtos.length === 0 ? (
                  <p className="text-center mt-5">
                    Nenhum produto cadastrado.
                  </p>
                ) : (
                  produtos.map((produto) => (
                    <Produto_anuncio
                      key={produto._id}
                      produto={produto}
                      onExcluir={excluirProduto}
                      excluindo={excluindoId === produto._id}
                      onEditar={editarProduto}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <form
              onSubmit={adicionarProduto}
              className="[&_label]:text-[24px] [&_label]:font-bold border m-auto w-237.5 h-155 rounded-2xl p-3.75 relative"
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
                  <FotosProduto
                    fotos={fotos}
                    setFotos={setFotos}
                    setMensagem={setMensagem}
                    setErro={setErro}
                  />
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

                  <div className="flex justify-center max-w-112.5 mr-0 ml-auto">
                   <div>
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
                    className="w-70.5 h-11.25 rounded border ml-auto pl-3 pr-3"
                  />
                   </div>
                   <div className="flex flex-col ">
                          <label
                          htmlFor="Quantidade"
                          className="text-left w-37.5 mr-0 ml-2"
                          >
                        Quantidade
                      </label>
                    <input
                      id="Quantidade"
                      type="number"
                      name="quantidade"
                      placeholder="0"
                      min="0"
                      step="1"
                      required
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      className="w-37.5 h-11.25 rounded border ml-2 mr-0 pl-3 pr-3"
                    />
                   </div>
                  </div>

                  <div className="w-full h-full flex items-center justify-evenly p-3">
                    <button
                      type="button"
                      onClick={
                        produtoEditando
                          ? cancelarEdicao
                          : reiniciarFormulario
                      }
                      disabled={carregando}
                      className="bg-azulleve text-white font-bold
                        text-[22px] w-50 h-7.5 rounded border
                        border-black flex justify-center items-center
                        cursor-pointer disabled:opacity-50"
                    >
                      {produtoEditando ? "Cancelar" : "Reiniciar"}
                    </button>
                    <button
                      type="submit"
                      disabled={carregando}
                      className="bg-azulforte text-white font-bold
                        text-[22px] w-50 h-7.5 rounded border
                        border-black flex justify-center items-center
                        cursor-pointer disabled:opacity-50"
                    >
                      {carregando
                        ? "Salvando..."
                        : produtoEditando
                          ? "Salvar edição"
                          : "Adicionar"}
                    </button>
                  </div>
                    
                  {mensagem && (
                    <div role="status" className={`absolute left-[calc(50%-230px)] w-115 h-25 flex items-center justify-center rounded-2xl border bg-white drop-shadow-2xl ${
                        erro ? "text-red-600" : "text-green-600"
                      }`}>
                      {mensagem}
                    </div>
                    
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
