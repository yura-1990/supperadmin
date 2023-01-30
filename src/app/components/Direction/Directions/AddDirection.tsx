import { Modal } from "antd";
import { useEffect, useState } from "react";
import { Form, Input, Select, Button, InputNumber, message } from "antd";
import axios from "../../../../utils/axios";
import { AdminActionType } from "../../../../types";
import { getNotifs } from "../../../../utils";
import { updateAccount } from "../../../../store/account/accountSlice";
import { useAppDispatch } from "../../../../store/hooks";
type TProp = {
  isVisible: boolean;
  actionType: string;
  hideModal: () => void;
  fetchData: () => void;
  directionData?: any;
};
interface IFillial {
  id: number;
  name_en: string;
}
const { Option } = Select;
function AddDirection(props: TProp) {
  const dispatch = useAppDispatch();
  const { isVisible, hideModal, fetchData, directionData, actionType } = props;
  const [form] = Form.useForm();
  const [fillials, setFillials] = useState<IFillial[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  
  
  const setNotifCount = async () => {
    let sum = await getNotifs();
    dispatch(updateAccount({ notifcs: sum }));
  };

  const onFinish = async (values: any) => {
    if (actionType === AdminActionType.ADD) {
      setLoading(true);
      try {
        const { data } = await axios.post("/api/direction", values);
        setLoading(false);
        if (data.direction) {
          console.log(data.direction);
          
          form.resetFields();
          setNotifCount();
          message.success(data.message);
          hideModal();
          fetchData();
        }
      } catch (error) {
        setLoading(false);
      }
    } else {
      setLoading(true);
      console.log(values);
      
      try {
        const { data } = await axios.put(`/api/direction/${directionData.id}/update`, values);
        setLoading(false);
        if (data.direction) {
          form.resetFields();
          message.success("Successfully updated");
          hideModal();
          fetchData();
        }
      } catch (error) {
        setLoading(false);
      }
    }
  };

  const setDefaultData = () => {
    if (actionType === AdminActionType.EDIT) {
      console.log(directionData);
      
      form.setFieldsValue({
        title_uz: directionData.title_uz,
        title_ru: directionData.title_ru,
        title_en: directionData.title_en,
      });
    } else {
      form.resetFields();
    }
  };

  useEffect(() => {
    setDefaultData();
  }, []);

  return (
    <Modal
      title={
        actionType === AdminActionType.ADD ? "Create Direction" : "Update Direction"
      }
      open={isVisible}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      okText={actionType === AdminActionType.ADD ? "Create" : "Update"}
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
        <Form.Item
          label="Title Uz"
          name="title_uz"
          rules={[{ required: true, message: "Please input direction title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Title En"
          name="title_en"
          rules={[{ required: true, message: "Please input direction title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Title Ru"
          name="title_ru"
          rules={[{ required: true, message: "Please input direction title!" }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item wrapperCol={{ offset: 10, span: 10 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {actionType === AdminActionType.ADD ? "Create" : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddDirection;
