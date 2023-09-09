import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Select from "react-select";
function ATM() {
  const [denominations, setDenominations] = useState([]);
  const [newDenomination, setNewDenomination] = useState(null);
  const [newNumber, setNewNumber] = useState(null);
  const [atmData, setAtmData] = useState([]);

  const handleNumberChange = (e) => {
    const inputValue = Number(e.target.value);
    setNewNumber(inputValue);
  };
  useEffect(() => {
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
        setAtmData(data[0].amount);
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const addDenomination = () => {
    if (newDenomination && newNumber) {
      const updatedDenominations = [
        ...denominations,
        { denomination: newDenomination, number: newNumber },
      ];
      setDenominations(updatedDenominations);
      setNewDenomination("");
      setNewNumber("");
    }
  };

  const loadToATM = () => {
    if (denominations.length > 0) {
      const updatedAtmData = atmData.slice();
      denominations.forEach((item) => {
        const existingDenominationIndex = updatedAtmData.findIndex(
          (d) => d.denomination === item.denomination
        );

        if (existingDenominationIndex !== -1) {
          updatedAtmData[existingDenominationIndex].number += item.number;
        } else {
          updatedAtmData.push({
            denomination: item.denomination,
            number: item.number,
          });
        }
      });
      setAtmData(updatedAtmData);
      setDenominations([]);
      //toalcash
      let totalValue = 0;
      updatedAtmData?.forEach((item) => {
        totalValue += item?.denomination * item?.number;
      });
      const apiUrl = "http://localhost:5050/api/updateAtmCash";
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          amount: updatedAtmData,
          total_cash: totalValue,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setAtmData(data[0].amount);
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  const calculateTotalValue = () => {
    let totalValue = 0;
    atmData?.forEach((item) => {
      totalValue += item?.denomination * item?.number;
    });
    return totalValue;
  };

  const denominationsColumnDefs = [
    { headerName: "Denomination", field: "denomination", width: 250 },
    { headerName: "Number", field: "number", width: 250 },
  ];

  const atmColumnDefs = [
    { headerName: "Denomination", field: "denomination", width: 320 },
    { headerName: "Number", field: "number", width: 320 },
    {
      headerName: "Total Value",
      valueGetter: (params) => params.data?.denomination * params.data?.number,
      width: 320,
    },
  ];

  return (
    <div className="flex flex-col items-start justify-start pl-96 bg-[#EBEFF2] h-screen w-[100%] overflow-auto gap-10">
      <h1 className="flex flex-start items-start justify-start w-[52%] text-[26px] font-medium pt-10 mb-[-1.5rem]">
        ATM Cash
      </h1>

      <div className=" bg-slate-50 bg-opacity-80 rounded-[10px] border border-slate-300 border-dashed w-[50%] p-10">
        <div className="flex flex-row gap-10 items-center justify-center">
          <div className="flex flex-col">
            <h2 className="pb-4">Add Denomination:</h2>
            <Select
              value={
                newDenomination
                  ? {
                      value: newDenomination,
                      label: newDenomination.toString(),
                    }
                  : null
              }
              onChange={(selectedOption) =>
                setNewDenomination(
                  selectedOption ? Number(selectedOption.value) : null
                )
              }
              options={[
                { value: 2000, label: "2000" },
                { value: 500, label: "500" },
                { value: 100, label: "100" },
              ]}
            />
          </div>
          <div className="flex flex-col">
            <h2 className="pb-4">Add Numbers:</h2>
            <input
              type="number"
              placeholder="Number"
              value={newNumber}
              onChange={handleNumberChange}
              style={{
                border: "1px solid #ccc",
                width: "200px",
                height: "38px",
                borderRadius: "3px",
                padding: "10px",
              }}
            />
          </div>
          <div className="pt-10">
            <button
              className="w-20 h-[2.2rem] flex justify-center items-center bg-[#109CF1] rounded-sm text-white"
              onClick={addDenomination}
            >
              Add
            </button>
          </div>
        </div>
        <div className="pt-10 flex justify-center items-center">
          <div className="ag-theme-alpine" style={{ height: 150, width: 500 }}>
            <AgGridReact
              columnDefs={denominationsColumnDefs}
              rowData={denominations}
            />
          </div>
        </div>

        <div className="pt-4 pr-8 items-end justify-end flex ">
          <button
            className="w-44 h-[2.2rem] flex justify-center items-center bg-[#109CF1] rounded-sm text-white"
            onClick={loadToATM}
          >
            Load to ATM
          </button>
        </div>
      </div>
      <div className=" bg-slate-50 bg-opacity-80 rounded-[10px] border border-slate-300 border-dashed w-[80%] p-10">
        <div className="flex flex-col pt-10">
          <div className="flex flex-row justify-between pb-6">
            <h2>ATM Cash</h2>
            <p>Total Cash: {calculateTotalValue()}</p>
          </div>
          <div
            className="ag-theme-alpine"
            style={{ height: 300, width: "100%" }}
          >
            <AgGridReact columnDefs={atmColumnDefs} rowData={atmData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ATM;
