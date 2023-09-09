import "./global.css";
import SideBar from "./components/SideBar";
import React, { Fragment } from "react";
function App() {
  return (
    <>
      <div className="w-[100%]">
        <Fragment>
          <SideBar />
        </Fragment>
      </div>
    </>
  );
}

export default App;
