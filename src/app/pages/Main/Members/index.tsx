import { Tabs } from "antd";
import React, { useState } from "react";
import { Admins } from "./Admins/LoadableAdmins";
import Passports from "./Passports";
import { Users } from "./Users/LoadabkeUsers";

enum ETabs {
  USERS = "users",
  ADMINS = "admins",
  PASSPORTS = "passports",
}

function Members() {
  const [activeTab, setActiveTab] = useState<string>(ETabs.ADMINS);

  const handleTab = (key: string) => {
    setActiveTab(key);
  };
  return (
    <div>
      <Tabs
        defaultActiveKey={activeTab}
        type="card"
        onChange={handleTab}
        items={[
          {
            label: `Admins`,
            key: ETabs.ADMINS,
            children: <Admins />,
          },
          {
            label: `Users`,
            key: ETabs.USERS,
            children: <Users />,
          },
          {
            label: `Passports`,
            key: ETabs.PASSPORTS,
            children: <Passports />,
          },
        ]}
      />
    </div>
  );
}

export default Members;
