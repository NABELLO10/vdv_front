import {useState, useEffect, createContext} from 'react'
import clienteAxios from '../config/axios'

const AdicionalesContext = createContext()

const AdicionalesProvider = ({children}) => {

    const [clientes, setClientes] = useState([])
    const [ciudades, setCiudades] = useState([])

    useEffect(() => {    
        obtenerClientes()  
        obtenerCiudades()
    }, [])

    const formateaRut = (rut) => {
        const actual = rut.replace(/^0+/, "");
        if (actual !== "" && actual.length > 1) {
          const sinPuntos = actual.replace(/\./g, "");
          const actualLimpio = sinPuntos.replace(/-/g, "");
    
          let inicio = actualLimpio.substring(0, actualLimpio.length - 1);
          let rutFormateado = "";
          let j = 1;
    
          for (let i = inicio.length - 1; i >= 0; i--) {
            const letra = inicio.charAt(i);
            rutFormateado = letra + rutFormateado;
            if (j % 3 === 0 && j <= inicio.length - 1) {
              rutFormateado = "." + rutFormateado;
            }
            j++;
          }
    
          const dv = actualLimpio.substring(actualLimpio.length - 1);
          rutFormateado = rutFormateado + "-" + dv;
    
          return rutFormateado;
        } else {
          return rut;
        }
      };   


    const obtenerCiudades = async () => {
        try {
          const token = localStorage.getItem("token_vdv");
    
          if (!token) return;
    
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };
          const { data } = await clienteAxios("/general/ciudades", config);
          setCiudades(data);
        } catch (error) {
          console.log(error);
        }
      };
    
    const obtenerClientes = async () =>{
        try {
            const token = localStorage.getItem("token_vdv")

            if(!token) return
      
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }                        
         
            const {data} = await clienteAxios('/crud/clientes', config)     
             
            setClientes(data)

        } catch (error) {
            console.log(error)
        }
    }   

    return(
        <AdicionalesContext.Provider 
            value={{       
                clientes,
                ciudades,
                formateaRut
            }}>
            {children}
        </AdicionalesContext.Provider>
    )
}

export {
    AdicionalesProvider
}

export default AdicionalesContext
