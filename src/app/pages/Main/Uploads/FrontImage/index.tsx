import {Button,Form,message,Popconfirm,Space,Table,Input} from "antd";
import React, { useEffect, useRef, useState } from "react";
import axios, { baseURL, ImgUrl } from "../../../../../utils/axios";
import { StyledUploads } from "./index.style";
import {EditOutlined,SettingOutlined,PlusCircleOutlined} from "@ant-design/icons";
import { AdminActionType, InputChangeEventHandler } from "../../../../../types";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import UploadModal from "../../../../components/Uploads/UploadModal";
import { debounce } from "lodash";

function Uploads() {
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
      const { data } = await axios.get("/api/home-pages");
      setPages(data.data);
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
      const { data } = await axios.delete(`/api/home-pages/${id}`);
      if (data.data) {
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
    formData.append("photo", inpRef.current.files[0]);
    if (values.video) {
      formData.append("video", values.video);
    }
    if (values.photo_text) {
      formData.append("photo_text", values.photo_text);
    }
    if (values.status) {
      formData.append("status", values.status);
    }
    try {
      const { data } = await axios.post("/api/home-pages", formData);
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
      dataIndex: "photo",
      key: "name",
      render: (record: any, text: any) => {
        if (record) {
          return <img src={`${ImgUrl + record}`} alt="page" className="page_img" />;
        }
        return null;
      },
    },
    {
      title: "Photo text",
      dataIndex: "photo_text",
      key: "photo_text",
      render: (record: any, text: any) => {
        return record ? <h5>{record}</h5> : <h5>-</h5>;
      },
    },
    {
      title: "Video link",
      dataIndex: "video",
      key: "video",
      render: (record: any, text: any) => {
        return record ? <h5>{record}</h5> : <h5>-</h5>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (record: any, text: any) => {
        return record ? <h5>{record}</h5> : <h5>-</h5>;
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
    <StyledUploads>
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
    </StyledUploads>
  );
}

export default Uploads;
