// import React from 'react';

import 'leaflet/dist/leaflet.css';
import './App.css'; // Onde está o estilo .leaflet-container com a altura
import Header from './componentes/Header';
import Bemvindo from './componentes/Bemvindo';
import Footer from './componentes/Footer';
import Navegador from './componentes/Navegador';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './componentes/Login';
import Cadastro_user from './componentes/Cadastro_user';
// import { Link } from "react-router-dom"
import { AuthProvider } from './componentes/VerificadorLogin';
import Header_simples from './componentes/Header_simples';
import Anuncios from './componentes/dashboard_vendedor/Anuncios';
import Pedidos from './componentes/dashboard_vendedor/Pedidos';
import Faturamento from './componentes/dashboard_vendedor/Faturamento';
import Configuracoes from './componentes/dashboard_vendedor/Configuracoes';
import RotaProtegida from "./componentes/RotaProtegida";
import MinhaConta from "./componentes/MinhaConta";
import CriarLoja from "./componentes/CriarLoja";
import Produto from './componentes/Produto';
import Checkout from "./componentes/Checkout";
import ConfirmacaoCompra from "./componentes/ConfirmacaoCompra";

export default function App() {
  // Coordenadas iniciais do centro do mapa (Exemplo: Avenida Paulista, São Paulo)


  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          {/* Configuração das rotas */}
          <Routes>
            <Route path="/" element={<>
              <Header_simples />
              {/* <main className='h-[calc(100dvh-170px)]'></main> */}
              <Bemvindo />
              <Navegador />
              <Footer />
            </>} />

            <Route path="/home" element={<>
              <Header />
              <main className='h-[calc(100dvh-170px)] w-full'>
                <Navegador />
                {/* <MapaLojas /> */}
              </main>
              <Footer />
            </>} />

            <Route path="/login" element={<>
              <Header />
              <Login />
              <Footer />

            </>} />
            <Route path="/Cadastro_user" element={<>
              <Header />
              <Cadastro_user />
              <Footer />
            </>} />

            
            {/* DASHBOARD VENDEDOR - ROTAS PRIVADAS */}
            <Route element={<RotaProtegida />}>

              <Route
                path="/vendedor/pedidos"
                element={
                  <>
                    <Header />
                    <Pedidos />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/vendedor/anuncios"
                element={
                  <>
                    <Header />
                    <Anuncios />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/vendedor/faturamento"
                element={
                  <>
                    <Header />
                    <Faturamento />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/vendedor/configs"
                element={
                  <>
                    <Header />
                    <Configuracoes />
                    <Footer />
                  </>
                }
              />

            </Route>

            <Route element={<RotaProtegida />}>

              <Route
                path="/minha-conta"
                element={
                  <>
                    <Header />
                    <MinhaConta />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/criar-loja"
                element={
                  <>
                    <Header />
                    <CriarLoja />
                    <Footer />
                  </>
                }
              />

            </Route>
              <Route
              path="/loja/:lojaId/produto/:produtoId"
              element={
                <>
                  <Header />
                  <Produto />
                  <Footer />
                </>
              }
            />

            <Route
              path="/checkout"
              element={
                <>
                <Header />
                <Checkout />
                <Footer />
                </>
              }
              
            />
            <Route
              path="/pagamento/retorno"
              element={
                <main className="p-8">
                  <h1 className="text-2xl font-bold">
                    Retorno do pagamento
                  </h1>

                  <p className="mt-3">
                    O Surfplace ainda está verificando
                    a situação do seu pagamento.
                  </p>
                </main>
              }
            />
            <Route
              path="/compra/confirmacao"
              element={<>
                <Header />
                <ConfirmacaoCompra />
                <Footer />
              </>}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
