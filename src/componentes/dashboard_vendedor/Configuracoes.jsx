
import { useEffect, useState } from "react";
import Navegando_dashboard from "./Navegando_dashboard";
import MapaLocalizacao from "./MapaLocalizacao";

const API_URL = "/api";

const enderecoInicial = {
  cep: "",
  numero: "",
  logradouro: "",
  bairro: "",
  uf: "",
  cidade: "",
  complemento: ""
};

export default function Configuracoes() {
  const [loja, setLoja] = useState(null);
  const [endereco, setEndereco] = useState(enderecoInicial);
  const [ponto, setPonto] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [localizando, setLocalizando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  async function carregarLoja() {
    try {
      setCarregando(true);

      const resposta = await fetch(
        `${API_URL}/lojas/minha`,
        { credentials: "include" }
      );

      const dados = await resposta.json();

      if (!resposta.ok || !dados.loja) {
        throw new Error("Não foi possível carregar a loja.");
      }

      setLoja(dados.loja);

      setEndereco({
        ...enderecoInicial,
        ...dados.loja.endereco
      });

      const coords = dados.loja.localizacao?.coordinates;

      setPonto(
        Array.isArray(coords) && coords.length === 2
          ? {
              longitude: coords[0],
              latitude: coords[1]
            }
          : null
      );

    } catch (error) {
      setMensagem(error.message);
      setErro(true);

    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarLoja();
  }, []);

  function alterarCampo(event) {
    const { name, value } = event.target;

    setEndereco((anterior) => ({
      ...anterior,
      [name]: value
    }));

    // Qualquer mudança no endereço exige
    // reconfirmar a posição no mapa.
    setPonto(null);
    setMensagem("");
  }

  async function buscarCep() {
    const cep = endereco.cep.replace(/\D/g, "");

    if (cep.length !== 8) {
      setMensagem("O CEP deve conter 8 dígitos.");
      setErro(true);
      return;
    }

    try {
      setMensagem("");
      setErro(false);

      const resposta = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
      );

      if (!resposta.ok) {
        throw new Error("Erro ao consultar CEP.");
      }

      const dados = await resposta.json();

      if (dados.erro) {
        throw new Error("CEP não encontrado.");
      }

      setEndereco((anterior) => ({
        ...anterior,
        cep: dados.cep || anterior.cep,
        logradouro: dados.logradouro || "",
        bairro: dados.bairro || "",
        cidade: dados.localidade || "",
        uf: dados.uf || ""
      }));

      setPonto(null);

    } catch (error) {
      setErro(true);
      setMensagem(error.message);
    }
  }

  async function localizarEndereco() {
    try {
      setLocalizando(true);
      setMensagem("");
      setErro(false);

      const resposta = await fetch(
        `${API_URL}/lojas/minha/geocodificar`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(endereco)
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "Endereço não encontrado."
        );
      }

      setPonto(dados.localizacao);

      setMensagem(
        "Localização sugerida. Confira e ajuste o marcador antes de salvar."
      );
      setErro(false);

    } catch (error) {
      setMensagem(error.message);
      setErro(true);

    } finally {
      setLocalizando(false);
    }
  }

  async function salvarEndereco(event) {
    event.preventDefault();

    if (!ponto) {
      setMensagem(
        "Localize e confirme o ponto da loja no mapa."
      );
      setErro(true);
      return;
    }

    try {
      setSalvando(true);
      setMensagem("");
      setErro(false);

      const resposta = await fetch(
        `${API_URL}/lojas/minha/endereco`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...endereco,
            latitude: ponto.latitude,
            longitude: ponto.longitude
          })
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "Erro ao salvar endereço."
        );
      }

      setLoja(dados.loja);
      setMensagem("Endereço salvo com sucesso!");
      setErro(false);

    } catch (error) {
      setMensagem(error.message);
      setErro(true);

    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main className="p-8">
        Carregando configurações da loja...
      </main>
    );
  }

  if (!loja) {
    return (
      <main className="p-8">
        {mensagem || "Loja não encontrada."}
      </main>
    );
  }

  const campos = [
    ["cep", "CEP", "00000-000"],
    ["numero", "Número", "00"],
    ["logradouro", "Logradouro", "Rua ou avenida"],
    ["bairro", "Bairro", "Bairro"],
    ["uf", "UF", "SP"],
    ["cidade", "Cidade", "Cidade"],
    ["complemento", "Complemento", "Opcional"]
  ];

  function campoInput(nome) {
    const configuracao = campos.find(
      ([chave]) => chave === nome
    );

    const [, titulo, placeholder] = configuracao;

    return (
      <div className="flex flex-col">
        <label
          htmlFor={nome}
          className="text-[18px]"
        >
          {titulo}
        </label>

        <input
          id={nome}
          name={nome}
          type="text"
          value={endereco[nome]}
          placeholder={placeholder}
          maxLength={
            nome === "complemento" ? 60 : 200
          }
          onChange={alterarCampo}
          onBlur={nome === "cep" ? buscarCep : undefined}
          className="w-full h-9 border rounded-full px-3"
        />
      </div>
    );
  }
  function conectarMercadoPago() {
  window.location.assign(
    "/api/mercadopago/conectar"
  );
}

  return (
    <main className="h-[calc(100dvh-170px)] bg-azulultraleve flex">
      <Navegando_dashboard />
        <div className="w-full h-[calc(100dvh-170px)] overflow-y-scroll">
            <div className="flex-1 p-5 overflow-y-scroll">
                <form
                onSubmit={salvarEndereco}
                className="max-w-250 mx-auto bg-white
                    border-2 rounded p-5"
                >
                <h2 className="text-2xl font-bold mb-4">
                    Configurações da loja
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* DADOS DA LOJA */}
                    <section className="flex flex-col gap-4">
                    <div>
                        <label>CNPJ</label>
                        <input
                        value={loja.cnpj}
                        readOnly
                        className="w-full border rounded-full
                            px-3 h-9 bg-gray-200"
                        />
                    </div>

                    <div>
                        <label>Nome da loja</label>
                        <input
                        value={loja.nome}
                        readOnly
                        className="w-full border rounded-full
                            px-3 h-9 bg-gray-200"
                        />
                    </div>

                    <div>
                        <label>Descrição da loja</label>
                        <textarea
                        value={loja.descricao || ""}
                        readOnly
                        className="w-full h-45 border rounded-lg
                            bg-gray-200 p-3 resize-none"
                        />
                    </div>

                    <p className="text-xs text-gray-500">
                        Nome, descrição e imagem serão
                        editáveis em uma próxima etapa.
                    </p>
                    </section>

                    {/* ENDEREÇO */}
                    <section className="flex flex-col gap-3">
                    <h3 className="text-xl font-semibold">
                        Endereço da loja
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        {campoInput("cep")}
                        {campoInput("numero")}
                    </div>

                    {campoInput("logradouro")}

                    {campoInput("bairro")}

                    <div className="grid grid-cols-[80px_1fr] gap-3">
                        {campoInput("uf")}
                        {campoInput("cidade")}
                    </div>

                    {campoInput("complemento")}

                    <button
                        type="button"
                        onClick={localizarEndereco}
                        disabled={localizando}
                        className="bg-azulleve text-white
                        rounded-lg py-2 cursor-pointer
                        disabled:opacity-50"
                    >
                        {localizando
                        ? "Localizando..."
                        : "Localizar endereço no mapa"}
                    </button>
                    </section>
                </div>

                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">
                    Confirme a localização da loja
                    </h3>

                    <MapaLocalizacao
                    ponto={ponto}
                    onChange={setPonto}
                    />
                </div>

                {mensagem && (
                    <p
                    role="status"
                    className={`mt-4 text-center ${
                        erro ? "text-red-600" : "text-green-600"
                    }`}
                    >
                    {mensagem}
                    </p>
                )}

                <div className="flex gap-5 mt-6">
                    <button
                    type="submit"
                    disabled={salvando}
                    className="flex-1 bg-azulforte
                        text-white rounded-full py-2
                        cursor-pointer disabled:opacity-50"
                    >
                    {salvando
                        ? "Salvando..."
                        : "Salvar alterações"}
                    </button>

                    <button
                    type="button"
                    onClick={carregarLoja}
                    disabled={salvando}
                    className="flex-1 bg-azulultraleve
                        rounded-full py-2 cursor-pointer"
                    >
                    Cancelar
                    </button>
                </div>
                    
                </form>
                <section className="bg-white border rounded-lg p-4 mt-5">
                        <h3 className="text-xl font-bold">
                            Pagamentos da loja
                        </h3>

                        <p className="text-sm text-gray-600 my-3">
                            Conecte sua conta Mercado Pago para receber
                            os pagamentos das vendas realizadas no Surfplace.
                        </p>

                        <button
                            type="button"
                            onClick={conectarMercadoPago}
                            className="bg-azulforte text-white font-bold
                            rounded-full px-6 py-2 cursor-pointer"
                        >
                            Conectar Mercado Pago
                        </button>
                    </section>
            </div>
        </div>
      
    </main>
  );
}
