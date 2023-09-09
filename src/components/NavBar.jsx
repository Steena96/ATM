import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiHome4Line, RiUserFollowLine, RiStackLine } from "react-icons/ri";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
function NavBar() {
  const [collapsed, setCollapsed] = useState(false);

  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <div>
      <Sidebar
        className={`app ${
          toggled ? "toggled" : ""
        } h-[100%] bg-[#EBEFF2] w-[30%]`}
        style={{ height: "100%", position: "absolute" }}
        collapsed={false}
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
        handleCollapsedChange={handleCollapsedChange}
      >
        <main>
          <Menu>
            <MenuItem onClick={handleCollapsedChange}>
              <div className="p-[30px] font-bold text-xl">ATM PROJECT</div>
            </MenuItem>

            <hr />
          </Menu>

          <Menu>
            <MenuItem icon={<RiHome4Line />}>
              {" "}
              <Link to="/atmcash">ATM Cash</Link>
            </MenuItem>
            <MenuItem icon={<RiUserFollowLine />}>
              {" "}
              <Link to="/customerdetails">Customer Details</Link>
            </MenuItem>
            <MenuItem icon={<RiStackLine />}>
              {" "}
              <Link to="/atmoperations">ATM Operations</Link>
            </MenuItem>
          </Menu>
        </main>
      </Sidebar>
    </div>
  );
}
export default NavBar;
