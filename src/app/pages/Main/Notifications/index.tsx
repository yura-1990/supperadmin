import { Button, Table, Input } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { updateAccount } from "../../../../store/account/accountSlice";
import { useAppDispatch } from "../../../../store/hooks";
import { IFillial, InputChangeEventHandler } from "../../../../types";
import { getNotifs } from "../../../../utils";
import axios from "../../../../utils/axios";
import NotifModal from "../../../components/Notification/Modal";
import { StyledNotif } from "./index.style";

function Notifications() {
  const dispatch = useAppDispatch();
  const [notifications, setNotifications] = useState<any>([]);
  const [filteredNotifs, setFilteredNotifs] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [singleUser, setSingleUser] = useState<any>();
  const [search, setSearch] = useState<string>();
  const [fillials, setFillials] = useState<IFillial[]>([]);
  const getNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/notifications/all");
      let filteredData = await data.data.filter(
        (data: any) => data.is_read === 0 && data.body.includes("{")
      );
      setNotifications(filteredData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const getById = async () => {
    console.log();
    try {
      const { data } = await axios.get(`/api/notifications/${singleUser?.id}`);
      if (data.data) {
        getNotifications();
        setNotifCount();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const openModal = (notif: any) => {
    setSingleUser(notif);
    setModalVisible(true);
  };

  const hideModal = () => {
    getById();
    setSingleUser({});
    setModalVisible(false);
  };
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

  const filterData = debounce(async () => {
    let filteredData = await notifications.filter((a: any) => {
      if (search) {
        return JSON.parse(a.body)
          ["login"].toLowerCase()
          .includes(search.toLowerCase());
      } else {
        return a;
      }
    });
    setFilteredNotifs(filteredData);
  }, 300);

  const searchHandle = (e: InputChangeEventHandler) => {
    setSearch(e.target.value);
    filterData();
  };

  const columns = [
    {
      title: "Login",
      dataIndex: "",
      key: "name",
      render: (record: any, text: any) => {
        return <h5>{JSON.parse(record?.body)["login"]}</h5>;
      },
    },
    {
      title: "Filial name",
      dataIndex: "",
      key: "name",
      render: (record: any, text: any) => {
        let filName = "";
        fillials.forEach((item: IFillial) => {
          if (item.id === +JSON.parse(record.body)["fillial_id"]) {
            filName = item.name_en;
          }
        });
        return <h5>{filName}</h5>;
      },
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "name",
      render: (record: any, text: any) => {
        return (
          <Button type="primary" onClick={() => openModal(record)}>
            Open
          </Button>
        );
      },
    },
  ];

  const setNotifCount = async () => {
    let sum = await getNotifs();
    dispatch(updateAccount({ notifcs: sum }));
  };

  useEffect(() => {
    getNotifications();
    getFillials();
    setNotifCount();
  }, []);
  return (
    <StyledNotif>
      <div className="page_header">
        <h4>Notifications {notifications?.length}</h4>
        <div className="btn_group">
          <Input
            placeholder="Search by login"
            value={search}
            onChange={searchHandle}
            allowClear
            style={{ width: 200 }}
            className="search_Inp"
          />
        </div>
      </div>
      <Table
        columns={columns}
        loading={loading}
        dataSource={search ? filteredNotifs : notifications}
      />
      {modalVisible ? (
        <NotifModal
          userData={JSON.parse(singleUser.body)}
          isVisible={modalVisible}
          hideModal={hideModal}
        />
      ) : null}
    </StyledNotif>
  );
}

export default Notifications;
