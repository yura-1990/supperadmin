import React, { useCallback, useState } from "react";
import { StyledSignIn } from "./Signin.style";
import BgImg from "../../../assets/img/fitness_bg.jpg";
import { message } from "antd";
import { Button, Form, Input } from "antd";
import { InputChangeEventHandler, ISignForm } from "../../../../types";
import axios from "../../../../utils/axios";
import { useAppDispatch } from "../../../../store/hooks";
import { updateAccount } from "../../../../store/account/accountSlice";

function Signin() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<ISignForm>({
    password: "",
    login: "",
  });

  const handleInputChange = useCallback((e: InputChangeEventHandler) => {
    const { name, value } = e.target;
    setInputValues((state) => ({ ...state, [name]: value }));
  }, []);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/login", inputValues);
      setLoading(false);
      if (data?.user && data?.user?.role_id === 1) {
        message.success("You have successfully logged in!");
        dispatch(updateAccount({ token: data.authorisation.token }));
      } else if (data?.user?.role_id !== 1) {
        message.error("Role didn't match!");
      } 
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <StyledSignIn bg={BgImg}>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        autoComplete="off"
      >
        <h1>Sign In</h1>
        <Form.Item
          label="Login"
          rules={[
            {
              required: true,
              message: "Please input your login!",
            },
          ]}
        >
          <Input
            size="large"
            name="login"
            value={inputValues.login}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            name="password"
            size="large"
            value={inputValues.password}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            htmlType="submit"
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </StyledSignIn>
  );
}

export default Signin;
