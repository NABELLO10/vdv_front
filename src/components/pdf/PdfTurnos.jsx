import React, { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import Tooltip from "@mui/material/Tooltip";
import AssessmentTwoToneIcon from "@mui/icons-material/AssessmentTwoTone";
import pdfMake from "pdfmake/build/pdfmake";

import moment from "moment";

import 'pdfmake/build/vfs_fonts';

const PdfTurnos = ({ turnos, desde, hasta }) => {
  const [feriados, setFeriados] = useState([]);

  pdfMake.vfs = pdfMake.vfs;
  
  useEffect(() => {
    obtenerFeriados();

  }, []);


  async function getImageBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const obtenerFeriados = async () => {
    try {
      const token = localStorage.getItem("token_vdv");

      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios(`/general/obtenerFeriados`, config);

      setFeriados(data.map((r) => r.fecha));
    } catch (error) {
      console.log(error);
    }
  };

  const generateHeaderDates = (startDateStr, endDateStr) => {
    const headerDates = [];

    // Convertimos las fechas a formato YYYY, MM, DD
    const [startYear, startMonth, startDay] = startDateStr
      .split("-")
      .map((str) => parseInt(str, 10));
    const [endYear, endMonth, endDay] = endDateStr
      .split("-")
      .map((str) => parseInt(str, 10));

    // Creamos las fechas ya considerando la zona horaria local
    let currentDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    while (currentDate <= endDate) {
      headerDates.push(
        currentDate.toLocaleDateString("es-CL", {
          day: "2-digit",
          month: "short",
        })
      );
      /* currentDate.setDate(currentDate.getDate() + 1); */
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );
    }
    return headerDates;
  };

  function shouldAddPageBreak(
    currentNode,
    followingNodesOnPage,
    nodesOnNextPage,
    previousNodesOnPage
  ) {
    return (
      currentNode.id &&
      currentNode.id.startsWith("table_") &&
      followingNodesOnPage.some((node) => node.text === " ")
    );
  }

  const chunkArray = (array, chunk_size) => {
    const results = [];
    while (array.length) {
      results.push(array.splice(0, chunk_size));
    }
    return results;
  };

  let currentRowCount = 0;
  const ROWS_PER_PAGE = 10; // Este es un valor estimado. Ajusta según tus observaciones.

  function shouldAddPageBreak(currentNode) {
    if (currentNode.id && currentNode.id.startsWith("table_")) {
      // Estima el número de filas de la tabla actual
      const currentTableRows = currentNode.table.body.length;

      if (currentRowCount + currentTableRows > ROWS_PER_PAGE) {
        currentRowCount = currentTableRows; // Restablecer el recuento de filas para la siguiente página
        return true; // Agregar salto de página
      } else {
        currentRowCount += currentTableRows; // Agregar al recuento de filas actuales
        return false;
      }
    }
    return false;
  }

  const generatePDF = async () => {
  /*    const isWeekendOrHoliday = (date) => {
      const formattedDate = date.toISOString().split("T")[0];
      console.log(formattedDate)
      return (
        date.getDay() === 6 ||
        date.getDay() === 0 ||
        feriados.includes(formattedDate)
      );
    };  */

    const isWeekendOrHoliday = (date) => {
    
      // Asegúrate de que date es un objeto Date válido
      if (!(date instanceof Date) || isNaN(date)) {
        console.error('Fecha no válida:', date);
        return false;      }
    
      // Formatear la fecha actual para que solo contenga mes y día (MM-DD)
      const formattedDate = date.toISOString().split("T")[0].slice(5);
    
        // Comprobar si es fin de semana
      if (date.getDay() === 6 || date.getDay() === 0) {
        return true;
      }
    
      // Comprobar si es un feriado
      return feriados.some(feriado => {   
        // Verifica que la fecha del feriado exista y tenga el formato adecuado  
        return feriado.slice(5) === formattedDate;
      });
    };
     
    

    const getDatesForRange = (startDate, endDate) => {
      const dateArray = [];
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1
        );
      }
      return dateArray;
    };

    const generateRowsForDays = (dates) => {
      const uniquePersonas = [
        ...new Set(turnos.map((t) => t.mae_usuario.nom_usuario)),
      ];
      const rows = [];

      for (const personaName of uniquePersonas) {
        const personaTurnos = turnos.filter(
          (t) => t.mae_usuario.nom_usuario === personaName
        );
        const row = [{ text: personaName }];

        for (let i = 0; i < dates.length; i++) {
          const isHolidayOrWeekend = isWeekendOrHoliday(dates[i]);

          const movimiento = personaTurnos.find(
            (m) => m.fec_turno == dates[i].toISOString().split("T")[0]
          );

          let textContent = movimiento ? movimiento.mae_turno.abrev_turno : "L";

          // Establecer colores según el estado de est_extra y est_falla
          let cellColor;
          if (movimiento && movimiento.est_extra) {
            cellColor = "#4CAF50"; // Verde para extra
          } else if (movimiento && movimiento.est_falla) {
            cellColor = "#FF5722"; // Rojo medio para falta
          } else if (isHolidayOrWeekend) {
            cellColor = "#FFB6B6"; // Rojo claro para fin de semana o feriado
          }

          row.push({
            text: textContent,
            fillColor: cellColor,
          });
        }
        rows.push(row);
      }
      return rows;
    };

    const [year, month, day] = desde.split("-").map(Number);
    const fromDate = new Date(year, month - 1, day); // Restamos 1 al mes porque los meses en JavaScript van de 0 a 11.

    const [yearTo, monthTo, dayTo] = hasta.split("-").map(Number);
    const toDate = new Date(yearTo, monthTo - 1, dayTo);
    
    const headerDates = generateHeaderDates(desde, hasta);

    // Luego, vamos a generar las fechas
    const allDatesInRange = getDatesForRange(fromDate, toDate);

    const logoBase64 = await getImageBase64("/nombre1.png");

    const allDatesInRangeChunks = chunkArray(allDatesInRange, 15); // Dividimos las fechas en bloques de 15 días
    const headerDatesChunks = chunkArray(headerDates, 15); // Hacemos lo mismo con las cabeceras de fechas
    const rowsChunks = [];
    
    for (let i = 0; i < allDatesInRangeChunks.length; i++) {
      rowsChunks.push(generateRowsForDays(allDatesInRangeChunks[i]));
    }

    const contentArray = [
      {
        image: logoBase64,
        width: 80,
        alignment: "right",
      },
      {
        text: `Asignación de turnos: ${moment(desde).format(
          "DD/MM/YYYY"
        )} - ${moment(hasta).format("DD/MM/YYYY")}`,
        style: "header",
      },
    ];

    for (let i = 0; i < headerDatesChunks.length; i++) {
      contentArray.push({
        table: {
          widths: [90, ...Array(headerDatesChunks[i].length).fill("*")],
          body: [[""].concat(headerDatesChunks[i]), ...rowsChunks[i]],
        },
        layout: {
          hLineWidth: function (i) {
            return 0.5;
          },
          vLineWidth: function (i) {
            return 0.5;
          },
          id: `table_${i}`,
        },
      });

      if (i < headerDatesChunks.length - 1)
        contentArray.push({ text: " ", margin: [0, 1] }); // Espacio entre tablas  // Espacio entre tablas */
    }

    const docDefinition = {
      pageSize: "LETTER",
      pageOrientation: "landscape",
      content: contentArray,
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          margin: [20, 0, 0, 10],
        },
        //sacar cuando se suba a seridir
        /* defaultStyle: {
          font: 'Roboto'
        } */
      },
      pageBreakBefore: shouldAddPageBreak,
    };

    pdfMake.createPdf(docDefinition).download(`Asignación de turnos: ${moment(desde).format(
      "DD/MM/YYYY"
    )} - ${moment(hasta).format("DD/MM/YYYY")}`);
  };

  return (
    <div className="">
      <Tooltip title="Exportar">
        <button
          className="bg-red-700 p-3 text-white rounded-lg hover:bg-red-900"
          onClick={generatePDF}
        >
          <AssessmentTwoToneIcon />
        </button>
      </Tooltip>
    </div>
  );
};

export default PdfTurnos;
