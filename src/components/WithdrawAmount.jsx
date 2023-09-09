import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
function WithdrawAmount({
  accountNumber,
  atmBalance,
  balance,
  updateAccountBalance,
  updateAtmBalance,
  customerData,
  setBalance,
}) {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [dispensedNotes, setDispensedNotes] = useState([]);
  const [remainingDenominations, setRemainingDenominations] = useState([]);

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
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const calculateTotalCashInATM = () => {
    return remainingDenominations.reduce(
      (total, denomination) =>
        total + denomination.denomination * denomination.number,
      0
    );
  };

  const handleWithdraw = () => {
    const amount = parseInt(withdrawalAmount);
    const balanceAmt = parseInt(balance);
    const finalAmount = balanceAmt - amount;
    setBalance(finalAmount);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }

    const updatedCustomerData = [...customerData];
    const customerIndex = updatedCustomerData.findIndex(
      (customer) => customer.accNo === parseInt(accountNumber)
    );

    if (customerIndex !== -1) {
      const customer = updatedCustomerData[customerIndex];

      if (customer.accountBalance >= amount) {
        // Subtract withdrawalAmount from the account balance
        customer.accountBalance -= amount;

        // Update account balance
        const updatedAccountBalance = customer.accountBalance;
        updateAccountBalance(accountNumber, updatedAccountBalance);

        let remainingAmount = amount;
        let dispensed = [];
        const updatedDenominations = [...remainingDenominations];

        for (let i = 0; i < updatedDenominations.length; i++) {
          const denomination = updatedDenominations[i];
          const { denomination: value, number: count } = denomination;

          if (remainingAmount <= 0) break;

          while (remainingAmount >= value && count > 0) {
            dispensed.push(`${value} x 1`);
            remainingAmount -= value;
            denomination.number -= 1;
          }
        }

        if (remainingAmount === 0) {
          setDispensedNotes(dispensed);
          setRemainingDenominations(updatedDenominations);

          // Update ATM balance
          const updatedAtmBalance = calculateTotalCashInATM();
          updateAtmBalance(updatedAtmBalance);
          const apiUrl = "http://localhost:5050/api/updateAtmCash";
          fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
            body: JSON.stringify({
              amount: updatedDenominations,
              total_cash: updatedAtmBalance,
            }),
          }).catch((error) => {
            console.error("Error fetching data:", error);
          });

          const apiAmt = "http://localhost:5050/api/updateAccountBalance";
          fetch(apiAmt, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
            body: JSON.stringify({
              accNO: accountNumber,
              accountBalance: finalAmount,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Success:", data);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        } else {
          alert(
            "Unable to dispense the requested amount. Please try a different amount."
          );
        }
      } else {
        alert("Insufficient balance in the account.");
      }
    } else {
      alert("Account not found in customer data.");
    }
  };

  const columnDefs = [{ headerName: "Note", field: "note", width: 400 }];

  const rowData = dispensedNotes.map((note, index) => ({
    note,
  }));
  const columnDef = [
    { headerName: "Denomination", field: "denomination" },
    { headerName: "Number", field: "number" },
  ];

  const denominationData = remainingDenominations.map(
    (denomination, index) => ({
      denomination: `${denomination.denomination}₹`,
      number: denomination.number,
    })
  );
  return (
    <div className="p-6 pl-10">
      <h1 className="text-sm font-bold pb-4">
        Enter the Amount to be withdrawed:
      </h1>
      <div className="flex flex-row gap-4">
        <input
          type="number"
          placeholder="Enter withdrawal amount"
          value={withdrawalAmount}
          onChange={(e) => setWithdrawalAmount(e.target.value)}
          style={{
            border: "1px solid #ccc",
            width: "200px",
            height: "38px",
            borderRadius: "3px",
            padding: "10px",
          }}
        />
        <div className="pr-8 pb-6 items-end justify-end flex ">
          <button
            className="w-44 h-[2.2rem] flex justify-center items-center bg-[#109CF1] rounded-sm text-white"
            onClick={handleWithdraw}
          >
            Withdraw Amount
          </button>
        </div>
      </div>
      <div className="pb-6">
        <h2 className="font-bold text-sm pb-4">Dispensed Notes:</h2>
        <div
          className="ag-theme-alpine"
          style={{ height: "200px", width: "93%" }}
        >
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            domLayout="autoHeight"
          />
        </div>
        {/* <ul>
          {dispensedNotes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul> */}
      </div>
      <div className="pb-6">
        <h2 className="font-bold text-sm pb-4">Remaining Denominations:</h2>
        <ul>
          <div
            className="ag-theme-alpine"
            style={{ height: "200px", width: "93%" }}
          >
            <AgGridReact
              columnDefs={columnDef}
              rowData={denominationData}
              domLayout="autoHeight"
            />
          </div>
          {/* {remainingDenominations.map((denomination, index) => (
            <li
              key={index}
            >{`${denomination.denomination}₹: ${denomination.number}`}</li>
          ))} */}
        </ul>
      </div>
      <div className="pb-6 flex flex-row gap-3 items-center pt-6">
        <h2 className="font-bold text-sm">Total Cash in ATM:</h2>
        <p>{calculateTotalCashInATM()}₹</p>
      </div>
      <div className="pb-6 flex flex-row gap-3 items-center">
        <h2 className="font-bold text-sm">Account Balance:</h2>
        <p>{balance}₹</p> {/* Display the account balance here */}
      </div>
    </div>
  );
}

export default WithdrawAmount;
