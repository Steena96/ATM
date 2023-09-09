import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../global.css";

function CustomerDetails() {
  const [customers, setCustomers] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    const apiUrl = "http://localhost:5050/api/getCustomers";
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const columnDefs = [
    { headerName: "Acc No", field: "accNO" },
    {
      headerName: "Account Holder",
      field: "accountHolder",
      cellStyle: { color: "#109CF1" },
    },
    { headerName: "Pin Number", field: "pinNumber" },
    { headerName: "Account Balance", field: "accountBalance" },
  ];

  return (
    <div className="flex flex-col items-start justify-start pl-96 bg-[#EBEFF2] h-screen w-[100%] p-10">
      <h1 className="flex flex-start items-start justify-start w-[52%] text-[26px] font-medium pb-6">
        Customer Details
      </h1>
      <div
        className="ag-theme-alpine ag-header-group-cel"
        style={{ height: 700, width: 800 }}
      >
        <AgGridReact
          onGridReady={onGridReady}
          columnDefs={columnDefs}
          rowData={customers}
        />
      </div>
    </div>
  );
}

export default CustomerDetails;
