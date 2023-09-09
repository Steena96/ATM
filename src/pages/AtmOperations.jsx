import React, { useState, useEffect } from "react";
import customerData from "../components/CustomerData";
import WithdrawAmount from "../components/WithdrawAmount";
import AtmBalance from "../components/AtmBalance";
import TransferAccount from "../components/TransferAccount";
import AccountLogin from "../components/AccountLogin";
import MenuOptions from "../components/MenuOptions";
function ATMOperations() {
  const [accountNumber, setAccountNumber] = useState("");
  const [pinNumber, setPinNumber] = useState("");
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [balance, setBalance] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [atmBalance, setAtmBalance] = useState(0); // Initialize with 0
  const [atmDenominations, setAtmDenominations] = useState({});
  const [showAtmBalance, setShowAtmBalance] = useState(false);
  const updateAccountBalance = (accountNumber, newBalance) => {
    // Find the customer and update their balance in customerData
    const customerToUpdate = customerData.find(
      (customer) => customer.accNo === parseInt(accountNumber)
    );
    if (customerToUpdate) {
      customerToUpdate.accountBalance = newBalance;
    }
  };

  const updateAtmBalance = (newAtmBalance) => {
    setAtmBalance(newAtmBalance);
  };

  function calculateWithdrawalDenominations(amount) {
    const denominations = [];

    // Check if the amount is divisible by 2000
    if (amount >= 2000 && amount % 2000 === 0) {
      const count = amount / 2000;
      for (let i = 0; i < count; i++) {
        denominations.push("2000");
      }
      amount = 0; // Set amount to zero as it's fully covered by 2000s
    }

    // Check if the amount is divisible by 500
    if (amount >= 500 && amount % 500 === 0) {
      const count = amount / 500;
      for (let i = 0; i < count; i++) {
        denominations.push("500");
      }
      amount = 0; // Set amount to zero as it's fully covered by 500s
    }

    // Use 100s for the remaining amount
    while (amount >= 100) {
      denominations.push("100");
      amount -= 100;
    }

    if (amount !== 0) {
      // The amount couldn't be represented with the available denominations
      return [];
    }

    return denominations;
  }

  // Save ATM balance and denominations to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("atmBalance", atmBalance.toString());
    localStorage.setItem("atmDenominations", JSON.stringify(atmDenominations));
  }, [atmBalance, atmDenominations]);

//   Load account number from local storage on component mount
  useEffect(() => {
    const savedAccountNumber = localStorage.getItem("accountNumber");
    if (savedAccountNumber) {
      setAccountNumber(savedAccountNumber);
    }
  }, []);

  //   const validateAccount = () => {
  //     const foundCustomer = customerData.find(
  //       (customer) =>
  //         customer.accNo === parseInt(accountNumber) &&
  //         customer.pinNumber === parseInt(pinNumber)
  //     );

  //     if (foundCustomer) {
  //       // Account is valid, show the menu
  //       setShowMenu(true);
  //       setError("");

  //       // Save account number to local storage
  //     //   localStorage.setItem("accountNumber", accountNumber);
  //     } else {
  //       setError("Invalid account number or PIN.");
  //     }
  //   };
  // const apiUrl = "http://localhost:5050/api/updateAtmCash";
  // // Fetch data from the Express.js API when the component mounts
  // fetch(apiUrl, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Cache-Control": "no-cache",
  //   },
  //   body: JSON.stringify({ amount: updatedAtmData,total_cash:totalValue }),
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     setAtmData(data[0].amount);
  //     console.log("Success:", data);
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching data:", error);
  //   });
  const validateAccount = () => {
    const requestBody = {
      accNO: parseInt(accountNumber), // Parse to integer if needed
      pinNumber: parseInt(pinNumber), // Parse to integer if needed
    };
    const apiUrl = "http://localhost:5050/api/authenticate";
    // Make a POST request to the server to validate the account
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([requestBody]), // Wrap in an array to match server-side code
    })
      .then((response) => response.text()) // Expecting a plain text response
      .then((data) => {
        if (data === "exist") {
          // Account is valid, show the menu
          setShowMenu(true);
          setError("");

          // Save account number to local storage
          localStorage.setItem("accountNumber", accountNumber);
        } else {
          setError("Invalid account number or PIN.");
        }
      })
      .catch((error) => {
        console.error("Error validating account:", error);
      });
  };

  const handleMenuOption = (option) => {
    setSelectedOption(option);
    setWithdrawalAmount("");
    if (option === "Check Balance") {
      const requestBody = {
        accNO: parseInt(accountNumber), // Parse to integer if needed
      };
      console.log(requestBody);
      console.log(accountNumber);
      const apiUrl = "http://localhost:5050/api/getAccountBalance";

      console.log(
        "Making API request to get account balance with requestBody:",
        requestBody
      );

      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([requestBody]), // Wrap the requestBody in an array
      })
        .then((response) => {
          console.log("API response status:", response.status);
          return response.json();
        })
        .then((data) => {
          console.log("API response data:", data);
          // Check if the data contains the account balance

          setBalance(data.accountBalance); // Set the balance in your component state
          console.log("Balance:", data.accountBalance);
        })
        .catch((error) => {
          console.error("Error fetching account balance:", error);
          setError("Failed to fetch account balance.");
        });
    }

    // if (option === "Check Balance") {
    //     console.log('kjkjl')
    //   const foundCustomer = customerData.find(
    //     (customer) =>
    //       customer.accNo === parseInt(accountNumber) &&
    //       customer.pinNumber === parseInt(pinNumber)
    //   );
    //   if (foundCustomer) {
    //     setBalance(foundCustomer.accountBalance);
    //   }
    // }

    if (option === "Withdraw Money") {
      const requestBody = {
        accNO: parseInt(accountNumber), // Parse to integer if needed
      };
      const apiUrl = "http://localhost:5050/api/getAccountBalance";

      console.log(
        "Making API request to get account balance with requestBody:",
        requestBody
      );

      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([requestBody]), // Wrap the requestBody in an array
      })
        .then((response) => {
          console.log("API response status:", response.status);
          return response.json();
        })
        .then((data) => {
          console.log("API response data:", data);
          // Check if the data contains the account balance

          setBalance(data.accountBalance); // Set the balance in your component state
          setAccountNumber(data.accNO);
          console.log("Balance:", data.accNO);
        })
        .catch((error) => {
          console.error("Error fetching account balance:", error);
          setError("Failed to fetch account balance.");
        });
    }
    if (option === "Atm Balance") {
      const foundCustomer = customerData.find(
        (customer) =>
          customer.accNo === parseInt(accountNumber) &&
          customer.pinNumber === parseInt(pinNumber)
      );

      if (foundCustomer) {
        // Show the AtmBalance component when the login validation matches
        setShowAtmBalance(true);
        setBalance(foundCustomer.accountBalance);
      }
    } else {
      setShowAtmBalance(false); // Hide the AtmBalance component for other menu options
    }
    if (option === "Transfer Amount") {
        console.log('he;o')
      const foundCustomer = customerData.find(
        (customer) =>
          customer.accNo === parseInt(accountNumber) &&
          customer.pinNumber === parseInt(pinNumber)
      );

      if (foundCustomer) {
        // Show the AtmBalance component when the login validation matches
        setShowAtmBalance(true);
        setBalance(foundCustomer.accountBalance);
      }
    } else {
      setShowAtmBalance(false); // Hide the AtmBalance component for other menu options
    }
  };

  return (
    <div className="flex flex-col items-start justify-start p-10 pl-96 bg-[#EBEFF2] h-screen w-[100%] overflow-auto">
      <h1 className="text-2xl mb-10">ATM Operations</h1>
      {/* <AtmBalance/>
      <TransferAccount customers={customerData} onTransfer={handleTransfer} /> */}
      {!showMenu ? (
        <AccountLogin
          accountNumber={accountNumber}
          setAccountNumber={setAccountNumber}
          pinNumber={pinNumber}
          setPinNumber={setPinNumber}
          validateAccount={validateAccount}
          error={error}
        />
      ) : (
        <MenuOptions
          selectedOption={selectedOption}
          handleMenuOption={handleMenuOption}
          balance={balance}
          setBalance={setBalance}
          withdrawalAmount={withdrawalAmount}
          setWithdrawalAmount={setWithdrawalAmount}
          atmBalance={atmBalance}
          atmDenominations={atmDenominations}
          accountNumber={accountNumber}
        />
      )}
    </div>
  );
}

export default ATMOperations;
