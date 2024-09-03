import { useEffect, useState } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";
import { format } from 'date-fns';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import storage from "../../components/firebaseConfig";

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
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import { Tooltip } from "@mui/material";

const Eventos = () => {
  const { auth } = useAuth();
  const [id_cliente, setCliente] = useState(auth.id_cliente);
  const [id_sede, setSede] = useState("");
  const [nom_evento, setNomEvento] = useState("");
  const [fecha, setFecha] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm")); 
  const [detalle, setDetalle] = useState("");
  const [total_cupos, setTotalCupos] = useState("");
  const [fonoEncargado, setFonoEncargado] = useState("");
  const [est_activo, setEstActivo] = useState(1);

  const [imagen, setImagen] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [eliminar, setEliminar] = useState("");
  const [sedes, setSedes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [edit, setEdit] = useState({});
  const [openDetalle, setOpenDetalle] = useState(false);
  const [eventoDetalle, setEventoDetalle] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

   //ARCHIVOS A FIREBASE
   const [files, setFiles] = useState([]);
   const [percent, setPercent] = useState(0);
   const [uploadedFiles, setUploadedFiles] = useState([]);
   //BUSQUEDA EN GRILLA

  const itemsPerPage = 5;

  useEffect(() => {
    obtenerSedes()
  }, []);

  useEffect(() => {
    if (id_sede > 0) {
      obtenerEventos();
    }
  }, [id_sede]);

  const sortData = (column) => {
    const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);

    const sortedData = [...eventos].sort((a, b) => {
      if (newDirection === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });

    setEventos(sortedData);
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

  const limpiarFormulario = () => {
    setNomEvento("");
    setFecha(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    setDetalle("");
    setEstActivo(1)
    setEliminar("");
    setTotalCupos("");
    setFonoEncargado("")
    setImagen(null);
    setEdit({});
    obtenerEventos();
  };

  const setEdicion = (evento) => {
    setEdit(evento);
    setNomEvento(evento.nom_evento);
    setFonoEncargado(evento.fono_encargado)
    setSede(evento.id_sede);
    setEstActivo(evento.est_activo)
    setFecha(evento.fecha);
    setDetalle(evento.detalle);
    setTotalCupos(evento.total_cupos);
    setImagen(null); // No se puede obtener la imagen, solo se permite cambiarla.
  };


  const eliminarEvento = async (id) => {
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
      const { data } = await clienteAxios.delete(`/crud/eventos/${id}`, config);
      obtenerEventos();
      handleClose();

      msgOk(data.msg);

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
    if ([nom_evento, id_sede, fecha, detalle, total_cupos].includes("")) {
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
          `/crud/eventos/${edit.id}`,
          {
            nom_evento,
            fecha,
            detalle,
            fono_encargado : fonoEncargado,
            //imagen,
            id_sede,
            total_cupos,
            est_activo,
          },
          config
        );
        msgOk(data.msg);
      } else {
        const { data } = await clienteAxios.post(
          "/crud/eventos",
          {
            nom_evento,
            fecha,
            detalle,
            //imagen,
            fono_encargado : fonoEncargado,
            id_sede,
            total_cupos,
            est_activo,
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



  function handleDelete(nom_docto, id) {

    const storageRef = ref(
      storage,
      `/${infoModal.nombre}/${nom_docto}`
    );
    deleteObject(storageRef)
      .then(() => {
        eliminarArchivo(id)
        console.log("File deleted successfully");      
      
      })
      .catch((error) => {
        console.error("Error deleting file: ", error);
      });             
      obtenerDoctosInstalacion()
      msgError("Archivo eliminado")
      obtenerDoctosInstalacion();
  } 


  const registrarDocto = async (url, nombre_docto) => {
    try {

      const token = localStorage.getItem("token_emsegur");

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

      await clienteAxios.post(
        "/crud/docto-instalacion",
        {
          id_instalacion: infoModal.id,
          url,
          nom_docto : nombre_docto
        },
        config
      ); 

      msgOk("Archivo cargado");
      obtenerDoctosInstalacion()
      setIsLoading(false)

    
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };


  function handleChange(event) {
    setFiles(event.target.files);
  }


  function handleUpload() {  

    if (files.length === 0) {
      msgError("Seleccione archivos");
      return;
    }

    setIsLoading(true)
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const storageRef = ref(
        storage,
        `/${infoModal.nombre}/${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            // update uploadedFiles with prevState
            setUploadedFiles((prevState) => [...prevState, file]);
            setPercent(0);
            // registrar(file.name, file.type, url)
            registrarDocto(url, file.name);
          });
        }
      );

      if(i == files.length){
        setIsLoading(false)        
      }
    }

    setFiles([]);
  }


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

  const handleOpenDetalle = (evento) => {
    setEventoDetalle(evento);
    setOpenDetalle(true);
  };

  const handleCloseDetalle = () => {
    setOpenDetalle(false);
    setEventoDetalle(null);
  };

  const filteredEventos = eventos.filter((val) => {
    if (!busqueda) return val;
    return val.nom_evento.toLowerCase().includes(busqueda.toLowerCase());
  });

  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);
  const paginasEventos = filteredEventos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredEventos, totalPages, currentPage]);

  return (
    <>
      <div className="mx-auto">
        <h6 className="font-black text-gray-800 text-xl mb-2">Eventos</h6>

        <div className="bg-white shadow rounded-lg p-3 mb-3">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                <TextField
                  id="nom_evento"
                  label="Nombre del Evento"
                  value={nom_evento}
                  onChange={(e) => setNomEvento(e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FormControl>

              <FormControl fullWidth margin="dense" size="small">
                <TextField
                  id="fecha"
                  label="Fecha"
                  type="datetime-local"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>

              <FormControl fullWidth margin="dense" size="small">
                <TextField
                  id="total_cupos"
                  label="Total de Cupos"
                  value={total_cupos}
                  onChange={(e) => setTotalCupos(e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="number"
                />
              </FormControl>
              <FormControl fullWidth margin="dense" size="small">
                <TextField
                  id="fonoEncargado"
                  label="Fono Encargado"
                  value={fonoEncargado}
                  onChange={(e) => setFonoEncargado(e.target.value)}
                  variant="outlined"
                  placeholder="Formato 569XXXXXXXX"
                  fullWidth
                  size="small"
                  type="number"
                />
              </FormControl>
            </div>

            <div className="grid grid-cols-1 ">
              {/*       <FormControl fullWidth margin="dense" size="small">
                <TextField
                  id="imagen"
                  label="Imagen"
                  onChange={(e) => setImagen(e.target.files[0])}
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="file"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl> */}

              <FormControl fullWidth margin="dense" size="small">
                <TextField
                  id="detalle"
                  label="Detalle"
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FormControl>
            </div>

            <div className="mt-1 lg:flex justify-end gap-2">
              <input
                type="submit"
                value={edit.id ? "Actualizar" : "Registrar"}
                className="bg-cyan-950 hover:bg-cyan-600 duration-100 w-full lg:w-auto py-1 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer px-10"
              ></input>

              <button
                type="button"
                onClick={limpiarFormulario}
                className="bg-gray-600 hover:bg-gray-700 duration-100 lg:flex w-full lg:w-auto py-1 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer px-10"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-2">
          <TextField
            id="busqueda"
            label="Buscar Evento"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            margin="dense"
          />
          <div className="overflow-x-auto rounded-xl ">
            <table className="min-w-full table-auto border-collapse border text-center border-gray-300">
              <thead>
                <tr className="bg-cyan-950 text-center text-white">
                  <th
                    className="px-4 font-semibold cursor-pointer hover:text-cyan-600"
                    onClick={() => sortData("nom_evento")}
                  >
                    Evento{" "}
                    {sortColumn === "nom_evento" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 font-semibold cursor-pointer hover:text-cyan-600"
                    onClick={() => sortData("mae_sede.nom_sede")}
                  >
                    Sede{" "}
                    {sortColumn === "mae_sede.nom_sede" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 font-semibold cursor-pointer hover:text-cyan-600"
                    onClick={() => sortData("fecha")}
                  >
                    Fecha{" "}
                    {sortColumn === "fecha" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 font-semibold cursor-pointer hover:text-cyan-600"
                    onClick={() => sortData("total_cupos")}
                  >
                    Cupos{" "}
                    {sortColumn === "total_cupos" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  {/*    <th className="px-4">Detalle</th> */}
                  <th className="px-4">Fono Encargado</th>
                  <th className="px-4">Imagen</th>
                  <th className="px-4"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginasEventos.map((evento) => (
                  <tr key={evento.id} className="hover:bg-gray-200">
                    <td className="px-4 py-2 text-sm">{evento.nom_evento}</td>
                    <td className="px-4 py-2 text-sm">
                      {evento.mae_sede.nom_sede}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {" "}
                      {format(new Date(evento.fecha), "dd-MM-yyyy HH:mm")}
                    </td>
                    <td className="px-4 py-2 text-sm">{evento.total_cupos}</td>
                    <td className="px-4 py-2 text-sm">
                      {evento.fono_encargado}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {evento.imagen ? (
                        <a
                          href={evento.imagen}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver Imagen
                        </a>
                      ) : (
                        "No disponible"
                      )}
                    </td>
                    <td className="px-4 py-1 flex gap-2 justify-end mr-20">
                      <button
                        type="button"
                        onClick={() => setEdicion(evento)}
                        className="py-1 text-blue-600 hover:text-blue-900"
                      >
                        <EditTwoToneIcon />
                      </button>

                      <button
                        className="py-1 text-red-500 hover:text-red-800"
                        onClick={() => {
                          setEliminar(evento.id);
                          handleClickOpen();
                        }}
                      >
                        <DeleteTwoToneIcon />
                      </button>
                      <Tooltip title="Detalles">
                        <button
                          type="button"
                          onClick={() => handleOpenDetalle(evento)}
                          className="py-1 text-blue-600 hover:text-blue-900"
                        >
                          <VisibilityTwoToneIcon />
                        </button>{" "}
                      </Tooltip>
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
          <p>¿Realmente desea eliminar este evento?</p>
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
            onClick={() => eliminarEvento(eliminar)}
          >
            Eliminar
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={openDetalle}
        onClose={handleCloseDetalle}
        aria-labelledby="detalle-dialog-title"
        aria-describedby="detalle-dialog-description"
      >
        <DialogContent>
          {eventoDetalle && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {eventoDetalle.nom_evento}
              </h2>
              <p>
                <strong>Fecha:</strong> {eventoDetalle.fecha}
              </p>
              <p>
                <strong>Detalle:</strong> {eventoDetalle.detalle}
              </p>
              <p>
                <strong>Cupos:</strong> {eventoDetalle.total_cupos}
              </p>
              <p>
                <strong>Sede:</strong> {eventoDetalle.mae_sede.nom_sede}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <button
            className="bg-gray-500 px-4 py-1 rounded-md text-white hover:bg-gray-600"
            onClick={handleCloseDetalle}
          >
            Cerrar
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Eventos;
