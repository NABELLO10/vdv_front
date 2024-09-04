import { useEffect, useState } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";
import * as XLSX from 'xlsx';

import Tooltip from '@mui/material/Tooltip';
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
import Checkbox from "@mui/material/Checkbox";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import SaveAsTwoToneIcon from '@mui/icons-material/SaveAsTwoTone';

const DetEvento = () => {
  const { auth } = useAuth();
  const [id_cliente, setCliente] = useState(auth.id_cliente);

  const [id_evento, setEvento] = useState("");
  const [id_sede, setSede] = useState("");

  const [est_presente, setEstPresente] = useState({});
  const [est_pagado, setEstPagado] = useState({});
  const [obs, setObs] = useState({});
  const [sedes, setSedes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [eliminar, setEliminar] = useState("");
  const [inscripciones, setInscripciones] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const itemsPerPage = 200;

  useEffect(() => {
    setEvento("")
    if (id_sede > 0) {
      obtenerEventos();
    }
  }, [id_sede]);

  useEffect(() => {
    obtenerSedes();
  }, []);

  useEffect(() => {
    if (id_evento > 0) {
      obtenerInscripciones();
    }
  }, [id_evento]);

  // Actualizar el listado de inscripciones cada 1 minuto
  useEffect(() => {
    const interval = setInterval(() => {
      if (id_evento) {
        obtenerInscripciones();
      }
    }, 10000); // 60000 ms = 1 minuto

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, [id_evento]);

  const obtenerEventos = async () => {
    try {
      const token = localStorage.getItem("token_vdv");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios(`/crud/eventos/${id_sede}`, config);
      setEventos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerInscripciones = async () => {
    try {
      const token = localStorage.getItem("token_vdv");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios(`/crud/inscripciones/${id_evento}`, config);
      setInscripciones(data);

      // Inicializar los estados de presente, pagado y observación para cada inscripción
      const presenteInitial = {};
      const pagadoInitial = {};
      const obsInitial = {};
      data.forEach(inscripcion => {
        presenteInitial[inscripcion.id] = inscripcion.est_presente === 1;
        pagadoInitial[inscripcion.id] = inscripcion.est_pagado === 1;
        obsInitial[inscripcion.id] = inscripcion.obs || "";
      });
      setEstPresente(presenteInitial);
      setEstPagado(pagadoInitial);
      setObs(obsInitial);
    } catch (error) {
      console.log(error);
    }
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

  const eliminarInscripcion = async (id) => {
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
      const { data } = await clienteAxios.delete(`/crud/inscripciones/${id}`, config);
      msgOk(data.msg);
      obtenerInscripciones();
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

  const actualizarInscripcionCheckbox = async (id, field, value) => {
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

      const updateData = {
        [field]: value ? 1 : 0,
      };

      const { data } = await clienteAxios.put(
        `/crud/inscripciones/${id}`,
        updateData,
        config
      );

      msgOk(data.msg);
      obtenerInscripciones(); // Actualiza la lista después de realizar los cambios
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };

  const handleCheckboxChange = (id, field) => {
    const newState = field === "est_presente" ? { ...est_presente } : { ...est_pagado };
    newState[id] = !newState[id];

    if (field === "est_presente") {
      setEstPresente(newState);
    } else {
      setEstPagado(newState);
    }

    actualizarInscripcionCheckbox(id, field, newState[id]);
  };

  const actualizarInscripcionObservacion = async (id, obsValue) => {
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

      const updateData = { obs: obsValue };

      const { data } = await clienteAxios.put(
        `/crud/inscripciones/${id}`,
        updateData,
        config
      );

      msgOk(data.msg);
      obtenerInscripciones();
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleObsChange = (id, value) => {
    setObs((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const filteredInscripciones = inscripciones.filter((val) => {
    if (!busqueda) return val;
    return (
      val.rut.toLowerCase().includes(busqueda.toLowerCase()) ||
      val.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      val.ape_paterno.toLowerCase().includes(busqueda.toLowerCase()) ||
      val.ape_materno.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredInscripciones.length / itemsPerPage);
  const paginasInscripciones = filteredInscripciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredInscripciones, totalPages, currentPage]);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sortData = (column) => {
    const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);

    const sortedData = [...inscripciones].sort((a, b) => {
      if (newDirection === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });

    setInscripciones(sortedData);
  };

  const exportToExcel = () => {
    // Transformar los datos para incluir "SI" o "NO" en lugar de valores booleanos
    const transformedData = inscripciones.map((inscripcion) => ({
      RUT: inscripcion.rut,
      Nombres: inscripcion.nombres,
      "Apellido Paterno": inscripcion.ape_paterno,
      "Apellido Materno": inscripcion.ape_materno,
      Email: inscripcion.email,
      Presente: est_presente[inscripcion.id] ? "SI" : "NO",
      Pagado: est_pagado[inscripcion.id] ? "SI" : "NO",
      Observación: inscripcion.obs || "",
    }));
  
    // Crear hoja de cálculo y libro
    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    
    // Añadir la hoja al libro y exportar
    XLSX.utils.book_append_sheet(workbook, worksheet, "inscripciones");
    XLSX.writeFile(workbook, "inscripciones.xlsx");
  };

  return (
    <>
      <div className="mx-auto">
        <h6 className="font-black text-gray-800 text-xl mb-2">Listado Personas Eventos</h6>

        <div className="bg-white shadow rounded-lg p-3 mb-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="sede-label">Sede</InputLabel>
              <Select
                labelId="sede-label"
                id="sede"
                value={id_sede}
                onChange={(e) => setSede(e.target.value)}
                label="Sede"
              >
                <MenuItem value="" disabled>
                  Seleccionar Sede...
                </MenuItem>
                {sedes.map((sede) => (
                  <MenuItem key={sede.id} value={sede.id}>
                    {sede.nom_sede}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="evento-label">Evento</InputLabel>
              <Select
                labelId="evento-label"
                id="evento"
                value={id_evento}
                onChange={(e) => setEvento(e.target.value)}
                label="Evento"
              >
                <MenuItem value="" disabled>
                  Seleccionar Evento...
                </MenuItem>
                {eventos.map((evento) => (
                  <MenuItem key={evento.id} value={evento.id}>
                    {evento.nom_evento}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              id="busqueda"
              label="Buscar por RUT, Nombre o Apellido"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              margin="dense"
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-2">
     
          {inscripciones.length > 0 && id_evento > 0 ?  <>
            <div className="flex justify-between items-center mb-1">
            <h6 className="font-black text-gray-800 text-lg">Personas Inscritas (Total: {inscripciones.length})</h6>
            <Tooltip title="Descargar Excel">
            <button className="bg-green-900 hover:bg-green-800 px-6 py-1 text-white rounded-md " onClick={exportToExcel}>
            <DescriptionTwoToneIcon/>
            </button>
            </Tooltip>

          </div>

          {/* Vista para pantallas pequeñas como tarjetas */}
          <div className="block md:hidden">
            {paginasInscripciones.map((inscripcion) => (
              <div key={inscripcion.id} className="border rounded-lg p-4 mb-4 bg-white shadow-md">
                <div className="mb-1">
                  <strong>RUT:</strong> {inscripcion.rut}
                </div>
                <div className="mb-1">
                  <strong>Nombres:</strong> {inscripcion.nombres}
                </div>
                <div className="mb-1">
                  <strong>Apellido Paterno:</strong> {inscripcion.ape_paterno}
                </div>
                <div className="mb-1">
                  <strong>Apellido Materno:</strong> {inscripcion.ape_materno}
                </div>
                <div className="mb-1">
                  <strong>Email:</strong> {inscripcion.email}
                </div>
                <div className="mb-1 flex items-center">
                  <strong>Presente:</strong>
                  <Checkbox
                    checked={est_presente[inscripcion.id]}
                    onChange={() => handleCheckboxChange(inscripcion.id, "est_presente")}
                    className="ml-2"
                  />
                  <strong>Pagado:</strong>
                  <Checkbox
                    checked={est_pagado[inscripcion.id]}
                    onChange={() => handleCheckboxChange(inscripcion.id, "est_pagado")}
                    className="ml-2"
                  />
                </div>
             
                <div className="mb-1">
                  <strong>Observación:</strong>
                  <TextField
                    value={obs[inscripcion.id] || ""}
                    onChange={(e) => handleObsChange(inscripcion.id, e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    className="py-1 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                    onClick={() => actualizarInscripcionObservacion(inscripcion.id, obs[inscripcion.id])}
                  >
                    Guardar
                  </button>
                  <button
                    className="py-1 px-4 bg-red-500 text-white rounded-md hover:bg-red-700"
                    onClick={() => {
                      setEliminar(inscripcion.id);
                      handleClickOpen();
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Vista para pantallas medianas y grandes con tabla */}
          <div className="hidden md:block overflow-x-auto rounded-xl">
            <table className="min-w-full table-auto border-collapse border text-center border-gray-300">
              <thead>
                <tr className="bg-cyan-950 text-center text-white">
                  <th className="px-4 font-semibold cursor-pointer" onClick={() => sortData("rut")}>
                    RUT {sortColumn === "rut" && (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 font-semibold cursor-pointer" onClick={() => sortData("nombres")}>
                    Nombres {sortColumn === "nombres" && (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 font-semibold cursor-pointer" onClick={() => sortData("ape_paterno")}>
                    Apellido Paterno {sortColumn === "ape_paterno" && (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 font-semibold cursor-pointer" onClick={() => sortData("ape_materno")}>
                    Apellido Materno {sortColumn === "ape_materno" && (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 font-semibold cursor-pointer" onClick={() => sortData("email")}>
                    Email {sortColumn === "email" && (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 font-semibold">Presente</th>
                  <th className="px-4 font-semibold">Pagado</th>
                  <th className="px-4 font-semibold">Observación</th>
                  <th className="px-4"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginasInscripciones.map((inscripcion) => (
                  <tr key={inscripcion.id} className="hover:bg-gray-200">
                    <td className="px-4 py-2 text-sm">{inscripcion.rut}</td>
                    <td className="px-4 py-2 text-sm">{inscripcion.nombres}</td>
                    <td className="px-4 py-2 text-sm">{inscripcion.ape_paterno}</td>
                    <td className="px-4 py-2 text-sm">{inscripcion.ape_materno}</td>
                    <td className="px-4 py-2 text-sm">{inscripcion.email}</td>
                    <td className="px-4 py-2 text-sm">
                      <Checkbox
                        checked={est_presente[inscripcion.id]}
                        onChange={() => handleCheckboxChange(inscripcion.id, "est_presente")}
                      />
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <Checkbox
                        checked={est_pagado[inscripcion.id]}
                        onChange={() => handleCheckboxChange(inscripcion.id, "est_pagado")}
                      />
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <TextField
                        value={obs[inscripcion.id] || ""}
                        onChange={(e) => handleObsChange(inscripcion.id, e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                    </td>
                    <td className="px-4 py-1 flex items-center gap-2 justify-end mr-20">
                
                      <button
                        className="py-1 text-blue-500 hover:text-blue-800"
                        onClick={() => actualizarInscripcionObservacion(inscripcion.id, obs[inscripcion.id])}
                      >
                        <SaveAsTwoToneIcon />
                      </button>
                      <button
                        className="py-1 text-red-500 hover:text-red-800"
                        onClick={() => {
                          setEliminar(inscripcion.id);
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
          </>  
              : <div className="text-center p-6 font-semibold text-cyan-700">Sin Inscripciones</div>  }
      
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
          <p>¿Realmente desea eliminar esta inscripción?</p>
          {eliminar && (
            <div className="mt-2">
              <p><strong>RUT:</strong> {filteredInscripciones.find(i => i.id === eliminar)?.rut}</p>
              <p><strong>Nombre:</strong> {filteredInscripciones.find(i => i.id === eliminar)?.nombres}</p>
              <p><strong>Apellido Paterno:</strong> {filteredInscripciones.find(i => i.id === eliminar)?.ape_paterno}</p>
              <p><strong>Apellido Materno:</strong> {filteredInscripciones.find(i => i.id === eliminar)?.ape_materno}</p>
            </div>
          )}
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
            onClick={() => eliminarInscripcion(eliminar)}
          >
            Eliminar
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetEvento;
