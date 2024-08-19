import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


const myIcon = new L.Icon({
  iconUrl: '/mapa1.png',
  iconSize: [30, 31],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


function Mapa({ hisTurnos }) {

    const centerLat = hisTurnos.length > 0 ? hisTurnos[0].num_lat_ingreso : 0;
    const centerLon = hisTurnos.length > 0 ? hisTurnos[0].num_lon_ingreso : 0;

    return (
      <MapContainer
        center={[-37.46507, -72.34946]}
        zoom={13}
        style={{ width: "100%", height: "500px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="#">vdv</a>'
        />
        {hisTurnos.map((position, index) => (
          <React.Fragment key={"fragment-" + index}>
            {position.num_lat_ingreso && position.num_lon_ingreso ? (
              <Marker
                key={"marker-in-" + index}
                position={[position.num_lat_ingreso, position.num_lon_ingreso]}
                icon={myIcon}
              >
                <Popup key={"popup-in-" + index}>
                  <div className="flex flex-col font-bold ">
                    <span> {"Ingreso: " + position.fec_ingreso}</span>
                    <span> {position.mae_usuario.nom_usuario}</span>
                    <span> {position.mov_instalaciones_cliente.nombre}</span>
                    <span> {position.mae_turno.nom_turno}</span>
                  </div>
                </Popup>
              </Marker>
            ) : null}

            {position.num_lat_salida && position.num_lon_salida ? (
       

              <Marker 
              key={"marker-out-" + index}
              position={[position.num_lat_salida, position.num_lon_salida]}
              icon={myIcon}>
                 <Popup key={"popup-out-" + index}>
                  <div className="flex flex-col font-bold ">
                    <span> {"Salida: " + position.fec_salida}</span>
                    <span>
                      {" "}
                      {position.mae_usuario.nom_usuario}
                    </span>
                    <span> {position.mov_instalaciones_cliente.nombre}</span>
                    <span> {position.mae_turno.nom_turno}</span>
                  </div>
                </Popup>
              </Marker>



            ) : null}
          </React.Fragment>
        ))}
      </MapContainer>
    );
}

export default Mapa;
