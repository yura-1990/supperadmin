import { Table } from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../../../../utils/axios";
import { StyledPassports } from "./index.style";

function Passports() {
  const [loading, setLoading] = useState<boolean>(false);
  const [passports, setPassports] = useState<any[]>([]);

  const getPassports = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/pasport", {
        headers: {
          "Accept-Language": "uz",
        },
      });
      res.data.pasports.splice(0, 4);
      setPassports(res.data.pasports);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const columns = [
    {
      title: "PNFL",
      dataIndex: "pnfl",
      key: "pnfl",
      render: (record: any, text: any) => {
        return <h5>{record}</h5>;
      },
    },
    {
      title: "Passport seria",
      dataIndex: "",
      key: "pasport_seria",
      render: (record: any, text: any) => {
        return <h5>{record.pasport_seria}</h5>;
      },
    },
    {
      title: "Passport seria code",
      dataIndex: "",
      key: "pasport_seria_code",
      render: (record: any, text: any) => {
        return <h5>{record.pasport_seria_code}</h5>;
      },
    },
  ];
  useEffect(() => {
    getPassports();
  }, []);
  return (
    <StyledPassports>
      <Table columns={columns} loading={loading} dataSource={passports} />
    </StyledPassports>
  );
}

export default Passports;
