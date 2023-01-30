import {
  Button,
  Form,
  DatePicker,
  message,  
  Modal,
  Popconfirm,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { AdminActionType } from "../../../types";
import axios, { baseURL, ImgUrl } from "../../../utils/axios";
import { StyledUploadModal } from "./index.style";


type TProp = {
  isVisible: boolean;
  actionType: string;
  hideModal: () => void;
  fetchData: () => void;
  pageData?: any;
};
function TimeModal(props: TProp) {
  const { isVisible, hideModal, fetchData, pageData, actionType } = props;
  const [form] = Form.useForm();
  const inpRef = useRef<any>();
  const [hasImg, setHasImg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    const formData = new FormData();
    if (values.day_from) {
      formData.append("day_from", values.day_from.format("YYYY-MM-DD"));
    }
    
    if (values.day_to) {
      formData.append("day_to", values.day_to.format("YYYY-MM-DD"));
    }
    
    try {
      const { data } = await axios.post("/api/time_managment", formData);
      console.log(data);
      
      if (data) {
        form.resetFields();
        message.success("Successfully created");
        fetchData();
        hideModal();
        console.log(data);
        
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
    
    if (values.day_from) {
      formData.append("day_from", values.day_from.format("YYYY-MM-DD"));
    }else{
      formData.append("day_from", pageData.day_from);
    } 
    
    if (values.day_to) {
      formData.append("day_to", values.day_to.format("YYYY-MM-DD"));
    } else {
      formData.append("day_to", pageData.day_to);
    }

    try {
      const { data } = await axios.post(
        `/api/time_managment/${pageData.id}/update`,
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

  if (actionType === AdminActionType.ADD) {
    return (
      <StyledUploadModal>
        <Modal
          title="Set Time"
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
            <Form.Item label="Day from" name="day_from">
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="Day To" name="day_to">
              <DatePicker format="YYYY-MM-DD" />
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
            <Form.Item label="Day from" name="day_from">
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="Day To" name="day_to">
              <DatePicker format="YYYY-MM-DD"/>
            </Form.Item>
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

export default TimeModal;
