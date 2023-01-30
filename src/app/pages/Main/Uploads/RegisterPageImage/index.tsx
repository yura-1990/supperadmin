import {Button,Form,message,Popconfirm,Space,Table,Input} from "antd";
import React, { useEffect, useRef, useState } from "react";
import axios, { baseURL, ImgUrl } from "../../../../../utils/axios";
import { StyledRegPage } from "./index.style";
import {EditOutlined,SettingOutlined,PlusCircleOutlined} from "@ant-design/icons";
import { AdminActionType, InputChangeEventHandler } from "../../../../../types";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import UploadModal from "../../../../components/Uploads/ImageUploadModals/";
import { debounce } from "lodash";

export default function RegPageImage() {
  const [form] = Form.useForm();
  const inpRef = useRef<any>();
  const [actionType, setActionType] = useState<string>("");
  const [singlePage, setSinglePage] = useState<any>();
  const [pages, setPages] = useState<any>([]);
  const [filteredPages, setFilteredPages] = useState<any>([]);
  const [modalVisibl, setModalVisibl] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>()
  
  
  const getPages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/images");
      setPages(data.images);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const hideModal = () => {
    setModalVisibl(false);
    setActionType("");
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
  
  const deletePage = async (id: number) => {
    try {
      const { data } = await axios.delete(`/api/image/${id}/delete`);
      if (data.image) {
        message.success("Deleted");
        getPages();
      }
    } catch (error) {}
  };

  const filterData = debounce(async () => {
    let filteredData = await pages.filter((a: any) => {
      if (search) {
        return a?.photo_text.toLowerCase().includes(search.toLowerCase());
      } else {
        return a;
      }
    });
    setFilteredPages(filteredData);
  }, 300);

  const searchHandle = (e: InputChangeEventHandler) => {
    setSearch(e.target.value);
    filterData();
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("images", inpRef.current.files[0]);
    if (values.images) {
      formData.append("images", values.images);
    }
    try {
      const { data } = await axios.post("/api/images", formData);
      if (data) {
        form.resetFields();
        message.success("Successfully created");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (record: any, text: any) => {
        if (record) {
          return <img src={`${ImgUrl + record}`} alt="page" className="page_img" />;
        }
        return null;
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
              onConfirm={() => deletePage(record.id)}
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
    getPages();
  }, []);
  
  return (
    <StyledRegPage>
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
          Add Page
        </Button>
        </div>
      </div>
      <Table columns={columns} loading={loading} dataSource={search ? filteredPages : pages} />
      {modalVisibl ? (
        <UploadModal
          isVisible={modalVisibl}
          fetchData={getPages}
          hideModal={hideModal}
          actionType={actionType}
          pageData={singlePage}
        />
      ) : null}
      
    </StyledRegPage>
  )
}
