
import clienteAxios from "../../config/axios";
import {useState, useEffect } from 'react';

import useAuth from "../../hooks/useAuth";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { format } from "date-fns";


  const TranferPersonal = ({empresaMOV, perfil, turno, control, desde, hasta, personalSeleccionado, setPersonalSeleccionado,perGuardadas,  setPerGuardadas  }) => {

  const { auth } = useAuth();
  const [personal, setPersonal] = useState([]);
  const [personalPermiso, setPersonalPermiso] = useState([]);

  const [id_empresa, setEmpresa] = useState(auth.id_empresa);
  

  useEffect(()=> {
    if(empresaMOV && desde && hasta){    
      obtenerPersonalSinTurno()  
    }
  },[empresaMOV, desde, hasta, turno, control, perfil])
  

  const obtenerPersonalPermisos = async () => {
    try {
      const token = localStorage.getItem("token_vdv");

      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };   

      const { data } = await clienteAxios(
        `/crud/personalPermiso/${id_empresa}/${desde}/${hasta}`,
        config
      )      
       
      return(data);
     
    } catch (error) {
      console.log(error);
    }
  };

  const tienePermiso = (id) => {
    return personalPermiso.some(personaPermiso => personaPermiso.id_personal === id);
  };


  const obtenerPersonalSinTurno = async () => {
    try {
      const token = localStorage.getItem("token_vdv");

      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };   

      const { data } = await clienteAxios(
        `/crud/sinTurno/${id_empresa}/${desde}/${hasta}/${turno}`,
        config
      )      
  
      let resultado = data;

      if (perfil !== "") {
          resultado = resultado.filter(e => e.id_perfil == perfil);
      }
      
     // setPersonal(resultado);

      const pPermisos = await obtenerPersonalPermisos() 

      const permiso = pPermisos.filter(r => r.id_personal > 0)

      setPersonalPermiso(permiso)     


      setPersonal(resultado);
   
    } catch (error) {
      console.log(error);
    }
  };


  const handleSeleccionar = (event) => {
    const personaID = parseInt(event.target.value);
    const nuevaspersonalSeleccionado = [...personalSeleccionado];

    if (event.target.checked) {
      nuevaspersonalSeleccionado.push(personaID);
      setPerGuardadas([...perGuardadas, personaID]); // Agregar tarea seleccionada a perGuardadas
    } else {
      const index = nuevaspersonalSeleccionado.indexOf(personaID);
      if (index > -1) {
        nuevaspersonalSeleccionado.splice(index, 1);
      }
      setPerGuardadas(perGuardadas.filter((tarea) => tarea !== personaID)); // Eliminar tarea deseleccionada de perGuardadas
    }
    setPersonalSeleccionado(nuevaspersonalSeleccionado);
  };


  return (
    <div className="">
  <div className="lg:grid lg:grid-cols-2 text-xs mt-2 overflow-auto h-72">
    {personal  
      .map((r) => (
        <div key={r.id} className="">
          <FormControlLabel
            control={
              <Checkbox
                id={`tarea-${r.id}`}
                value={r.id}
                checked={perGuardadas.includes(r.id)}
                onChange={handleSeleccionar}
                disabled={tienePermiso(r.id_personal)}
              />
            }
            label={
              <label
                htmlFor={`tarea-${r.id}`}
                // Aplica una clase condicional basada en si el ID tiene permiso
                className={tienePermiso(r.id_personal) ? "text-red-500" : ""}
              >
                {r.nom_usuario}
              </label>
            }
          />
        </div>
      ))}
  </div>
</div>

  );
}


export default TranferPersonal