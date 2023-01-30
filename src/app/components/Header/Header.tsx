import React from "react";
import { Layout } from "antd";
import { StyledHeader } from "./Header.style";
import { MdOutlineNotificationsNone } from "react-icons/md";

const { Header } = Layout;
function Headers() {
  return (
    <StyledHeader>
      <h2>Super Admin</h2>
      <div className="notifications">
        <div className="alert">
          <a href="http://sport.front.napaautomotive.uz/" className="link">
            Home Page
          </a>
        </div>
      </div>
    </StyledHeader>
  );
}

export default Headers;
