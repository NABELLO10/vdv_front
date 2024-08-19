import useAuth from "../hooks/useAuth";
import logo from '../../public/logoVDV.png'
import logoMio from '../../public/logoV.png'
import TurnosGuardias from '../pages/procesos/TurnosGuardias'
import GraficoFinanzas from "./procesos/inicioComponentes/GraficoFinanzas";
import GraficoPagos from "./procesos/inicioComponentes/GraficoPagos";
import GraficoPersonal from "./procesos/inicioComponentes/GraficoPersonal";
import GraficosVehiculos from "./procesos/inicioComponentes/GraficosVehiculos";


const Inicio = () => {
  const { auth } = useAuth();

  return (
    <>
    
      
        <div>
         {/*  <div className="flex justify-center gap-5">
            <div className="  w-6/12 justify-center  ">
              <GraficoFinanzas />
            </div>
            <div className="flex w-6/12 justify-center ">
              <GraficoPagos />
            </div>
          </div>
          <div className="flex justify-center gap-5">
            <GraficoPersonal />
            <GraficosVehiculos />
          </div> */}
             <img
            src={logoMio}
            className=" mx-auto  md:w-12/12 w-8/12 mt-32"
          />
        </div>
     
    </>
  );
}

export default Inicio