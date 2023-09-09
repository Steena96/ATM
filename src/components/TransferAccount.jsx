import React, { useState } from "react";

function TransferAccount({ customers, onTransfer }) {
  const [senderAccount, setSenderAccount] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");

  const getAccountApi = (accountNumber) => {
    return new Promise((resolve, reject) => {
      const requestBody = {
        accNO: parseInt(accountNumber),
      };
      const apiUrl = "http://localhost:5050/api/getAccountBalance";

      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([requestBody]),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          resolve(data.accountBalance);
        })
        .catch((error) => {
          console.error("Error fetching account balance:", error);
          reject(error);
        });
    });
  };

  const updateAccApi = (accountNumber, finalAmount) => {
    const apiAmt = "http://localhost:5050/api/updateAccountBalance";
    fetch(apiAmt, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        accNO: parseInt(accountNumber),
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
  };

  const handleTransfer = async () => {
    let senderVal = 0;
    let receiverVal = 0;
    try {
      await getAccountApi(senderAccount)
        .then((senderBalance) => {
          senderVal = senderBalance;
        })
        .catch((error) => {
          console.error("Failed to get sender account balance:", error);
        });

      await getAccountApi(receiverAccount)
        .then((recieverBalance) => {
          receiverVal = recieverBalance;
        })
        .catch((error) => {
          console.error("Failed to get sender account balance:", error);
        });

      const transferAmount = parseFloat(amount);

      // Calculate new balances
      const newSenderBalance = senderVal - transferAmount;
      const newReceiverBalance = receiverVal + transferAmount;
      await updateAccApi(senderAccount, newSenderBalance);
      await updateAccApi(receiverAccount, newReceiverBalance);

      setSenderAccount("");
      setReceiverAccount("");
      setAmount("");
    } catch (error) {
      console.error("Error during transfer:", error);
      alert("Error during transfer. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col gap-10 p-6">
      <div className="flex flex-row gap-6 pl-[0.8rem]">
        <label className="font-bold text-sm pb-4 w-full">
          Sender Account Number:
        </label>
        <input
          type="text"
          value={senderAccount}
          onChange={(e) => setSenderAccount(e.target.value)}
          style={{
            border: "1px solid #ccc",
            width: "200px",
            height: "38px",
            borderRadius: "3px",
            padding: "10px",
          }}
        />
      </div>
      <div className="flex flex-row gap-6">
        <label className="font-bold text-sm pb-4 w-full">
          Receiver Account Number:
        </label>
        <input
          type="text"
          value={receiverAccount}
          onChange={(e) => setReceiverAccount(e.target.value)}
          style={{
            border: "1px solid #ccc",
            width: "200px",
            height: "38px",
            borderRadius: "3px",
            padding: "10px",
          }}
        />
      </div>
      <div className="flex flex-row gap-6 pl-[6.2rem]">
        <label className="font-bold text-sm pb-4 w-full">Amount (₹):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            border: "1px solid #ccc",
            width: "200px",
            height: "38px",
            borderRadius: "3px",
            padding: "10px",
          }}
        />
      </div>
      <div className="pl-6 pb-6 items-end justify-end flex">
        <button
          className="w-44 h-[2.2rem] flex justify-center items-center bg-[#109CF1] rounded-sm text-white"
          onClick={handleTransfer}
        >
          Transfer Amount
        </button>
      </div>
    </div>
  );
}

export default TransferAccount;
