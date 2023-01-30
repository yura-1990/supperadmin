import { Tabs } from "antd";
import React, { useState } from "react";
import { Uploads } from "./FrontImage/LoadableUploads";
import { RegPageUploads } from "./RegisterPageImage/LoadableUploads";

enum ETabs {
  FRONT_PAGE = "front page",
  REGISTER_PAGE = "register page",
}
function Members() {
  const [activeTab, setActiveTab] = useState<string>(ETabs.FRONT_PAGE);

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
            label: `Front Page Images`,
            key: ETabs.FRONT_PAGE,
            children: <Uploads />,
          },
          {
            label: `Register Page Images`,
            key: ETabs.REGISTER_PAGE,
            children: <RegPageUploads />,
          },
        ]}
      />
    </div>
  );
}

export default Members;