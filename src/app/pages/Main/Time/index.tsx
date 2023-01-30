import React, { useState, useEffect } from 'react'
import { StyledTime } from './index.style'
import { AdminActionType, InputChangeEventHandler } from "../../../../types";
import { debounce, times } from "lodash";
import { Button, Form, message, Popconfirm, Space, Table, Input } from "antd";
import { EditOutlined, SettingOutlined, PlusCircleOutlined, } from "@ant-design/icons";
import TimeModal from '../../../components/Times/index'
import axios from "../../../../utils/axios";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";

export default function Times() {
  
  const [search, setSearch] = useState<string>()
  const [filteredPages, setFilteredPages] = useState<any>([]);
  const [timeManagement, setTimeManagement] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("");
  const [modalVisibl, setModalVisibl] = useState<boolean>(false);
  const [singlePage, setSinglePage] = useState<any>();
 
  const getPages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/time_managment");
      setTimeManagement(data.timeManagment);     
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  
  const hideModal = () => {
    setModalVisibl(false);
    setActionType("");
  };
  
  const searchHandle = (e: InputChangeEventHandler) => {
    setSearch(e.target.value);
    filterData();
  };
  
  const openAddModal = () => {
    setActionType(AdminActionType.ADD);
    setModalVisibl(true);
  };
  
  const openEditModal = (page: any) => {
    setSinglePage(page);
    setActionType(AdminActionType.EDIT);
    setModalVisibl(true);
  };
  
  const filterData = debounce(async () => {
    let filteredData = await timeManagement.filter((a: any) => {
      if (search) {
        return a?.photo_text.toLowerCase().includes(search.toLowerCase());
      } else {
        return a;
      }
    });
    setFilteredPages(filteredData);
  }, 300);
  
  const deleteTime = async (id: number) => {
    try {
      const { data } = await axios.delete(`/api/time_managment/${id}/delete`);
      if (data.timeManagment) {
        message.success("Deleted");
        getPages();
      }
    } catch (error) {}
  };
  
  useEffect(()=>{
    getPages()
  }, [])
  
  
  const columns = [
    {
      title: "Starting Data",
      dataIndex: "day_from",
      key: "day_from",
      render: (record: any, text: any) => {
        return record ? <h2>{record}</h2> : <h5>-</h5>;
      },
    },
    {
      title: "Ending Data",
      dataIndex: "day_to",
      key: "day_to",
      render: (record: any, text: any) => {
        return record ? <h2>{record}</h2> : <h5>-</h5>;
      },
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
              onConfirm={() => deleteTime(record.id)}
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
              onClick={() => openEditModal(record)} />
          </Space>
        );
      },
    },
  ];
  
  return (
    <StyledTime>
      <div className="page_header">
        <h3>Home pages</h3>
        <div className="btn_group">
          <Input
            placeholder="Search by photo text"
            value={search}
            onChange={searchHandle}
            allowClear
            style={{ width: 200 }}
            className="search_Inp"
          />
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={openAddModal}
          >
            Time Management
          </Button>
        </div>
      </div>
        <Table columns={columns} loading={loading} dataSource={search ? filteredPages : timeManagement} />
        {modalVisibl ? (
        <TimeModal
          isVisible={modalVisibl}
          fetchData={getPages}
          hideModal={hideModal}
          actionType={actionType}
          pageData={singlePage}
        />
      ) : null}
    </StyledTime>
  )
}
