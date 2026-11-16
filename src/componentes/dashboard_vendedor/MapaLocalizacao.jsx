
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const icone = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapaLocalizacao({
  ponto,
  onChange
}) {
  const containerRef = useRef(null);
  const mapaRef = useRef(null);
  const marcadorRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Cria o mapa uma única vez
  useEffect(() => {
    if (!containerRef.current || mapaRef.current) return;

    const mapa = L.map(containerRef.current)
      .setView([-23.55052, -46.633308], 11);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19
      }
    ).addTo(mapa);

    mapa.on("click", (evento) => {
      onChangeRef.current({
        latitude: evento.latlng.lat,
        longitude: evento.latlng.lng
      });
    });

    mapaRef.current = mapa;

    const raf = requestAnimationFrame(() => {
      mapa.invalidateSize();
    });

    return () => {
      cancelAnimationFrame(raf);
      mapa.remove();
      mapaRef.current = null;
      marcadorRef.current = null;
    };
  }, []);

  // Atualiza a posição do marcador
  useEffect(() => {
    const mapa = mapaRef.current;

    if (!mapa) return;

    if (!ponto) {
      if (marcadorRef.current) {
        mapa.removeLayer(marcadorRef.current);
        marcadorRef.current = null;
      }
      return;
    }

    const posicao = [
      ponto.latitude,
      ponto.longitude
    ];

    if (!marcadorRef.current) {
      const marcador = L.marker(posicao, {
        icon: icone,
        draggable: true
      }).addTo(mapa);

      marcador.on("dragend", () => {
        const pos = marcador.getLatLng();

        onChangeRef.current({
          latitude: pos.lat,
          longitude: pos.lng
        });
      });

      marcadorRef.current = marcador;
    } else {
      marcadorRef.current.setLatLng(posicao);
    }

    mapa.flyTo(posicao, 17);
  }, [ponto]);

  return (
    <div>
      <div
        ref={containerRef}
        className="w-full h-65 rounded-lg border"
      />

      <p className="text-xs text-gray-600 mt-2">
        Clique no mapa ou arraste o marcador para
        ajustar a localização exata da loja.
      </p>

      {ponto && (
        <p className="text-xs text-gray-500 mt-1">
          Latitude: {ponto.latitude.toFixed(6)}
          {" | "}
          Longitude: {ponto.longitude.toFixed(6)}
        </p>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Dados do mapa: © OpenStreetMap contributors
      </p>
    </div>
  );
}
