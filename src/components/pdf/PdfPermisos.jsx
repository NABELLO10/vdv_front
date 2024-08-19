import React, { useState, useEffect } from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import 'pdfmake/build/vfs_fonts'
import LocalPrintshopTwoToneIcon from "@mui/icons-material/LocalPrintshopTwoTone";

const PdfPermisos = ({ data }) => {
  const [base64Image, setBase64Image] = useState(null);

  
  pdfMake.vfs = pdfMake.vfs;

  useEffect(() => {
    getBase64Image("/nombre1.png");
  }, []);

  function getBase64Image(imgUrl) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        setBase64Image(reader.result); // Actualiza el estado con la imagen en base64
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", imgUrl);
    xhr.responseType = "blob";
    xhr.send();
  }

  function formatearFecha(fecha) {
    const [year, month, day] = fecha.split("-");
    return `${day}-${month}-${year}`;
  }

  const createPdf = () => {
    const documentDefinition = {
      content: [     
        {
          // Estructura de columnas para las imágenes
          columns: [
            [
              {
                text: `Comprobante N°: ${data.id}`,
                style: "tableBody",
                colSpan: 1,
                alignment: "left",
                fontSize: 12,
                bold: true,
                                
              },
              {},
              {},
            ],
            {
              // Espacio vacío entre las imágenes
              text: '',
              width: '*'
            },
            {
              // Columna para la imagen de la derecha
              image: base64Image,
              width: 70, // Ajusta el tamaño según necesites
              alignment: 'right'
            }
          ]
        },
        {
          text: "Comprobante de Permisos",
          style: "header",
        },
  
        {
          style: "tableExample",
          table: {
            widths: ["*", "*", "*"],
            body: [
        
              [
                {
                  text: `En el Cumplimiento de las disposiciones legales se deja constancia del siguiente permiso: `,
                  style: "tableBody",
                  colSpan: 3,
                  alignment: "left",
                },
                {},
                {},
              ],
              [
                {
                  text: ` Nombre: ${
                    data.mae_ficha_personal.nom_personal +
                    " " +
                    data.mae_ficha_personal.ape_paterno +
                    " " +
                    data.mae_ficha_personal.ape_materno
                  } `,
                  bold: true,
                  colSpan: 2,
                  style: "tableBody",
                },
                {},
                {
                  text: `RUT: ${data.mae_ficha_personal.rut}`,
                  bold: true,
                  colSpan: 1,
                  style: "tableBody",
                },
              ],
              [
                {
                  text: `Inicio: ${formatearFecha(data.fec_inicio)}`,
                  style: "tableBody",
                  border: [false, false, false, true],
                },
                {
                  text: `Días Habiles: ${data.dias_habiles}`,
                  style: "tableBody",
                  border: [false, false, false, true],
                },
                {
                  text: `Periodo: ${data.mae_periodo.nom_periodo}`,
                  style: "tableBody",
                  border: [false, false, false, true],
                },
              ],
              [
                {
                  text: `Termino: ${formatearFecha(data.fec_termino)}`,
                  style: "tableBody",
                  border: [false, true, false, false],
                },
                {
                  text: `Días Corridos: ${data.dias_corridos}`,
                  style: "tableBody",
                  border: [false, true, false, false],
                },
                {
                  text: `Anulado: ${data.est_anulado == 0 ? "NO" : "SI"}`,
                  style: "tableBody",
                  border: [false, true, false, false],
                },
              ],
              [
                { text: `Detalle: ${data.obs ? data.obs : "Sin Detalle"}`, style: "tableBody", colSpan: 3 },
                {},
                { text: " ", colSpan: 1 },
              ],
            ],
          },
          layout: "noBorders",
        },
  
        {
          columns: [
            {
              width: "50%",
              text: "_________________________\nFirma Trabajador",
              style: "signature",
            },
            {
              width: "50%",
              text: "_________________________\nFirma Empleador",
              style: "signature",
            },
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: "center",
          margin: [0, 20, 0, 0],
          color: "#0133CD",
        },
        subheader: {
          fontSize: 16,
          bold: true,
  
          margin: [0, 30, 0, 10],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "white",
  
          margin: [0, 7, 0, 7], // left, top, right, bottom
        },
        tableBody: {
          margin: [0, 10, 0, 10], // left, top, right, bottom
        },
        signature: {
          bold: true,
          margin: [0, 100, 0, 0],
          alignment: "center",
          color: "#000000",
        },
      },
      defaultStyle: {
        columnGap: 20,
        /* font: "Roboto", */
      },
    };

    pdfMake.createPdf(documentDefinition).download("comprobante_vacaciones.pdf");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <button onClick={createPdf}>
        <LocalPrintshopTwoToneIcon />
      </button>
    </div>
  );
};

export default PdfPermisos;
