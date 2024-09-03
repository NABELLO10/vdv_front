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


const Usuarios = () => {
  const { auth } = useAuth();  
  const { clientes, ciudades } = useAdicionales();

  const [id_cliente, setCliente] = useState(auth.id_cliente);

  const [perfiles, setPerfiles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("");
  const [estado, setEstado] = useState(1);

  const [busqueda, setBusqueda] = useState("");
  const [edit, setEdit] = useState("");
  const [id, setID] = useState(null);
  const [eliminar, setEliminar] = useState("");

  //Lista de usuarios registrados
  const [usuarios, setUsuarios] = useState([]);

  //PARA EDICION de un usuario
  const [usuario, setUsuario] = useState({});

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    obtenerPerfiles();
    obtenerUsuarios();
  }, [id_cliente]);


  //PAGINACION Y ORDEN ---------------------------------------------------
    
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
   
  const itemsPerPage = 5;

  const sortData = (column) => {
    const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
  
    const sortedData = [...usuarios].sort((a, b) => {
      if (newDirection === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
  
    setUsuarios(sortedData);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

    // Filtrar las usuarios según la búsqueda
    const filteredUsuarios = usuarios.filter((val) => {
      if (!busqueda) return val;
      return val.nom_usuario.toLowerCase().includes(busqueda.toLowerCase());
    });

      // Calcular la paginación después del filtro
    const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
    const paginasUsuarios = filteredUsuarios.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );    

    // Resetear la página actual si se cambia la búsqueda y no hay suficientes elementos
    useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(1);
      }
    }, [filteredUsuarios, totalPages, currentPage]);
  
   //-----------------------------------------------------------------------


  const obtenerPerfiles = async () => {
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
        `/crud/perfil/${id_cliente}`,
        config
      );
      setPerfiles(data);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerUsuarios = async () => {
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
        `/crud/obtener-usuarios/${id_cliente}`,
        config
      );
      setUsuarios(data);
    } catch (error) {
      console.log(error);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setEmail("");
    setPerfil("");
    setEdit("");
    setUsuario({});
    setID(null);
    obtenerUsuarios();
  };


  const setEdicion = (usuario) => {
    setEdit(usuario);
    
    setNombre(usuario.nom_usuario);
    setEmail(usuario.email);
    setPerfil(usuario.id_perfil);
    setEstado(usuario.est_activo);
    setID(usuario.id);
  };

  const eliminarUsuario = async (id) => {
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
        `crud/registrar/${id}`,
        config
      );

      msgOk(data.msg);     
      limpiarFormulario();

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
    if ([nombre, email, perfil].includes("")) {
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
          `/crud/registrar/${edit.id}`,
          {
            nombre: nombre,
            id_cliente,
            email,
            id_perfil: perfil,
            est_activo: estado,
          },
          config
        );

        msgOk(data.msg);
      } else {
        const { data } = await clienteAxios.post(
          "/crud/registrar",
          {
            nombre,
            email,
            id_cliente,
            id_perfil: perfil,
            est_activo: estado,
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

  return (
    <>
    <div className="mx-auto">
      <h6 className="font-black text-gray-800 text-xl mb-2">Usuarios</h6>

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
                id="nom_usuario"
                label="Nombre Usuario"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
              />
            </FormControl>

            <FormControl fullWidth margin="dense" size="small">
              <TextField
                id="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
              />
            </FormControl>

            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="ciudad-label">Perfil</InputLabel>
              <Select
                labelId="pefil-label"
                id="perfiles"
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
                label="Email"
              >
                <MenuItem value="" disabled>
                  Perfil...
                </MenuItem>
                {perfiles.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nom_perfil}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
    
            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                id="estado"
                value={estado}
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
          label="Buscar Usuario"
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
                  onClick={() => sortData("nombre")}
                >
                  Usuario{" "}
                  {sortColumn === "nombre" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 font-semibold cursor-pointer  hover:text-cyan-600"
                  onClick={() => sortData("email")}
                >
                  Email{" "}
                  {sortColumn === "email" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 font-semibold cursor-pointer  hover:text-cyan-600"
                  onClick={() => sortData("mae_perfile.nom_perfil")}
                >
                  Perfil{" "}
                  {sortColumn === "mae_perfile.nom_perfil" &&
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
              {paginasUsuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-200">
                  <td className="px-4 py-2 text-sm">{usuario.nom_usuario}</td>
                  <td className="px-4 py-2 text-sm">
                    {usuario.email}
                  </td>
                  <td className="px-4 py-2 text-sm">{usuario.mae_perfile.nom_perfil}</td>

                  <td className="px-4 py-2 text-sm">
                    {usuario.est_activo ? (
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
                      onClick={() => setEdicion(usuario)}
                      className="py-1  text-blue-600 hover:text-blue-900"
                    >
                      <EditTwoToneIcon />
                    </button>

                    <button
                      className="py-1 text-red-500 hover:text-red-800 "
                      onClick={() => {
                        setEliminar(usuario.id);
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
        <p>¿Realmente desea eliminar esta usuario?</p>
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
          onClick={() => eliminarUsuario(eliminar)}
        >
          Eliminar
        </button>
      </DialogActions>
    </Dialog> 

    </div>

   
  </>
  );
};

export default Usuarios;
