import Navbar from "./NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AtmCash from "../pages/AtmCash";
import AtmOperations from "../pages/AtmOperations";
import CustomerDetails from "../pages/CustomerDetails";
const SideBar = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/atmcash" element={<AtmCash />} />
        <Route path="/atmoperations" element={<AtmOperations />} />
        <Route path="/customerdetails" element={<CustomerDetails />} />
      </Routes>
    </Router>
  );
};

export default SideBar;
