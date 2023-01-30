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
  adminData?: any;
};
interface IFillial {
  id: number;
  name_en: string;
}
const { Option } = Select;
function AddCategory(props: TProp) {
  const dispatch = useAppDispatch();
  const { isVisible, hideModal, fetchData, adminData, actionType } = props;
  const [form] = Form.useForm();
  const [fillials, setFillials] = useState<IFillial[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getFillials = async () => {
    try {
      const { data } = await axios.get("/api/filial", {
        headers: {
          "Accept-Language": "en",
        },
      });
      if (data.filial) {
        setFillials(data.filial);
      }
    } catch (error) {}
  };
  const setNotifCount = async () => {
    let sum = await getNotifs();
    dispatch(updateAccount({ notifcs: sum }));
  };

  const onFinish = async (values: any) => {
    if (actionType === AdminActionType.ADD) {
      setLoading(true);
      try {
        const { data } = await axios.post("/api/admins", values);
        setLoading(false);
        if (data.admin) {
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
      try {
        const { data } = await axios.put(`/api/admins/${adminData.id}`, values);
        setLoading(false);
        if (data.data) {
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
      form.setFieldsValue({
        login: adminData.login,
        pnfl: adminData.pasport.pnfl,
        pasport_seria: adminData.pasport.pasport_seria,
        pasport_seria_code: adminData.pasport.pasport_seria_code,
        fillial_id: adminData.fillial_id,
      });
    } else {
      form.resetFields();
    }
  };

  useEffect(() => {
    getFillials();
    setDefaultData();
  }, []);

  return (
    <Modal
      title={
        actionType === AdminActionType.ADD ? "Create admin" : "Update admin"
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
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Login"
          name="login"
          rules={[{ required: true, message: "Please input your login!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="PNFL"
          name="pnfl"
          rules={[{ required: true, message: "Please input your PNFL!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Passport seria"
          name="pasport_seria"
          rules={[
            { required: true, message: "Please input your Passport seria!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Passport code"
          name="pasport_seria_code"
          rules={[
            { required: true, message: "Please input your Passport code!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Fillial"
          name="fillial_id"
          rules={[{ required: true, message: "Please input your Fillial!" }]}
        >
          <Select placeholder="Select Fillial" allowClear>
            {fillials
              ? fillials.map((fillial) => (
                  <Option value={fillial.id} key={fillial.id}>
                    {fillial.name_en}
                  </Option>
                ))
              : null}
          </Select>
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

export default AddCategory;
