// import React from 'react';

import 'leaflet/dist/leaflet.css';
import './App.css'; // Onde está o estilo .leaflet-container com a altura
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import Navegador from './componentes/Navegador';




export default function Mapa() {
  // Coordenadas iniciais do centro do mapa (Exemplo: Avenida Paulista, São Paulo)
 

  return (
    <>
      <Header/>
      <main className='relative'>
        <Navegador/>
      </main>
      <Footer/>
    </>
  );
}
