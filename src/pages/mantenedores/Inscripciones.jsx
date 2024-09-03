import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import clienteAxios from "../../config/axios";
import { ToastContainer } from "react-toastify";
import { msgError, msgInfo, msgOk } from "../../components/Alertas";
import formatearRut from "../../components/datos/formatearRut"
import { validateRut } from "@fdograph/rut-utilities";


const Inscripciones = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Asegúrate de añadir el estado para el password si lo vas a usar
  const [rut, setRut] = useState("");
  const [nombres, setNombres] = useState("");
  const [apePaterno, setApePaterno] = useState("");
  const [apeMaterno, setApeMaterno] = useState("");

  const navigate = useNavigate();
  const { setAuth } = useAuth();



  const limpiarFormulario = () => {
    setRut("");
    setNombres("");
    setApePaterno("");
    setApeMaterno("");
    setEmail("");
  };


  const registrar = async () => {
    if ([rut,nombres, apePaterno, email].includes("")) {
      msgError("Ingrese todos los campos");
      return;
    }

    if (!validateRut(rut)) {
        msgError("RUT no válido");
        return;
      }
      
      try{
        const { data } = await clienteAxios.post(
          "/crud/inscripciones",
          {
            id_evento : 1,
            rut,
            email,
            nombres,
            ape_paterno: apePaterno,
            ape_materno: apeMaterno,
            est_presente: 0,
          }
        );

        msgOk(data.msg);

      limpiarFormulario();
    } catch (error) {
        msgInfo(error.response.data.msg);
      }
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registrar();
  };



  return (
    <>
        <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/1_horizontal.jpg')",
        backgroundSize: "cover",
        opacity:"0.9",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay", // Esto asegurará que el fondo sea visible pero oscuro
      }}
    >

      <div className="w-full max-w-md bg-black bg-opacity-80 px-5 py-16 rounded-xl mx-5 ">
        <h2 className="text-3xl text-center text-cyan-200 font-semibold mb-4">
          Inscripciones
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Elementos del formulario aquí */}
          <div className="mb-4">
            <label htmlFor="rut" className="text-sm font-medium text-white">
              Rut
            </label>
            <input
              type="text"
              id="rut"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Rut"
              value={rut}
              onChange={(e) => setRut(formatearRut(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="nombres"
              className="text-sm font-medium text-white"
            >
              Nombres
            </label>
            <input
              type="text"
              id="nombres"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="apePaterno"
              className="text-sm font-medium text-white"
            >
              Apellido Paterno
            </label>
            <input
              type="text"
              id="apePaterno"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Apellido Paterno"
              value={apePaterno}
              onChange={(e) => setApePaterno(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="apeMaterno"
              className="text-sm font-medium text-white"
            >
              Apellido Materno
            </label>
            <input
              type="text"
              id="apeMaterno"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Apellido Materno"
              value={apeMaterno}
              onChange={(e) => setApeMaterno(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-800 text-white font-semibold rounded-lg py-2 hover:bg-cyan-900 transition duration-200"
          >
            Registrar Inscripción
          </button>
        </form>    
      </div>
     <ToastContainer />

    </div>

    <div className="bg-sky-950 text-cyan-500 text-center text-xs font-semibold hover:text-cyan-600 transition duration-300"> <a target="_blank" href="https://milodev.cl/">Desarrollado por miloDev.cl </a> </div>

    </>

  );
};

export default Inscripciones;
