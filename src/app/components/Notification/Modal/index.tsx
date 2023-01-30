import { Col, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import { IFillial } from "../../../../types";
import axios from "../../../../utils/axios";
type TProps = {
  isVisible: boolean;
  hideModal: () => void;
  userData: any;
};
function NotifModal(props: TProps) {
  const { isVisible, hideModal, userData } = props;
  const [defaultFill, setDefaultFill] = useState<string>("");
  const getFillials = async () => {
    try {
      const { data } = await axios.get("/api/filial", {
        headers: {
          "Accept-Language": "en",
        },
      });
      if (data.filial) {
        data.filial.forEach((fill: any) => {
          if (fill.id === userData.fillial_id) {
            setDefaultFill(fill.name_en);
          }
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    getFillials();
  }, []);
  return (
    <Modal
      title="New User"
      open={isVisible}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      okText="Ok"
      onCancel={hideModal}
    >
      <Row style={{ marginTop: 10 }}>
        <Col span={12}>
          <h4>Login:</h4>
        </Col>
        <Col span={12}>
          <h4>{userData?.login}</h4>
        </Col>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Col span={12}>
          <h4>Fillial name:</h4>
        </Col>
        <Col span={12}>
          <h4>{defaultFill}</h4>
        </Col>
      </Row>
    </Modal>
  );
}

export default NotifModal;
