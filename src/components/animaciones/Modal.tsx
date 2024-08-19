import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';

import Documentos from '../../pages/mantenedores/Documentos';
import MovimientoPersonal from '../../pages/mantenedores/MovimientoPersonal';
import Turnos from '../../pages/mantenedores/Turnos';
import Finanzas from '../../pages/mantenedores/Finanzas';
import EPP from '../../pages/mantenedores/EPP';

export default function Modal({funcion, tipo, edit}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(()=>{   
  },[])

  return (
    <div>
      <Button onClick={handleClickOpen}>
        <AddCircleTwoToneIcon  />
      </Button>
      <Dialog fullWidth={true} maxWidth="md" open={open} onClose={handleClose}>
        <DialogContent>
          {tipo == 1 && (
            <Documentos
              handleClose={handleClose}
              funcion={funcion}
              edit={edit}
            />
          )}
          {/*    {tipo == 2 && <MovimientoPersonal edit={edit} />}
          {tipo == 3 && <Turnos edit={edit} />}
          {tipo == 4 && <Finanzas edit={edit} />} */}
          {tipo == 5 && (
            <EPP edit={edit} funcion={funcion} handleClose={handleClose} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
