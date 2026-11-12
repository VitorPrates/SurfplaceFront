// import React from 'react';

import 'leaflet/dist/leaflet.css';
import './App.css'; // Onde está o estilo .leaflet-container com a altura
import Header from './componentes/Header';
import Bemvindo from './componentes/Bemvindo';
import Footer from './componentes/Footer';
import Navegador from './componentes/Navegador';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './componentes/Login';
import Cadastro_user from './componentes/Cadastro_user';
// import { Link } from "react-router-dom"
import { AuthProvider } from './componentes/VerificadorLogin';
import Header_simples from './componentes/Header_simples';


export default function App() {
  // Coordenadas iniciais do centro do mapa (Exemplo: Avenida Paulista, São Paulo)
 

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
            
            {/* Configuração das rotas */}
            <Routes>
              <Route path="/" element={ <>
                  <Header_simples />
                  {/* <main className='h-[calc(100dvh-170px)]'></main> */}
                  <Bemvindo/>
                  <Navegador />
                  <Footer/>
                </>} />

              <Route path="/home" element={<>
                <Header/>
                <Navegador/>
                <Footer/>
              </>} /> 

              <Route path="/login" element={<Login/>} /> 
              <Route path="/Cadastro_user" element={<Cadastro_user/>} /> 
            </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
