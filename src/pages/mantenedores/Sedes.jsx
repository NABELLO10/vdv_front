import { useEffect, useState } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";
import useAdicionales from "../../hooks/useAdicionales";

import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

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
  const [edit, setEdit] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
   
  const itemsPerPage = 5;

  useEffect(() => {
    obtenerSedes();
  }, [id_cliente]);


  const sortData = (column) => {
    const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
  
    const sortedData = [...sedes].sort((a, b) => {
      if (newDirection === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
  
    setSedes(sortedData);
  };

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
      const { data } = await clienteAxios(`/crud/sedes/${id_cliente}`, config);
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
      const { data } = await clienteAxios.delete(`/crud/sedes/${id}`, config);
      msgOk(data.msg);
      obtenerSedes();
      handleClose();
    } catch (error) {
      if (error.response) {
        msgError(error.response.data.msg);
      } else if (error.request) {
        msgError("No hay respuesta del servidor");
      } else {
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
          `/crud/sedes/${edit.id}`,
          {
            nom_sede,
            id_ciudad,
            direccion,
            est_activo: est_activo,
            id_cliente,
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
            id_cliente,
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Filtrar las sedes según la búsqueda
  const filteredSedes = sedes.filter((val) => {
    if (!busqueda) return val;
    return val.nom_sede.toLowerCase().includes(busqueda.toLowerCase());
  });

  // Calcular la paginación después del filtro
  const totalPages = Math.ceil(filteredSedes.length / itemsPerPage);
  const paginasSedes = filteredSedes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Resetear la página actual si se cambia la búsqueda y no hay suficientes elementos
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredSedes, totalPages, currentPage]);

  return (
    <>
      <div className="mx-auto">
        <h6 className="font-black text-gray-800 text-xl mb-2">Sedes</h6>

        <div className="bg-white shadow rounded-lg p-3 mb-3">
          <form onSubmit={handleSubmit}>
            {auth.id == 1 && (
              <FormControl fullWidth margin="dense" size="small">
                <InputLabel id="cliente-label">Cliente</InputLabel>
                <Select
                  labelId="cliente-label"
                  id="cliente"
                  value={id_cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  label="Cliente"
                >
                  {clientes.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FormControl fullWidth margin="dense" size="small">
                <TextField
                  id="nom_sede"
                  label="Nombre de la Sede"
                  value={nom_sede}
                  onChange={(e) => setNomSede(e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FormControl>

              <FormControl fullWidth margin="dense" size="small">
                <InputLabel id="ciudad-label">Ciudad</InputLabel>
                <Select
                  labelId="ciudad-label"
                  id="ciudad"
                  value={id_ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  label="Ciudad"
                >
                  <MenuItem value="" disabled>
                    Ciudad...
                  </MenuItem>
                  {ciudades.map((ciudad) => (
                    <MenuItem key={ciudad.id} value={ciudad.id}>
                      {ciudad.nom_comuna}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="dense" size="small">
                <TextField
                  id="direccion"
                  label="Dirección"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FormControl>

              <FormControl fullWidth margin="dense" size="small">
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  id="estado"
                  value={est_activo}
                  onChange={(e) => setEstado(e.target.value)}
                  label="Estado"
                >
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="mt-1 lg:flex  justify-end gap-2">
              <input
                type="submit"
                value={edit.id ? "Actualizar" : "Registrar"}
                className="bg-cyan-950  hover:bg-cyan-600 duration-100 w-full lg:w-auto py-1 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer px-10"
              ></input>

              <button
                type="button"
                onClick={limpiarFormulario}
                className={
                  "bg-gray-600  hover:bg-gray-700 duration-100 lgflex w-full  lg:w-auto py-1 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer px-10"
                }
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-2">
          <TextField
            id="busqueda"
            label="Buscar Sede"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            margin="dense"
          />
          <div className="overflow-x-auto rounded-xl ">
            <table className="min-w-full table-auto border-collapse  border text-center border-gray-300">
              <thead>
                <tr className="bg-cyan-950 text-center text-white">
                  <th
                    className="px-4 font-semibold cursor-pointer hover:text-cyan-600"
                    onClick={() => sortData("nom_sede")}
                  >
                    Sede{" "}
                    {sortColumn === "nom_sede" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 font-semibold cursor-pointer  hover:text-cyan-600"
                    onClick={() => sortData("mae_comuna.nom_comuna")}
                  >
                    Ciudad{" "}
                    {sortColumn === "mae_comuna.nom_comuna" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 font-semibold cursor-pointer  hover:text-cyan-600"
                    onClick={() => sortData("direccion")}
                  >
                    Dirección{" "}
                    {sortColumn === "direccion" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 font-semibold cursor-pointer  hover:text-cyan-600"
                    onClick={() => sortData("est_activo")}
                  >
                    Estado{" "}
                    {sortColumn === "est_activo" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginasSedes.map((sede) => (
                  <tr key={sede.id} className="hover:bg-gray-200">
                    <td className="px-4 py-2 text-sm">{sede.nom_sede}</td>
                    <td className="px-4 py-2 text-sm">
                      {sede.mae_comuna.nom_comuna}
                    </td>
                    <td className="px-4 py-2 text-sm">{sede.direccion}</td>

                    <td className="px-4 py-2 text-sm">
                      {sede.est_activo ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                          Inactivo
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-1 flex gap-2 justify-end mr-20">
                      <button
                        type="button"
                        onClick={() => setEdicion(sede)}
                        className="py-1  text-blue-600 hover:text-blue-900"
                      >
                        <EditTwoToneIcon />
                      </button>

                      <button
                        className="py-1 text-red-500 hover:text-red-800 "
                        onClick={() => {
                          setEliminar(sede.id);
                          handleClickOpen();
                        }}
                      >
                        <DeleteTwoToneIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mostrar paginación solo si hay más de una página */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <p>¿Realmente desea eliminar esta sede?</p>
        </DialogContent>
        <DialogActions>
          <button
            className="bg-gray-500 px-4 py-1 rounded-md text-white hover:bg-gray-600"
            onClick={handleClose}
          >
            Cerrar
          </button>
          <button
            className="bg-red-500 px-4 py-1 rounded-md text-white hover:bg-red-600"
            onClick={() => eliminarSede(eliminar)}
          >
            Eliminar
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sedes;
