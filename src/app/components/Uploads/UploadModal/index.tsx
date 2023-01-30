import {
  Button,
  Form,
  Input,
  message,
  InputNumber,
  Modal,
  Popconfirm,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { AdminActionType } from "../../../../types";
import axios, { baseURL, ImgUrl } from "../../../../utils/axios";
import { StyledUploadModal } from "./index.style";

type TProp = {
  isVisible: boolean;
  actionType: string;
  hideModal: () => void;
  fetchData: () => void;
  pageData?: any;
};
function UploadModal(props: TProp) {
  const { isVisible, hideModal, fetchData, pageData, actionType } = props;
  const [form] = Form.useForm();
  const inpRef = useRef<any>();
  const [hasImg, setHasImg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    const formData = new FormData();
    if (inpRef.current.files[0]) {
      formData.append("photo", inpRef.current.files[0]);
    }
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
        fetchData();
        hideModal();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    
  };
  
  const editPage = async (values: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("_method", "PUT");
    if (inpRef?.current?.files[0]) {
      formData.append("photo", inpRef.current.files[0]);
    }
    if (!hasImg && !inpRef?.current?.files[0]) {
      formData.append("photo", "");
    }
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
      const { data } = await axios.post(
        `/api/home-pages/${pageData.id}`,
        formData
      );
      if (data) {
        form.resetFields();
        message.success("Successfully updated");
        fetchData();
        hideModal();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const setDefaultData = () => {
    if (actionType === AdminActionType.EDIT) {
      form.setFieldsValue({
        video: pageData.video,
        photo_text: pageData.photo_text,
        status: pageData.status,
      });
      if (pageData?.photo) {
        setHasImg(pageData.photo);
      }
    } else {
      form.resetFields();
    }
  };

  useEffect(() => {
    setDefaultData();
  }, []);

  if (actionType === AdminActionType.ADD) {
    return (
      <StyledUploadModal>
        <Modal
          title="Create page"
          open={isVisible}
          cancelButtonProps={{ style: { display: "none" } }}
          okButtonProps={{ style: { display: "none" } }}
          okText="Create"
          onCancel={hideModal}
        >
          <Form
            layout="vertical"
            form={form}
            name="control-hooks"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item label="Video link" name="video">
              <Input />
            </Form.Item>
            <Form.Item label="Photo Text" name="photo_text">
              <Input />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <InputNumber />
            </Form.Item>
            <Form.Item label="Photo upload" name="photo">
              <input type="file" ref={inpRef} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 10 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </StyledUploadModal>
    );
  } else {
    return (
      <StyledUploadModal>
        <Modal
          title="Update page"
          open={isVisible}
          cancelButtonProps={{ style: { display: "none" } }}
          okButtonProps={{ style: { display: "none" } }}
          okText="Update"
          onCancel={hideModal}
        >
          <Form
            layout="vertical"
            form={form}
            name="control-hooks"
            initialValues={{ remember: true }}
            onFinish={editPage}
            autoComplete="off"
          >
            <Form.Item label="Video link" name="video">
              <Input />
            </Form.Item>
            <Form.Item label="Photo Text" name="photo_text">
              <Input />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <InputNumber />
            </Form.Item>
            {hasImg ? (
              <Popconfirm
                title="Are you sure？"
                okText="Yes"
                cancelText="No"
                onConfirm={() => setHasImg("")}
              >
                <div className="img_block">
                  <img
                    src={`${ImgUrl}${hasImg}`}
                    alt="page"
                    className="img"
                    style={{ width: 140, height: 140, objectFit: "cover" }}
                  />
                </div>
              </Popconfirm>
            ) : (
              <Form.Item label="Photo upload" name="photo">
                <input type="file" ref={inpRef} />
              </Form.Item>
            )}
            <Form.Item wrapperCol={{ offset: 10, span: 10 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </StyledUploadModal>
    );
  }
}

export default UploadModal;
