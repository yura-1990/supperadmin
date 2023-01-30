/* eslint-disable react-hooks/rules-of-hooks */
import { Button, message, Table, Input, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import axios from "../../../../../utils/axios";
import Axios from "axios";
import { StyledUsers } from "./index.style";
import { DownCircleOutlined, UpCircleOutlined } from "@ant-design/icons";
import { getNotifs } from "../../../../../utils";
import { updateAccount } from "../../../../../store/account/accountSlice";
import { useAppDispatch } from "../../../../../store/hooks";
import { debounce } from "lodash";
import { InputChangeEventHandler } from "../../../../../types";

const { Option } = Select;
function index() {
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<any>();
  const [fillials, setFillials] = useState<any>();
  const [filteredUsers, setFilteredUsers] = useState<any>();
  const [fillLoading, setFillLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>();
  const [searchFil, setSearchFil] = useState<number>(0);
  const inpRef = useRef<any>();

  const getUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/users");
      let onlyUsers = await data.data.filter((user: any) => user.role.id === 3);
      setUsers(onlyUsers);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  
  const getFillials = async () => {
    setFillLoading(true);
    try {
      const { data } = await axios.get("/api/filial", {
        headers: {
          "Accept-Language": "en",
        },
      });
      if (data.filial) {
        setFillials(data.filial);
        setFillLoading(false);
      }
    } catch (error) {
      setFillLoading(false);
    }
  };

  const getExcels = async () => {
    try {
      const { data } = await axios({
        method: "GET",
        url: "/api/users/export",
        responseType: "blob",
      });
      if (data) {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "users.xlsx");
        link.click();
      }
    } catch (error) {}
  };

  const setNotifCount = async () => {
    let sum = await getNotifs();
    dispatch(updateAccount({ notifcs: sum }));
  };
  const uploadExcelUsers = async () => {
    const formData = new FormData();
    formData.append("file", inpRef.current.files[0]);
    try {
      const { data } = await axios.post("/api/users/import", formData);
      if (data) {
        message.success("Successfully uploaded");
        setNotifCount();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filterDataByLogin = debounce(async () => {
    let filteredData = await users.filter((a: any) => {
      if (search) {
        if (searchFil) {
          return (
            a?.login.toLowerCase().includes(search.toLowerCase()) &&
            a.fillial_id === searchFil
          );
        } else {
          return a?.login.toLowerCase().includes(search.toLowerCase());
        }
      } else {
        if (searchFil) {
          return a.fillial_id === searchFil;
        } else {
          return a;
        }
      }
    });
    setFilteredUsers(filteredData);
  }, 300);

  const searchHandle = (e: InputChangeEventHandler) => {
    setSearch(e.target.value);
    filterDataByLogin();
  };
  
  const filterDataByFil = async () => {
    if (searchFil) {
      let filteredData = await users.filter((a: any) => {
        if (searchFil) {
          if (search) {
            return (
              a.fillial_id === searchFil &&
              a?.login.toLowerCase().includes(search.toLowerCase())
            );
          } else {
            return a.fillial_id === searchFil;
          }
        } else {
          if (search) {
            return a?.login.toLowerCase().includes(search.toLowerCase());
          } else {
            return a;
          }
        }
      });
      setFilteredUsers(filteredData);
    }
  };

  const fillialHandle = (value: number) => {
    setSearchFil(value);
  };

  const columns = [
    {
      title: "Login",
      dataIndex: "login",
      key: "login",
      render: (record: any, text: any) => {
        return <h5>{record}</h5>;
      },
    },
    {
      title: "Filial name",
      dataIndex: "fillial",
      key: "name",
      render: (record: any, text: any) => {
        return <h5>{record?.name_en}</h5>;
      },
    },
    {
      title: "PNFL",
      dataIndex: "pasport",
      key: "pnfl",
      render: (record: any, text: any) => {
        return <h5>{record?.pnfl}</h5>;
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (record: any, text: any) => <h5>{record?.type}</h5>,
    },
  ];
  
  useEffect(() => {
    filterDataByFil();
  }, [searchFil]);

  useEffect(() => {
    getUsers();
    getFillials();
  }, []);

  return (
    <StyledUsers>
      <div className="page_header">
        <h4>Users {users?.length}</h4>
        <div className="btn_group">
          <Select
            style={{ width: 140 }}
            placeholder="Search by Fillial"
            allowClear
            onChange={fillialHandle}
            loading={fillLoading}
            className="fill_search"
          >
            {fillials
              ? fillials.map((fillial: any) => (
                  <Option value={fillial.id} key={fillial.id}>
                    {fillial.name_en}
                  </Option>
                ))
              : null}
          </Select>
          <Input
            placeholder="Search by login"
            value={search}
            onChange={searchHandle}
            allowClear
            style={{ width: 200 }}
            className="search_Inp"
          />
          <Button
            type="primary"
            onClick={getExcels}
            icon={<DownCircleOutlined />}
          >
            Import Excels
          </Button>
          <Button
            type="primary"
            onClick={() => inpRef.current.click()}
            icon={<UpCircleOutlined />}
          >
            Export Excels
          </Button>
          <input
            type="file"
            ref={inpRef}
            name="excel"
            id="excel"
            onChange={uploadExcelUsers}
          />
        </div>
      </div>
      <Table
        columns={columns}
        loading={loading}
        dataSource={search || searchFil ? filteredUsers : users}
      />
    </StyledUsers>
  );
}

export default index;
