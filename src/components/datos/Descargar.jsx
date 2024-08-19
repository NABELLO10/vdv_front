// src/components/DownloadButton.js
import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Tooltip from '@mui/material/Tooltip';
import PictureAsPdfSharpIcon from '@mui/icons-material/PictureAsPdfSharp';

const DownloadButton = ({ data }) => {

  const filteredData = data.map(item => ({
    'RUT': item.rut,
    'Nombre Personal': item.nom_personal,
    'Apellido Paterno': item.ape_paterno,
    'Apellido Materno': item.ape_materno,
    'Email': item.email,
    'Comuna': item.mae_comuna?.nom_comuna,
    'Cargo': item.mae_cargo?.nom_cargo,
    'Empresa': item.mae_empresas_sistema?.nom_empresa,
    'Instalacion': item.mov_instalaciones_cliente?.nombre,
    'Inicio Contrato': item.fec_inicio_contrato ? new Date(item.fec_inicio_contrato).toLocaleDateString('es-ES') : '',
    'Termino Contrato': item.fec_termino_contrato ? new Date(item.fec_termino_contrato).toLocaleDateString('es-ES') : '',

  }));

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `FichaPersonal.xlsx`);
  };

  return (
    <div className="flex justify-end gap-1">
      <Tooltip title="Descargar Excel">
      <button
        className="bg-green-900 hover:bg-green-700 transition-all rounded-md duration-200 px-6 text-xs "
        onClick={handleDownloadExcel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-file-spreadsheet"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#7bc62d"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
          <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
          <path d="M8 11h8v7h-8z" />
          <path d="M8 15h8" />
          <path d="M11 11v7" />
        </svg>
      </button>
      </Tooltip>

    </div>
  );
};

export default DownloadButton;
