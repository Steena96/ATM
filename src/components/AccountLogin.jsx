import React from "react";

function AccountLogin({
  accountNumber,
  setAccountNumber,
  pinNumber,
  setPinNumber,
  validateAccount,
  error,
}) {
  return (
    <div className="bg-slate-50 bg-opacity-80 rounded-[10px] border border-slate-300 border-dashed w-[40%] p-10 justify-center items-center flex flex-col">
      <div className="mb-4">
        <label className="p-4" htmlFor="accountNumber">
          Account Number:
        </label>
        <input
          type="text"
          id="accountNumber"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          style={{
            border: "1px solid #ccc",
            width: "200px",
            height: "38px",
            borderRadius: "3px",
            padding: "10px",
          }}
        />
      </div>
      <div className="mb-4">
        <label className="p-4 pl-12" htmlFor="pinNumber">
          PIN Number:
        </label>
        <input
          type="password"
          id="pinNumber"
          value={pinNumber}
          onChange={(e) => setPinNumber(e.target.value)}
          style={{
            border: "1px solid #ccc",
            width: "200px",
            height: "38px",
            borderRadius: "3px",
            padding: "10px",
          }}
        />
      </div>
      <div className="pt-4 items-end justify-end flex">
        <button
          className="w-36 h-[2.2rem] flex justify-center items-center bg-[#109CF1] rounded-sm text-white"
          onClick={validateAccount}
        >
          Login
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default AccountLogin;
