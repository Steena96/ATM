import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function AtmBalance() {
  const [atmData, setATMData] = useState([]);
  const [totatAmt, setTotalAmt] = useState(0);
  useEffect(() => {
    let totalAmount = 0;
    for (const denomination of atmData) {
      totalAmount += denomination.denomination * denomination.number;
    }
    const apiUrl = "http://localhost:5050/api/getAtmCash";
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setATMData(data[0].amount);
          setTotalAmt(data[0].total_cash);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const columnDefs = [
    { headerName: "Denomination", field: "denomination", width: 150 },
    { headerName: "Number", field: "number", width: 100 },
    {
      headerName: "Value",
      valueGetter: (params) => params.data.denomination * params.data.number,
      width: 100,
    },
  ];

  const rowData = atmData.map((item, index) => ({
    denomination: item.denomination,
    number: item.number,
  }));

  return (
    <div className="w-full flex flex-col justify-center items-center p-6 pt-4">
      <div
        className="ag-theme-alpine"
        style={{ height: "200px", width: "100%" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          domLayout="autoHeight"
        />
      </div>
      <div>
        <p className="p-6">Total Amount available in the ATM : {totatAmt}₹</p>
      </div>
    </div>
  );
}

export default AtmBalance;
