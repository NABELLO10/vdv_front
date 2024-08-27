import useAuth from "../hooks/useAuth";
import logo from '/logoVDV.png'
import logoMio from '/logoV.png'



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