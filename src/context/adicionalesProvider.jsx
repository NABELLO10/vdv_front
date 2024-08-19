import {useState, useEffect, createContext} from 'react'
import clienteAxios from '../config/axios'

const AdicionalesContext = createContext()

const AdicionalesProvider = ({children}) => {

    const [empresas, setEmpresas] = useState([])

    useEffect(() => {    
        obtenerEmpresas()  
                 
    }, [])

    
    const obtenerEmpresas = async () =>{
        try {
            const token = localStorage.getItem("token_vdv")

            if(!token) return
      
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }                        
         
            const {data} = await clienteAxios('/crud/obtener-empresas', config)           
            setEmpresas(data)

        } catch (error) {
            console.log(error)
        }
    }   

    return(
        <AdicionalesContext.Provider 
            value={{             
                obtenerEmpresas,
                empresas
            }}>
            {children}
        </AdicionalesContext.Provider>
    )
}

export {
    AdicionalesProvider
}

export default AdicionalesContext
