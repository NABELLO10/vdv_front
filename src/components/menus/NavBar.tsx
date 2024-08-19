import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import Sidebar from "./Sidebar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import useAuth from "../../hooks/useAuth";
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';

function NavBar() {
  const { auth, cerrarSesion } = useAuth();

  const [id_perfil, setPerfil] = React.useState(auth.id_perfil)

  React.useEffect(() => {
    setPerfil(auth.id_perfil);
  }, [auth]);


  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ color: "#000000", backgroundColor: "#FFFFFF" }} //vdv
      // sx={{ color: "#ff9800", backgroundColor: "#000020" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            VDVAPP
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "flex", alignItems: "center" },
            }}
          >
            
            {auth.id_perfil == 3 || auth.id_perfil == 19 ? "" :  <Sidebar auth={auth}  />}      


            <div className="hover:bg-gray-700 text-white  bg-black p-2  rounded-lg"> 
          {/*   <div className="hover:bg-blue-800  p-2  rounded-lg"> */}
              <Tooltip title="I N I C I O">
                <Link to="/admin">
                  <HomeTwoToneIcon />
                </Link>
              </Tooltip>
            </div>
          </Box>

          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 1,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontSize: 17,
            }}
          >
            {auth.nom_usuario}
          </Typography>

          <Typography
           
            noWrap
            sx={{
              mr: 0,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            VDVAPP
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Modificar Perfil">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircleIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Link
                to="/admin/actualizar-password"
                className="block px-4 font-bold py-2 text-sm text-black hover:bg-blue-200"
              >
                Cambiar Contraseña
              </Link>

              <Link
                className="block px-4 font-bold py-2 text-sm text-black hover:bg-blue-200"
                onClick={cerrarSesion}
                to="/"
              >
                Cerrar Sesion
              </Link>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
