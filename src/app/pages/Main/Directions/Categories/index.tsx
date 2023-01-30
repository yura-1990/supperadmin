import React, { useState, useEffect  } from 'react'
import { Button, Input, Table, Space, Popconfirm, message } from 'antd'
import { StyledCategories } from './index.style'
import { AdminActionType, InputChangeEventHandler } from "../../../../../types";
import { debounce } from "lodash"
import axios from "../../../../../utils/axios";
import { PlusCircleOutlined } from "@ant-design/icons";
import { MdDeleteOutline, MdModeEditOutline } from 'react-icons/md';

export default function Categories() {
  const [category, setCategory] = useState<any>();
  const [direction, setDirection] = useState<any>();
  const [search, setSearch] = useState<string>();
  const [actionType, setActionType] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [filteredDirections, setFilteredDirections] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [directionData, setDirectionData] = useState<any>();
  
  const filterData = debounce(async () => {
    let filteredData = await category.filter((a: any) => {
      if (search) {
        return a?.login.toLowerCase().includes(search.toLowerCase());
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
  
  const openEditModal = (category: any) => {
    setDirectionData(category);
    setActionType(AdminActionType.EDIT);
    setModal(true);
  };
  
  /* const deleteCategory = async (id: number) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`/api/directionCategory/${id}/delete`);
      setLoading(false);
      if (data.data) {
        message.success("Successfully deleted");
      }
      getCategory();
    } catch (error) {
      setLoading(false);
    }
  }; */
  
  const getCategory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/directionCategory", {headers: {
        "Accept-Language": "uz"
      }});
      setCategory(data.directionCategory);  
      console.log(data.directionCategory);
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  
  const columns = [
    {
      title: "Category Uz",
      dataIndex: "category_uz",
      key: "category_uz",
      render: (record: any, text: any) => {
        return <h3>{record}</h3>;
      },
    },
    {
      title: "Category Ru",
      dataIndex: "category_uz",
      key: "category_uz",
      render: (record: any, text: any) => {
        return <h3>{record}</h3>;
      },
    },
    {
      title: "Category En",
      dataIndex: "category_uz",
      key: "category_uz",
      render: (record: any, text: any) => {
        return <h3>{record}</h3>;
      },
    },
    /* {
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
              onConfirm={() => deleteCategory(record.id)}
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
    }, */
  ];
  
  useEffect(() => {
    getCategory();    
  }, []);
  
  return (
    <StyledCategories>
      <div className="page_header">
        <h4>Categories {category?.length}</h4>
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
      <Table columns={columns} loading={loading} dataSource={search ? filteredDirections : category} />
    </StyledCategories>
  )
}
