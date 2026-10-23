import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css'; // Onde está o estilo .leaflet-container com a altura
import Header from './componentes/Header';



export default function Mapa() {
  // Coordenadas iniciais do centro do mapa (Exemplo: Avenida Paulista, São Paulo)
  const posicaoInicial = [-23.561684, -46.655981];

  return (
    <>
      <Header/>
      <MapContainer 
        center={posicaoInicial} 
        zoom={13} 
        scrollWheelZoom={false}
      >
        {/* Camada de dados do OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcador no mapa */}
        <Marker position={posicaoInicial}>
          <Popup>
            Avenida Paulista, São Paulo - SP
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
}
