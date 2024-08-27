import * as React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MenuIcon from "@mui/icons-material/Menu";

import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TuneIcon from '@mui/icons-material/Tune';
import ApartmentTwoToneIcon from '@mui/icons-material/ApartmentTwoTone';
import SecurityTwoToneIcon from '@mui/icons-material/SecurityTwoTone';
import AddModeratorTwoToneIcon from '@mui/icons-material/AddModeratorTwoTone';
import ViewCarouselTwoToneIcon from '@mui/icons-material/ViewCarouselTwoTone';
type Anchor = "left";
import CorporateFareTwoToneIcon from '@mui/icons-material/CorporateFareTwoTone';
import PersonSearchTwoToneIcon from '@mui/icons-material/PersonSearchTwoTone';
import EngineeringTwoToneIcon from '@mui/icons-material/EngineeringTwoTone';
import CarRentalTwoToneIcon from '@mui/icons-material/CarRentalTwoTone';
import CommuteTwoToneIcon from '@mui/icons-material/CommuteTwoTone';
import TimeToLeaveTwoToneIcon from '@mui/icons-material/TimeToLeaveTwoTone';
import Groups2TwoToneIcon from '@mui/icons-material/Groups2TwoTone';
import MapsHomeWorkTwoToneIcon from '@mui/icons-material/MapsHomeWorkTwoTone';
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import SourceTwoToneIcon from '@mui/icons-material/SourceTwoTone';
import PriceChangeTwoToneIcon from '@mui/icons-material/PriceChangeTwoTone';
import EventBusyTwoToneIcon from '@mui/icons-material/EventBusyTwoTone';
import PointOfSaleTwoToneIcon from '@mui/icons-material/PointOfSaleTwoTone';
import Diversity3TwoToneIcon from '@mui/icons-material/Diversity3TwoTone';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';


const menuConfig = [
  { name: "Sedes", href: "/admin/sedes", icono: <ApartmentTwoToneIcon /> },
  { name: "Perfiles", href: "/admin/perfil", icono: <TuneIcon /> },
  { name: "Usuarios", href: "/admin/usuarios", icono: <PeopleAltIcon /> }, 

];

const menuFinanzas = [  
  { name: "Feriados", href: "/admin/feriados", icono: <EventBusyTwoToneIcon /> },
  { name: "Proveedores", href: "/admin/proveedores", icono: <Diversity3TwoToneIcon /> },
 // { name: "Clientes", href: "/admin/clientes", icono: <Groups2TwoToneIcon /> },
  { name: "Proceso", href: "/admin/tipo-proceso-finanzas", icono: <PriceChangeTwoToneIcon /> },
  { name: "Finanzas", href: "/admin/mov-finanzas", icono: <PointOfSaleTwoToneIcon /> },
];

const menuRRHH = [
  { name: "Feriados", href: "/admin/feriados", icono: <EventBusyTwoToneIcon /> },
  { name: "Clientes", href: "/admin/clientes", icono: <Groups2TwoToneIcon /> }, 
  { name: "Instalaciones", href: "/admin/instalaciones", icono: <MapsHomeWorkTwoToneIcon /> },
  { name: "Tipo Seguro", href: "/admin/tipo-seguro", icono: <AddModeratorTwoToneIcon  /> },
  { name: "Seguros", href: "/admin/seguros", icono: <SecurityTwoToneIcon /> },
  { name: "Cargos", href: "/admin/cargos", icono: <ViewCarouselTwoToneIcon /> },
  { name: "Areas", href: "/admin/areas", icono: <CorporateFareTwoToneIcon /> },
  { name: "Tipo Docto. Personal", href: "/admin/tipo-docto-personal", icono: <CorporateFareTwoToneIcon /> },
  { name: "Tipo EPP", href: "/admin/tipoEpp", icono: <EngineeringTwoToneIcon /> },
  { name: "Ficha Personal", href: "/admin/ficha-personal", icono: <PersonSearchTwoToneIcon /> },
  { name: "Item Permiso", href: "/admin/tipo-mov-personal", icono: <SourceTwoToneIcon /> },
  { name: "Permisos", href: "/admin/mov-personal", icono: <SourceTwoToneIcon /> },  
];

const menuOperaciones = [  
  { name: "Tipo Vehiculo", href: "/admin/tipoVehiculo", icono: <CommuteTwoToneIcon /> },
  { name: "Vehiculos", href: "/admin/vehiculos", icono: <TimeToLeaveTwoToneIcon /> },
 /*  { name: "Gestión Vehiculos", href: "/admin/gestion-vehiculos", icono: <CarRentalTwoToneIcon /> },  */
  { name: "Maestro Turnos", href: "/admin/turnos", icono: <PunchClockTwoToneIcon /> },
  { name: "Asignar Turnos", href: "/admin/mov-turnos", icono: <BadgeTwoToneIcon /> },
 /*  { name: "Iniciar / Cerrar ", href: "/admin/turnos-guardias", icono: <PersonSearchTwoToneIcon /> }, */
];


const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `0px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.7rem",  color: "white" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "#1D1D1D", // Cambio a azul marino
  color: "white", // Cambio el color del texto a blanco
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));


const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  //borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function Sidebar({auth}) {
  const [state, setState] = React.useState({
    left: false,
  });

  const [expanded, setExpanded] = React.useState<string | false>("");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

/*    const handleSidebarClose = (event: React.MouseEvent) => {
    const isAccordionButton =
      event.currentTarget.tagName === "BUTTON" &&
      event.currentTarget.getAttribute("aria-controls") === "mantenedores-header";
      event.currentTarget.getAttribute("aria-controls") === "config-header";
      event.currentTarget.getAttribute("aria-controls") === "rrhh-header";
      event.currentTarget.getAttribute("aria-controls") === "operaciones-header";
      if (!isAccordionButton) {
        toggleDrawer("left", false)(event);
      }
  };  */
  const handleSidebarClose = (event: React.MouseEvent) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.getAttribute("aria-controls")
    ) {
      return;
    }
    toggleDrawer("left", false)(event);
  };
   

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        marginTop: 0,
        width: 250,
      }}
      role="presentation"
      onClick={handleSidebarClose} 
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {/* {menuGlobal.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>{item.icono}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        </Link>
      ))} */}
     
     {(auth.id_perfil == 1 || auth.id_perfil == 2 || auth.id_perfil == 4) &&   <Accordion
        expanded={expanded === "config"}
        onChange={handleChange("config")}
      >
        <AccordionSummary
          aria-controls="config-content"
          id="config-header"
          onClick={(e) => e.stopPropagation()} // Avoid closing Sidebar when clicking the Accordion
        >
          <Typography > Configuracion</Typography>
        </AccordionSummary>
        <AccordionDetails  style={{ backgroundColor:"#E8E8E8"}}>
          <List>
            {menuConfig.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{ textDecoration: "none", color: "#4F4F4F" }}
                onClick={toggleDrawer("left", false)}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icono}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
}

    {(auth.id_perfil == 1 || auth.id_perfil == 2 || auth.id_perfil == 4 || auth.id_perfil == 7)  &&   <Accordion
        expanded={expanded === "mantenedores"}
        onChange={handleChange("mantenedores")}
      >
        <AccordionSummary
          aria-controls="mantenedores-content"
          id="mantenedores-header"
          onClick={(e) => e.stopPropagation()} // Avoid closing Sidebar when clicking the Accordion
        >
          <Typography>Finanzas</Typography>
        </AccordionSummary>
        <AccordionDetails  style={{ backgroundColor:"#E8E8E8"}}>
          <List>
            {menuFinanzas.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{ textDecoration: "none", color: "inherit" }}
               /*  onClick={toggleDrawer("left", false)} */
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icono}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </AccordionDetails>
      </Accordion> }
    

      {(auth.id_perfil == 1 || auth.id_perfil == 2 || auth.id_perfil == 4 || auth.id_perfil == 6)  &&   <Accordion
        expanded={expanded === "rrhh"}
        onChange={handleChange("rrhh")}
      >
        <AccordionSummary
          aria-controls="rrhh-content"
          id="rrhh-header"
          onClick={(e) => e.stopPropagation()} // Avoid closing Sidebar when clicking the Accordion
        >
          <Typography> RRHH</Typography>
        </AccordionSummary>
        <AccordionDetails  style={{ backgroundColor:"#E8E8E8"}}>
          <List>
            {menuRRHH.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={toggleDrawer("left", false)}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icono}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </AccordionDetails>
      </Accordion> }
      
      {( auth.id_perfil == 1 || auth.id_perfil == 2 || auth.id_perfil == 4 || auth.id_perfil == 8)  &&  <Accordion
        expanded={expanded === "operaciones"}
        onChange={handleChange("operaciones")}
      >
        <AccordionSummary
          aria-controls="operaciones-content"
          id="operaciones-header"
          sx={{ fontSize: "0.9rem", color: "white" }}
          onClick={(e) => e.stopPropagation()} // Avoid closing Sidebar when clicking the Accordion
        >
          <Typography> Operaciones</Typography>
        </AccordionSummary>
        <AccordionDetails  style={{ backgroundColor:"#E8E8E8"}}>
          <List>
            {menuOperaciones.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={toggleDrawer("left", false)}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icono}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>  }

     
    </Box>
  );

  return (
    <div>
       <Button sx={{ color: "black" }} onClick={toggleDrawer("left", true)}>
        <MenuIcon />
      </Button>

      <Drawer
        anchor="left"
        open={state.left}
        onClose={toggleDrawer("left", false)}
        onClick={handleSidebarClose}
        sx={{ '& .MuiDrawer-paper': { backgroundColor: '#4F4F4F', color: 'white' } }} // Estilo para cambiar el color de fondo y texto
      >
        {list("left")}
      </Drawer>
    </div>
  );
}
