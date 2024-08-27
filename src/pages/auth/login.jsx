import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import clienteAxios from "../../config/axios";
import { ToastContainer } from "react-toastify";
import { msgError, msgInfo } from "../../components/Alertas";
import Particulas from "../../components/animaciones/Particulas"; // Importa el nuevo componente

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([email, password].includes("")) {
      msgInfo("Campos Obligatorios");
      return;
    }

    try {
      const url = `/login`;
      const { data } = await clienteAxios.post(url, { email, password });
      localStorage.setItem("token_vdv", data.token);
      setAuth(data);
      navigate("/admin");
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };
  

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: 'black', opacity: "0.9" }}>
      <Particulas /> {/* Agrega el componente de partículas aquí */}
      <div className="flex items-center justify-center lg:h-screen">
        <div className="md:flex flex-col md:flex-row w-full h-full mt-24 md:mt-0 bg-transparent shadow-lg overflow-hidden">
          <div className="md:w-1/2 md:p-8 p-4 md:px-12 mx-auto flex items-center justify-center">
            <div className="md:w-8/12 w-full">
              <h2
                className="md:text-4xl text-center font-semibold mb-4 text-white"
                style={{ fontFamily: "Rubik, sans-serif", fontWeight: 600 }}
              >
                Iniciar Sesión
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-blue-200"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-blue-200"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Contraseña"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-300 font-semibold text-black rounded-lg py-2 hover:bg-gray-800 hover:text-white transition duration-300"
                >
                  Iniciar sesión
                </button>
                <Link
                  className="block text-end my-2 text-gray-200 text-sm hover:text-blue-600 duration-200"
                  to="/olvide-password"
                >
                  Olvide mi contraseña
                </Link>
              </form>
            </div>
          </div>

          {/* Lado izquierdo con la imagen */}
          <div className="md:w-1/2 h-full bg-transparent justify-center items-center md:block hidden">
            <img
              className="object-contain mt-48 h-32 md:h-auto"
              src="/logoV.png"
              alt="Logo"
            />
          </div>

          <div className="md:hidden block bg-transparent mb-6 md:mb-0">
            <img
              className="mx-auto h-24 object-contain"
              src="/logoV.png"
              alt="Logo"
            />
          </div>
        </div>
        <ToastContainer />
        
        
      </div>
    </div>
  );
};

export default Login;
