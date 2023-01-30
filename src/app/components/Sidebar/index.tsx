/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from "react";
import { Menu, Layout, MenuProps, Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { FiUpload, FiUsers } from "react-icons/fi";
import { BsFillAlarmFill } from "react-icons/bs";
import { MdNotificationsNone } from "react-icons/md";
import { AiFillAppstore } from "react-icons/ai";
import { useAppDispatch } from "../../../store/hooks";
import {
  clearAccount,
  updateAccount,
} from "../../../store/account/accountSlice";
import { Link } from "react-router-dom";
import store from "../../../store/store";
import AlertIcon from "../Notification/AlertIcon";
import { getNotifs } from "../../../utils";

const { Sider } = Layout;
interface Location {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}
type MenuItem = Required<MenuProps>["items"][number];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notifcs = store.getState().account.notifcs;
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem("Admins & Users", "/", <FiUsers />),
    getItem("Links", "/uploads", <FiUpload />),
    getItem("Notifications", "/notifications", <AlertIcon />),
    getItem("Times", "/time", <BsFillAlarmFill />),
    getItem("Directions", "/direction", <AiFillAppstore />),
  ];

  const logSum = async () => {
    let sum = await getNotifs();
    dispatch(updateAccount({ notifcs: sum }));
  };

  useEffect(() => {
    logSum();
  }, []);

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="100"
      className="custom-sidebar br-1"
      width="250"
    >
      <div className="sidebar-inner-wrapper">
        <Menu
          mode="inline"
          id="sidebar-menu"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => {
            navigate(key);
          }}
          items={items}
        />
      </div>
      <div className="language-list">
        <Button
          type="primary"
          size="large"
          onClick={() => dispatch(clearAccount())}
        >
          Log Out
        </Button>
      </div>
    </Sider>
  );
}

export default Sidebar;
