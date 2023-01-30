import { Tabs } from "antd";
import React, { useState } from "react";
import Directions from "./Direction";
import Categories from "./Categories";

enum ETabs {
  DIRECTIONS = "direction",
  CATEGORIES = "Categories",
}

export default function Direction() {
  const [activeTab, setActiveTab] = useState<string>(ETabs.DIRECTIONS);
  
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
            label: `Directions`,
            key: ETabs.DIRECTIONS,
            children: <Directions />,
          },
          {
            label: `Categories`,
            key: ETabs.CATEGORIES,
            children: <Categories />,
          },
        ]}
      />
    </div>
  );
}
