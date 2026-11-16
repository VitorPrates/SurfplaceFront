
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const API_URL = "http://localhost:4000/api";
const API_ORIGIN = "http://localhost:4000";

const iconeLoja = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function formatarPreco(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export default function MapaLojas() {
  const elementoMapa = useRef(null);
  const mapaRef = useRef(null);
  const camadaRef = useRef(null);

  const [lojas, setLojas] = useState([]);
  const [lojaSelecionada, setLojaSelecionada] = useState(null);
  const [produtos, setProdutos] = useState([]);

  const [carregandoLojas, setCarregandoLojas] = useState(true);
  const [carregandoProdutos, setCarregandoProdutos] = useState(false);
  const [erro, setErro] = useState("");

  // Guarda a requisição atual de produtos
  const consultaRef = useRef(null);

  useEffect(() => {
    const mapa = L.map(elementoMapa.current).setView(
      [-23.55052, -46.633308],
      11
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19
      }
    ).addTo(mapa);

    camadaRef.current = L.layerGroup().addTo(mapa);
    mapaRef.current = mapa;

    return () => {
      consultaRef.current?.abort();
      mapa.remove();
      mapaRef.current = null;
      camadaRef.current = null;
    };
  }, []);

  // Buscar lojas cadastradas
  useEffect(() => {
    const controller = new AbortController();

    async function carregarLojas() {
      try {
        setCarregandoLojas(true);

        const resposta = await fetch(
          `${API_URL}/lojas/mapa`,
          { signal: controller.signal }
        );

        if (!resposta.ok) {
          throw new Error("Erro ao carregar lojas.");
        }

        const dados = await resposta.json();

        if (!Array.isArray(dados.lojas)) {
          throw new Error("Resposta inválida da API.");
        }

        setLojas(dados.lojas);

      } catch (error) {
        if (error.name !== "AbortError") {
          setErro(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregandoLojas(false);
        }
      }
    }

    carregarLojas();

    return () => controller.abort();
  }, []);

  // Criar marcadores quando as lojas chegarem
  useEffect(() => {
    const mapa = mapaRef.current;
    const camada = camadaRef.current;

    if (!mapa || !camada) return;

    camada.clearLayers();

    const posicoes = [];

    lojas.forEach((loja) => {
      const coordenadas = loja.localizacao?.coordinates;

      if (
        !Array.isArray(coordenadas) ||
        coordenadas.length !== 2
      ) return;

      const [longitude, latitude] = coordenadas;

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) return;

      const posicao = [latitude, longitude];

      const marcador = L.marker(posicao, {
        icon: iconeLoja
      });

      marcador.on("click", () => {
        selecionarLoja(loja);
      });

      marcador.addTo(camada);
      posicoes.push(posicao);
    });

    if (posicoes.length > 0) {
      mapa.fitBounds(posicoes, {
        padding: [40, 40],
        maxZoom: 14
      });
    }
  }, [lojas]);

  async function selecionarLoja(loja) {
    // Cancela consultas anteriores
    consultaRef.current?.abort();

    const controller = new AbortController();
    consultaRef.current = controller;

    setLojaSelecionada(loja);
    setProdutos([]);
    setCarregandoProdutos(true);
    setErro("");

    const coordenadas = loja.localizacao.coordinates;
    const [longitude, latitude] = coordenadas;

    mapaRef.current?.flyTo(
      [latitude, longitude],
      15
    );

    try {
      const resposta = await fetch(
        `${API_URL}/lojas/${loja._id}/produtos`,
        { signal: controller.signal }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "Erro ao buscar produtos."
        );
      }

      if (!Array.isArray(dados.produtos)) {
        throw new Error("Resposta inválida da API.");
      }

      setProdutos(dados.produtos);

    } catch (error) {
      if (error.name !== "AbortError") {
        setErro(error.message);
      }

    } finally {
      if (!controller.signal.aborted) {
        setCarregandoProdutos(false);
      }
    }
  }

  return (
    <div className="w-full relative">
      <div
        ref={elementoMapa}
        className="w-full h-[600px] rounded-lg border z-0"
      />

      {carregandoLojas && (
        <div className="absolute top-4 left-4 z-[500]
          bg-white p-3 rounded shadow">
          Carregando lojas...
        </div>
      )}

      {!carregandoLojas && lojas.length === 0 && !erro && (
        <div className="absolute top-4 left-4 z-[500]
          bg-white p-3 rounded shadow">
          Nenhuma loja com localização cadastrada.
        </div>
      )}

      {lojaSelecionada && (
        <div
          className="absolute top-4 right-4 z-[500]
            bg-white rounded-xl shadow-xl
            w-85 max-w-[calc(100%-32px)]
            max-h-[540px] overflow-y-auto p-4"
        >
          <button
            type="button"
            onClick={() => {
              consultaRef.current?.abort();
              setLojaSelecionada(null);
              setProdutos([]);
              setCarregandoProdutos(false);
              setErro("");
            }}
            className="float-right text-xl font-bold cursor-pointer"
            aria-label="Fechar loja"
          >
            ×
          </button>

          <h2 className="text-xl font-bold pr-8">
            {lojaSelecionada.nome}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {[
              lojaSelecionada.endereco?.cidade,
              lojaSelecionada.endereco?.uf
            ].filter(Boolean).join(" - ")}
          </p>

          {lojaSelecionada.descricao && (
            <p className="text-sm mt-2">
              {lojaSelecionada.descricao}
            </p>
          )}

          <hr className="my-3" />

          <h3 className="font-semibold mb-2">
            Produtos da loja
          </h3>

          {carregandoProdutos ? (
            <p>Carregando produtos...</p>
          ) : erro ? (
            <p role="alert" className="text-red-600">
              {erro}
            </p>
          ) : produtos.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Esta loja ainda não possui produtos.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {produtos.map((produto) => (
                <div
                  key={produto._id}
                  className="flex gap-3 border rounded-lg p-2"
                >
                  {produto.fotos?.[0] ? (
                    <img
                      src={`${API_ORIGIN}${produto.fotos[0]}`}
                      alt={produto.nome}
                      className="w-20 h-20 object-contain"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100
                      flex items-center justify-center
                      text-gray-400 text-xs">
                      Sem foto
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">
                      {produto.nome}
                    </p>

                    <p className="font-bold text-azulforte">
                      {formatarPreco(produto.precoCentavos)}
                    </p>

                    <p className="text-xs text-gray-500">
                      {produto.quantidade > 0
                        ? `${produto.quantidade} disponíveis`
                        : "Indisponível"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!lojaSelecionada && erro && (
        <p role="alert" className="text-red-600 mt-2">
          {erro}
        </p>
      )}
    </div>
  );
}
