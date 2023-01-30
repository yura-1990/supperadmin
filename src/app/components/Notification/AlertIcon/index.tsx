import React from "react";
import { MdNotificationsNone } from "react-icons/md";
import store from "../../../../store/store";
import { StyledAlertIcon } from "./index.style";

function AlertIcon() {
  const notifcs = store.getState().account.notifcs;

  return (
    <StyledAlertIcon>
      <MdNotificationsNone size={25} />
      {notifcs ? <span className="count">{notifcs}</span> : null}
    </StyledAlertIcon>
  );
}

export default AlertIcon;
