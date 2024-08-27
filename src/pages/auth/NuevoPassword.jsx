import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { msgError, msgOk } from "../../components/Alertas";
import { ToastContainer } from 'react-toastify';
import clienteAxios from "../../config/axios";
import Particulas from "../../components/animaciones/Particulas"; // Asegúrate de que la ruta sea correcta

const NuevoPassword = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirmada, setPasswordConfirmada] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [passwordModificado, setPasswordModificado] = useState(false);

  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios.get(`/olvide-password/${token}`);
        setTokenValido(true);
      } catch (error) {
        msgError("Hubo un error con el enlace");
      }
    };

    comprobarToken();
  }, [token]);

  const crearPassword = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmada) {
      msgError("Contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      msgError("El password es muy corto, minimo 6 caracteres");
      return;
    }

    try {
      const { data } = await clienteAxios.post(`/olvide-password/${token}`, { password });
      msgOk(data.msg);
      setPasswordModificado(true);
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: 'black',opacity: "0.9"  }}>
      <Particulas /> {/* Agrega el componente de partículas aquí */}
      <ToastContainer />
      {tokenValido && (
        <div className="flex items-center justify-center lg:h-screen">
          <div className="md:flex flex-col md:flex-row w-full h-full mt-24 md:mt-0 bg-transparent rounded-lg shadow-lg overflow-hidden">
            <div className="md:w-1/2 md:p-8 p-4 md:px-12 mx-auto flex items-center justify-center">
              <div className="md:w-8/12 w-full">
                <h2
                  className="md:text-4xl text-center font-semibold mb-4 text-white"
                  style={{ fontFamily: "Rubik, sans-serif", fontWeight: 600 }}
                >
                  Restablecer Contraseña
                </h2>

                {!passwordModificado && (
                  <form onSubmit={crearPassword}>
                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Nueva Contraseña"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="passwordConfirmada"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Confirmar Contraseña
                      </label>
                      <input
                        type="password"
                        id="passwordConfirmada"
                        value={passwordConfirmada}
                        onChange={(e) => setPasswordConfirmada(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Confirmar Contraseña"
                      />
                    </div>
                    <button
                      type="submit"
                         className="w-full bg-blue-300 font-semibold text-black rounded-lg py-2 hover:bg-gray-800 hover:text-white transition duration-300"
                    >
                      Restablecer Contraseña
                    </button>
                  </form>
                )}

                {passwordModificado && (
                  <Link
                         className="block bg-blue-300 font-semibold text-center text-black rounded-lg py-2 hover:bg-gray-800 hover:text-white transition duration-300"
                    to="/"
                  >
                    Inicia Sesión
                  </Link>
                )}
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
        </div>
      )}
    </div>
  );
}

export default NuevoPassword;
