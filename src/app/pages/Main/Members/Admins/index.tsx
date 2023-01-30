/* eslint-disable react-hooks/rules-of-hooks */
import {
  Button,
  Dropdown,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
} from "antd";
import { debounce } from "lodash";
import type { MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "../../../../../utils/axios";
import { StyledAdmins } from "./index.style";
import AddAdmin from "../../../../components/Admin/Add/AddAdmin";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { AdminActionType, InputChangeEventHandler } from "../../../../../types";

function index() {
  const [admins, setAdmins] = useState<any>();
  const [filteredAdmins, setFilteredAdmins] = useState<any>();
  const [actionType, setActionType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<any>();
  const [search, setSearch] = useState<string>();

  const getAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admins");
      setAdmins(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  
  const deleteAdmin = async (id: number) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`/api/admins/${id}`);
      setLoading(false);
      if (data.data) {
        message.success("Successfully deleted");
      }
      getAdmins();
    } catch (error) {
      setLoading(false);
    }
  };
  const filterData = debounce(async () => {
    let filteredData = await admins.filter((a: any) => {
      if (search) {
        return a?.login.toLowerCase().includes(search.toLowerCase());
      } else {
        return a;
      }
    });
    setFilteredAdmins(filteredData);
  }, 300);

  const searchHandle = (e: InputChangeEventHandler) => {
    setSearch(e.target.value);
    filterData();
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Popconfirm title="Are you sure？" okText="Yes" cancelText="No">
          <Button size="small" type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
    {
      key: "2",
      label: (
        <Button size="small" type="primary">
          Edit
        </Button>
      ),
    },
  ];
  const handlemodal = () => {
    setActionType("");
    setModal(false);
  };

  const openAddModal = () => {
    setActionType(AdminActionType.ADD);
    setModal(true);
  };
  const openEditModal = (admin: any) => {
    setAdminData(admin);
    setActionType(AdminActionType.EDIT);
    setModal(true);
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
      title: "Passport seria",
      dataIndex: "pasport",
      key: "passport_seria",
      render: (record: any, text: any) => {
        return <h5>{record?.pasport_seria}</h5>;
      },
    },
    {
      title: "Passport code",
      dataIndex: "pasport",
      key: "passport_code",
      render: (record: any, text: any) => <h5>{record?.pasport_seria_code}</h5>,
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      render: (record: any, text: any) => {
        return (
          <Space size="middle">
            <Popconfirm
              title="Are you sure？"
              okText="Yes"
              cancelText="No"
              onConfirm={() => deleteAdmin(record.id)}
            >
              <Button
                type="primary"
                danger
                icon={<MdDeleteOutline size={20} />}
              />
            </Popconfirm>
            <Button
              type="primary"
              icon={<MdModeEditOutline size={18} />}
              onClick={() => openEditModal(record)}
            />
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    getAdmins();
  }, []);

  return (
    <StyledAdmins>
      <div className="page_header">
        <h4>Admins {admins?.length}</h4>
        <div className="btn_group">
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
            onClick={openAddModal}
            icon={<PlusCircleOutlined />}
          >
            Add Admin
          </Button>
        </div>
      </div>
      <Table columns={columns} loading={loading} dataSource={search ? filteredAdmins : admins} />
      {modal ? (
        <AddAdmin
          actionType={actionType}
          isVisible={modal}
          adminData={adminData}
          hideModal={handlemodal}
          fetchData={getAdmins}
        />
      ) : null}
    </StyledAdmins>
  );
}

export default index;
