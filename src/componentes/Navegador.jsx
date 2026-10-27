import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';


function ChangeView({ center, zoom }) {
        const map = useMap();
        map.flyTo(center, zoom, {
            duration: 2 // Duração da animação em segundos
        });
        return null;
    }


export default function Navegador()
{
    const [texto, setTexto] = useState('');
    const [coordenadas, setCoordenadas] = useState([-23.561684, -46.655981]);
    const [errocoordenada, seterrocoordenada] = useState(false)
    const posicaoInicial = [-23.561684, -46.655981];




    const handleSubmit = async (event) => {
        event.preventDefault(); 
        seterrocoordenada(false)
        if (!texto.trim()) return;

        console.log("Iniciando busca para:", texto);
        
        // 2. Chamamos a lógica do fetch diretamente aqui
        try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(texto)}&format=json`;
            const resposta = await fetch(url, {
                headers: {
                    'User-Agent': 'MeuProjetoDeMapa/1.0'
                }
            });

            const dados = await resposta.json();

            if (dados.length > 0) {
                const lat = parseFloat(dados[0].lat);
                const lon = parseFloat(dados[0].lon);
                console.log(`Encontrado: ${lat}, ${lon}`);
                setCoordenadas({ lat, lon }); 
            } else {
                console.log("Endereço não encontrado.");
                seterrocoordenada(true)
            }
        } catch (erro) {
            console.error("Erro na requisição:", erro);
            seterrocoordenada(true)
        }
    };


    return(<>
        <div className="absolute bg-azulultraleve w-95 h-75 top-25 z-999 rounded-br-2xl border-r-2 border-b-2 ">
            <form action="" className="flex flex-col items-center justify-center w-full h-full" onSubmit={handleSubmit}>
                <label htmlFor="local" className="text-[30px]">Sua localização:</label>
                <input type="text" value={texto} placeholder="Pesquise e digite enter" onChange={(e) => setTexto(e.target.value)} name="buscaendereco" className="w-82.5 h-10 bg-white rounded-3xl border pl-5 pr-5"/>
                {coordenadas && (
                <p className="text-center mt-2 text-sm">
                    Lat: {coordenadas.lat} | Lon: {coordenadas.lon}
                </p>)}
                {errocoordenada? <p>Não encontrado</p> : ""}
            </form>
 
        </div>
        <MapContainer 
          center={coordenadas} 
          zoom={13} 
          scrollWheelZoom={true}
          >
          {/* Camada de dados do OpenStreetMap */}
          
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          <ChangeView center={coordenadas} zoom={13} />
          {/* Marcador no mapa */}
          <Marker position={posicaoInicial}>
            <Popup>
              Avenida Paulista, São Paulo - SP
            </Popup>
          </Marker>
        </MapContainer>
    </>
    )
}