import React, { useState, useEffect  } from 'react'
import { StyledDirections } from './index.style'
import { Button, Input, Table, Space, Popconfirm, message } from 'antd'
import { AdminActionType, InputChangeEventHandler } from "../../../../../types";
import { debounce } from "lodash"
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "../../../../../utils/axios";
import { MdDeleteOutline, MdModeEditOutline } from 'react-icons/md';
import AddDirection from '../../../../components/Direction/Directions/AddDirection';

export default function Directions() {
  const [direction, setDirection] = useState<any>();
  const [search, setSearch] = useState<string>();
  const [filteredDirections, setFilteredDirections] = useState<any>();
  const [actionType, setActionType] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [directionData, setDirectionData] = useState<any>();
  
  const getDirection = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/direction", {headers: {
        "Accept-Language": "uz"
      }});
      setDirection(data.data);        
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  
  const deleteDirection = async (id: number) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`/api/direction/${id}/delete`);
      setLoading(false);
      if (data.data) {
        message.success("Successfully deleted");
      }
      getDirection();
    } catch (error) {
      setLoading(false);
    }
  };
  
  const openEditModal = (direction: any) => {    
    setDirectionData(direction);
    setActionType(AdminActionType.EDIT);
    setModal(true);
  };
  
  useEffect(() => {
    getDirection();    
  }, []);
  
  const filterData = debounce(async () => {
    let filteredData = await direction.filter((a: any) => {
      if (search) {
        return a?.title_uz.toLowerCase().includes(search.toLowerCase());
      } else {
        return a;
      }
    });
    setFilteredDirections(filteredData);
  }, 300);
  
  const searchHandle = (e: InputChangeEventHandler) => {
    setSearch(e.target.value);
    filterData();
  };
  
  const openAddModal = () => {
    setActionType(AdminActionType.ADD);
    setModal(true);
  };
  
  const handlemodal = () => {
    setActionType("");
    setModal(false);
  };
  
  const columns = [
    {
      title: "Title Uz",
      dataIndex: "title_uz",
      key: "title_uz",
      render: (record: any, text: any) => {
        return <h3>{record}</h3>;
      },
    },
    {
      title: "Title Ru",
      dataIndex: "title_ru",
      key: "title_ru",
      render: (record: any, text: any) => {
        return <h3>{record}</h3>;
      },
    },
    {
      title: "Title En",
      dataIndex: "title_en",
      key: "title_en",
      render: (record: any, text: any) => {
        return <h3>{record}</h3>;
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
              onConfirm={() => deleteDirection(record.id)}
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
  
  return (
    <StyledDirections>
      <div className="page_header">
        <h4>Directions {direction?.length}</h4>
        <div className="btn_group">
          <Input
            placeholder="Search by direction"
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
            Add Direction
          </Button>
        </div>
      </div>
      <Table columns={columns} loading={loading} dataSource={search ? filteredDirections : direction} />
      {modal ? (
        <AddDirection
          actionType={actionType}
          isVisible={modal}
          directionData={directionData}
          hideModal={handlemodal}
          fetchData={getDirection}
        />
      ) : null}
    </StyledDirections>
  )
}
