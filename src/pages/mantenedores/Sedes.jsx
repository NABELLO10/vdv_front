import { useEffect, useState } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";
import useAdicionales from "../../hooks/useAdicionales";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";


const Sedes = () => {
  const { auth } = useAuth();  
  const { clientes, ciudades } = useAdicionales();  

  const [id_cliente, setCliente] = useState(auth.id_cliente);
  const [nom_sede, setNomSede] = useState("");
  const [id_ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [est_activo, setEstado] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [eliminar, setEliminar] = useState("");


  const [sedes, setSedes] = useState([]);

  //PARA EDICION de una sede
  const [edit, setEdit] = useState({});

  useEffect(() => {
    obtenerSedes();
  }, [id_cliente]);



  const obtenerSedes = async () => {
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
        `/crud/sedes/${id_cliente}`,
        config
      );

      setSedes(data);
    } catch (error) {
      console.log(error);
    }
  };


  const limpiarFormulario = () => {
    setNomSede("");
    setCiudad("");
    setDireccion("");
    setEdit({});
    setEstado(1);
    obtenerSedes();
  };

  const setEdicion = (sede) => {
    setEdit(sede);
    setNomSede(sede.nom_sede);
    setCiudad(sede.id_ciudad);
    setDireccion(sede.direccion);
    setEstado(sede.est_activo);
    setID(sede.id);

  };

  const eliminarSede = async (id) => {
    try {
      const token = localStorage.getItem("token_vdv");
      if (!token) {
        msgError("Token no valido");
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.delete(
        `/crud/sedes/${id}`,
        config
      );
      msgOk(data.msg);
      obtenerSedes();
      handleClose()

    } catch (error) {
      if (error.response) {
        // Si hay un error de respuesta de la API, muestra el mensaje de error.
        msgError(error.response.data.msg);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        msgError("No hay respuesta del servidor");
      } else {
        // Algo falló al hacer la solicitud
        msgError("Error al realizar la solicitud");
      }
      console.log(error);
    }
  };

  const registrar = async () => {
    if ([nom_sede, id_ciudad, direccion].includes("")) {
      msgError("Ingrese todos los campos");
      return;
    }

   try {
      const token = localStorage.getItem("token_vdv");

      if (!token) {
        msgError("Token no valido");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (edit.id) {
        const { data } = await clienteAxios.put(
          `/crud/sedes/${id}`,
          {
            nom_sede,
            id_ciudad,
            direccion,
            est_activo: est_activo,
            id_cliente
          },
          config
        );

        msgOk(data.msg);
      } else {
        const { data } = await clienteAxios.post(
          "/crud/sedes",
          {
            nom_sede,                   
            id_ciudad,
            direccion,
            est_activo: est_activo,
            id_cliente
          },
          config
        );

        msgOk(data.msg);
      }

      limpiarFormulario();
     } catch (error) {
      msgError(error.response.data.msg);
    } 
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    await registrar();
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <h2 className="font-black text-gray-800 text-2xl mx-4 ">
        Sedes       
      </h2>

      <div className="mt-2 mx-4 lg:mx-0 lg:flex justify-start">
        <div className="shadow-lg h-full  lg:w-4/12 px-8 py-5 rounded-xl bg-white">
          <form className="" onSubmit={handleSubmit}>
            {auth.id == 1 && (
              <div className="">
                <label
                  htmlFor="sede"
                  className="peer-placeholder-shown:uppercase absolute left-0 -top-3.5 text-gray-900 text-sm
                                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all peer-placeholder-shown:top-3"
                ></label>

                <select
                  name="sede"
                  value={id_cliente}
                  className={`mt-2 w-full p-2 bg-gray-50 border uppercase border-gray-300 rounded-lg text-center text font-bold text-gray-500 `}
                  onChange={(e) => setCliente(e.target.value)}
                >
                  {clientes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-4 mt-4">

              <div className="">
                <TextField
                  id="nom_sede"
                  className="peer pt-3 pb-2 block w-full"
                  value={nom_sede}
                  onChange={(e) => setNomSede(e.target.value)}
                  label="Nombre"
                  variant="outlined"
                />
              </div>

              <div className="">
                <select
                  name="ciudad"
                  value={id_ciudad}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-center text font-bold text-gray-500"
                  onChange={(e) => setCiudad(e.target.value)}
                >
                  <option value={""} disabled hidden>
                    Ciudad...
                  </option>
                  {ciudades.map((ciudad) => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.nom_comuna}
                    </option>
                  ))}
                </select>
              </div> 

              <div className=" ">
                <TextField
                  id="direccion"
                  className="peer pt-3 pb-2 block w-full"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  label="Dirección"
                  variant="outlined"
                />
              </div>

              <div className="">
                <select
                  name="perfil"
                  value={est_activo}
                  className=" w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-center text font-bold text-gray-500"
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
            </div>

            <div className="lg:flex gap-5 lg:my-2">
              <div className="lg:flex  gap-2  mx-auto">
                <input
                  type="submit"
                  value={edit.id ? "Actualizar" : "Registrar"}
                  className="bg-cyan-950  hover:bg-cyan-600 duration-100 w-full py-2 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer px-10"
                ></input>

                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className={`bg-gray-600  hover:bg-gray-700 duration-100 w-full  py-2 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer px-10 `}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="overflow-auto lg:w-8/12 rounded-lg  lg:mt-0 mt-6 lg:px-5">
          <div className="lg:w-4/12">
            <input
              name="busqueda"
              id="busqueda"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className=" border border-blue-800 shadow rounded-md p-1  w-full text-blue-500 placeholder-blue-300 mb-2"
              placeholder=" Buscar..."
            />
          </div>
          <table className=" border-collapse border-2 lg:w-full shadow-lg border-gray-300 rounded-lg bg-white text-left text-xs text-gray-500">
            <thead className="font-bold text-white bg-cyan-950">
              <tr>
               {/*  <th scope="col" className="px-6 py-2 font-bold text-white bg-blue-950">
                  Rut
                </th> */}
                <th scope="col" className="px-6 py-2 ">
                  Sede
                </th>

                <th scope="col" className="px-6 py-2 ">
                  Ciudad
                </th>
                <th scope="col" className="px-6 py-2">
                  Dirección
                </th>
                <th scope="col" className="px-6 py-2 ">
                  Estado
                </th>

                <th
                  scope="col"
                  className="px-6 py-4 font-medium text-white "
                ></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100  border-gray-100">
              {sedes
                .filter((val) => {
                  if (busqueda == "") {
                    return val;
                  } else if (
                    val.nom_sede
                      .toLowerCase()
                      .includes(busqueda.toLowerCase())
                  ) {
                    return val;
                  }
                })
                .map((sede) => (
                  <tr
                    className="whitespace-nowrap hover:bg-gray-200"
                    key={sede.id}
                  >
                
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {sede.nom_sede}
                    </td>

                     <td className="px-6 py-4 text-sm text-gray-500">
                      {sede.mae_comuna.nom_comuna}
                    </td> 

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {sede.direccion}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {sede.est_activo ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setEdicion(sede)}
                        className="py-1 mx-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-blue-400 hover:text-blue-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <button
                        className="py-1 "
                        onClick={() => {
                          setEliminar(sede.id);
                          handleClickOpen();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-red-500 hover:text-red-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="p-0.5 rounded-lg">
            <div className="">
              <div className="modal-body relative p-4">
                <p>¿Realmente desea eliminar esta Empresa?</p>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-500 active:shadow-lg transition duration-150 ease-in-out"
            onClick={handleClose}
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => eliminarSede(eliminar)}
            className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
          >
            Eliminar
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sedes;
