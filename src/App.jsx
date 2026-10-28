// import React from 'react';

import 'leaflet/dist/leaflet.css';
import './App.css'; // Onde está o estilo .leaflet-container com a altura
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import Navegador from './componentes/Navegador';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './componentes/Login';
import Cadastro_user from './componentes/Cadastro_user';
// import { Link } from "react-router-dom"
import { AuthProvider } from './componentes/VerificadorLogin';


export default function App() {
  // Coordenadas iniciais do centro do mapa (Exemplo: Avenida Paulista, São Paulo)
 

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Header/>
            <main className='h-[calc(100dvh-170px)]'>
            {/* Configuração das rotas */}
            <Routes>
              <Route path="/" element={ <Navegador/>} />
              
              <Route path="/login" element={<Login/>} /> 
              <Route path="/Cadastro_user" element={<Cadastro_user/>} /> 
            </Routes>

            </main>
          <Footer/>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
