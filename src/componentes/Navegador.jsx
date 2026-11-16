
import { useState, useEffect, useRef } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import Vizualizador_produtos from "./Vizualizador_produtos";

const API_URL = "http://localhost:4000/api";

const POSICAO_INICIAL = [-23.561684, -46.655981];

const iconeLoja = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Movimenta o mapa quando uma cidade é pesquisada
function ChangeView({ centro, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (!centro) return;

    map.flyTo(
      [centro.lat, centro.lng],
      zoom,
      { duration: 1.5 }
    );
  }, [centro, zoom, map]);

  return null;
}

// Renderiza marcadores presentes na área visível
function MarcadoresVisiveis({ lojas, onSelecionar }) {
  const map = useMap();

  const [bounds, setBounds] = useState(() =>
    map.getBounds()
  );

  useMapEvents({
    moveend: (evento) => {
      setBounds(evento.target.getBounds());
    },

    zoomend: (evento) => {
      setBounds(evento.target.getBounds());
    }
  });

  useEffect(() => {
    setBounds(map.getBounds());
  }, [map]);

  const lojasVisiveis = lojas.filter((loja) => {
    const coordenadas = loja.localizacao?.coordinates;

    if (
      !Array.isArray(coordenadas) ||
      coordenadas.length !== 2
    ) {
      return false;
    }

    const [lng, lat] = coordenadas;

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return false;
    }

    return bounds.contains([lat, lng]);
  });

  return (
    <>
      {lojasVisiveis.map((loja) => {
        const [lng, lat] = loja.localizacao.coordinates;

        return (
          <Marker
            key={loja._id}
            position={[lat, lng]}
            icon={iconeLoja}
            eventHandlers={{
              click: () => onSelecionar(loja)
            }}
          >
            <Popup>
              <div>
                <strong>{loja.nome}</strong>

                <p>
                  {[
                    loja.endereco?.cidade,
                    loja.endereco?.uf
                  ].filter(Boolean).join(" - ")}
                </p>

                <p>
                  Clique no marcador para visualizar
                  os produtos da loja.
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default function Navegador() {

  // Pesquisa de cidades
  const [texto, setTexto] = useState("");
  const [coordenadas, setCoordenadas] = useState(null);
  const [erroCoordenada, setErroCoordenada] = useState("");
  const [buscandoCidade, setBuscandoCidade] = useState(false);

  // Lojas cadastradas
  const [lojas, setLojas] = useState([]);
  const [carregandoLojas, setCarregandoLojas] = useState(true);
  const [erroLojas, setErroLojas] = useState("");

  // Loja selecionada
  const [lojaSelecionada, setLojaSelecionada] = useState(null);

  // Produtos da loja
  const [produtos, setProdutos] = useState([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(false);
  const [erroProdutos, setErroProdutos] = useState("");

  const consultaProdutosRef = useRef(null);
  const consultaCidadeRef = useRef(null);

  // 1. Carregar lojas do MongoDB
  useEffect(() => {
    const controller = new AbortController();

    async function carregarLojas() {
      try {
        setCarregandoLojas(true);
        setErroLojas("");

        const resposta = await fetch(
          `${API_URL}/lojas/mapa`,
          { signal: controller.signal }
        );

        if (!resposta.ok) {
          throw new Error("Erro ao carregar lojas.");
        }

        const dados = await resposta.json();

        if (!Array.isArray(dados.lojas)) {
          throw new Error("Resposta inválida do servidor.");
        }

        setLojas(dados.lojas);

      } catch (erro) {
        if (erro.name !== "AbortError") {
          setErroLojas(erro.message);
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

  // 2. Pesquisar uma cidade
  async function handleSubmit(event) {
    event.preventDefault();

    const cidade = texto.trim();

    if (!cidade) return;

    consultaCidadeRef.current?.abort();

    const controller = new AbortController();
    consultaCidadeRef.current = controller;

    try {
      setBuscandoCidade(true);
      setErroCoordenada("");

      const resposta = await fetch(
        `${API_URL}/lojas/buscar-cidade?q=${encodeURIComponent(cidade)}`,
        { signal: controller.signal }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "Cidade não encontrada."
        );
      }

      setCoordenadas(dados.coordenadas);

    } catch (erro) {
      if (erro.name !== "AbortError") {
        setErroCoordenada(erro.message);
      }

    } finally {
      if (!controller.signal.aborted) {
        setBuscandoCidade(false);
      }
    }
  }

  // 3. Selecionar uma loja pelo marcador
  async function selecionarLoja(loja) {
    consultaProdutosRef.current?.abort();

    const controller = new AbortController();
    consultaProdutosRef.current = controller;

    setLojaSelecionada(loja);
    setProdutos([]);
    setErroProdutos("");
    setCarregandoProdutos(true);

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
        throw new Error("Resposta inválida do servidor.");
      }

      setProdutos(dados.produtos);

    } catch (erro) {
      if (erro.name !== "AbortError") {
        setErroProdutos(erro.message);
      }

    } finally {
      if (!controller.signal.aborted) {
        setCarregandoProdutos(false);
      }
    }
  }

  // 4. Fechar o visualizador
  function fecharVisualizador() {
    consultaProdutosRef.current?.abort();

    setLojaSelecionada(null);
    setProdutos([]);
    setCarregandoProdutos(false);
    setErroProdutos("");
  }

  // Cancela requisições ao desmontar o componente
  useEffect(() => {
    return () => {
      consultaProdutosRef.current?.abort();
      consultaCidadeRef.current?.abort();
    };
  }, []);

  return (
    <div className="relative w-full h-[calc(100dvh-170px)] overflow-hidden">

      {/* PESQUISA */}
      <div
        className="absolute bg-azulultraleve
          w-95 max-w-[90vw] min-h-55
          top-0 left-0 z-[900]
          rounded-br-2xl border-r-2 border-b-2"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center
            justify-center gap-3 p-5 h-full"
        >
          <label
            htmlFor="local"
            className="text-[30px]"
          >
            Sua localização:
          </label>

          <input
            id="local"
            type="text"
            value={texto}
            placeholder="Pesquise uma cidade e aperte Enter"
            onChange={(e) => setTexto(e.target.value)}
            className="w-82.5 max-w-full h-10
              bg-white rounded-3xl border px-5"
          />

          <button
            type="submit"
            disabled={buscandoCidade}
            className="bg-azulforte text-white
              px-5 py-1 rounded-full cursor-pointer
              disabled:opacity-50"
          >
            {buscandoCidade ? "Buscando..." : "Pesquisar"}
          </button>

          {erroCoordenada && (
            <p role="alert" className="text-red-600 text-sm">
              {erroCoordenada}
            </p>
          )}

          {coordenadas && (
            <p className="text-xs text-gray-500 text-center">
              Lat: {coordenadas.lat.toFixed(5)}
              {" | "}
              Lon: {coordenadas.lng.toFixed(5)}
            </p>
          )}

          {carregandoLojas && (
            <p className="text-xs text-gray-500">
              Carregando lojas...
            </p>
          )}

          {erroLojas && (
            <p role="alert" className="text-red-600 text-sm">
              {erroLojas}
            </p>
          )}
        </form>
      </div>

      {/* VISUALIZADOR LATERAL */}
      <Vizualizador_produtos
        vendo={Boolean(lojaSelecionada)}
        loja={lojaSelecionada}
        produtos={produtos}
        carregando={carregandoProdutos}
        erro={erroProdutos}
        fechar={fecharVisualizador}
      />

      {/* MAPA */}
      <MapContainer
        center={POSICAO_INICIAL}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView
          centro={coordenadas}
          zoom={14}
        />

        <MarcadoresVisiveis
          lojas={lojas}
          onSelecionar={selecionarLoja}
        />
      </MapContainer>

    </div>
  );
}
