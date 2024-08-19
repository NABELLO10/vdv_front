import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import NavBar from "../components/menus/NavBar";
import Spinner from "../components/animaciones/Spinner";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

const RutaProtegida = () => {
  const navigate = useNavigate();
  const { auth, cargando } = useAuth();


  useEffect(() => {

    if (!cargando && !auth?.id) {
      navigate("/");
    }

    if (auth.est_activo == 0) {
      navigate("/");
    }
    
  }, [auth?.id, auth.est_activo, cargando, navigate]);

  if (cargando) return <Spinner />;

  return (
    <>
      <NavBar />

      <main className=" mx-5 h-screen mt-20 mb-2">
        <ToastContainer />
        <Outlet />
      </main>
    {/*   <footer className="bg-blue-950 h-max text-white py-0.5">
    <div className="container mx-auto text-center">
      <p className="text-xl font-semibold text-yellow-300 animate-pulse">vdv CHILE</p>
    </div>
  </footer>  */}
    </>
  );
};

export default RutaProtegida;
