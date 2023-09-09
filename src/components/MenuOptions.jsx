import React, { useState } from "react";
import WithdrawalAmount from "../components/WithdrawAmount";
import AtmBalance from "./AtmBalance";
import TransferAccount from "./TransferAccount";
import customerData from "./CustomerData";
const handleTransfer = (sender, receiver, amount) => {
  if (!sender || !receiver) {
    alert("Sender or receiver not found in the customer list.");
    return;
  }

  const senderAccountBalance = parseFloat(sender.accountBalance);
  const receiverAccountBalance = parseFloat(receiver.accountBalance);
  const transferAmount = parseFloat(amount);

  if (
    isNaN(senderAccountBalance) ||
    isNaN(receiverAccountBalance) ||
    isNaN(transferAmount)
  ) {
    alert("Invalid account balance or transfer amount.");
    return;
  }

  // Check if sender has sufficient balance
  if (senderAccountBalance < transferAmount) {
    alert("Insufficient balance in sender's account.");
    return;
  }

  // Calculate new balances
  const newSenderBalance = senderAccountBalance - transferAmount;
  const newReceiverBalance = receiverAccountBalance + transferAmount;

  // Update sender and receiver balances
  sender.accountBalance = newSenderBalance;
  receiver.accountBalance = newReceiverBalance;
  localStorage.setItem("customerData", JSON.stringify(customerData));
};

function MenuOptions({
  selectedOption,
  handleMenuOption,
  balance,
  withdrawalAmount,
  setWithdrawalAmount,
  atmBalance,
  atmDenominations,
  accountNumber,
  setBalance,
}) {
  // Function to update the account balance
  const updateAccountBalance = (accountNumber, newBalance) => {
    customerData.forEach((customer) => {
      if (customer.accNo === accountNumber) {
        customer.accountBalance = newBalance;
      }
    });

    localStorage.setItem("customerData", JSON.stringify(customerData));
  };

  // Function to update the ATM balance
  const updateAtmBalance = (newBalance) => {
    localStorage.setItem("totalValue", newBalance.toString());
  };
  return (
    <div className="flex flex-row gap-6 w-[60%]">
      <div className="w-[30%] flex flex-col gap-10">
        <div>
          <button
            className={`bg-sky-500 text-white px-4 py-2 rounded mr-4 ${
              selectedOption === "Check Balance" ? "bg-sky-800" : ""
            }`}
            onClick={() => handleMenuOption("Check Balance")}
          >
            Check Balance
          </button>
        </div>

        <div>
          <button
            className={`bg-sky-500 text-white px-4 py-2 rounded mr-4 ${
              selectedOption === "Withdraw Money" ? "bg-sky-800" : ""
            }`}
            onClick={() => handleMenuOption("Withdraw Money")}
          >
            Withdraw Money
          </button>
        </div>

        <div>
          <button
            className={`bg-sky-500 text-white px-4 py-2 rounded mr-4 ${
              selectedOption === "Atm Balance" ? "bg-sky-800" : ""
            }`}
            onClick={() => handleMenuOption("Atm Balance")}
          >
            ATM Balance
          </button>
        </div>

        <div>
          <button
            className={`bg-sky-500 text-white px-4 py-2 rounded mr-4 ${
              selectedOption === "Transfer Amount" ? "bg-sky-800" : ""
            }`}
            onClick={() => handleMenuOption("Transfer Amount")}
          >
            Transfer Amount
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-row  bg-slate-50 bg-opacity-80 rounded-[10px] border border-slate-300 border-dashed h-[100%] overflow-auto">
        {selectedOption === "" && (
          <div className="w-full text-center p-6">
            <p>Select an option to view details.</p>
          </div>
        )}
        {selectedOption === "Check Balance" && (
          <div className="w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              Balance for Account Number: {accountNumber}
            </h2>
            <p>₹ {balance}</p>
          </div>
        )}

        {selectedOption === "Withdraw Money" && (
          <WithdrawalAmount
            accountNumber={accountNumber}
            atmBalance={atmBalance}
            balance={balance} // Pass the balance state as a prop
            updateAccountBalance={updateAccountBalance}
            updateAtmBalance={updateAtmBalance}
            customerData={customerData}
            setBalance={setBalance}
          />
        )}

        {selectedOption === "Atm Balance" && (
          <div>
            <AtmBalance />
          </div>
        )}

        {selectedOption === "Transfer Amount" && (
          <div>
            <TransferAccount
              customers={customerData}
              onTransfer={handleTransfer}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default MenuOptions;
