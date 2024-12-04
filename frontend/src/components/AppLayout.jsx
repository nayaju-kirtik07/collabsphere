import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  NumberOutlined,
  DashboardOutlined,
  FundProjectionScreenOutlined,
  ProjectOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  theme,
  Avatar,
  Popover,
  List,
  Typography,
  Modal,
} from "antd";
import axios from "axios";
import { Infinity } from "lucide-react";
import io from "socket.io-client";
import UserSettings from './UserSetting';

const { Header, Content, Sider } = Layout;

const AppLayout = () => {
  const { Text } = Typography;

  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const user_id = JSON.parse(localStorage.getItem("user"));

  const token = JSON.parse(localStorage.getItem("token"));

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: { authorization: `Bearer ${token}` },
  });

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    getItem("Dashboard", "/home", <DashboardOutlined />),
    getItem("Projects", "/project", <FundProjectionScreenOutlined />),
    getItem("Tasks", "/task", <ProjectOutlined />),
    getItem("Chat", "/chat", <MessageOutlined />),
  ];

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  useEffect(() => {
    api
      .get("/getMyProfile")
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Socket connection setup
  useEffect(() => {
    const newSocket = io(`http://localhost:3001`);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      newSocket.emit("user_connected", user_id);
    });

    newSocket.on("user_connected", (activeUsersList) => {
      console.log("Active users:", activeUsersList);
      setActiveUsers(activeUsersList);
    });

    newSocket.on("user_disconnected", (activeUsersList) => {
      console.log("Active users after disconnect:", activeUsersList);
      setActiveUsers(activeUsersList);
    });

    // Only disconnect socket when component is unmounted
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Pass socket and activeUsers to the Outlet context
  const contextValue = { socket, activeUsers };

  // const user = {
  //   name: "John Doe",
  //   email: "john.doe@example.com",
  //   avatar: null
  // };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const handleSettings = () => {
    setIsSettingsVisible(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsVisible(false);
  };

  const popoverContent = (
    <List
      style={{ width: "250px" }}
      itemLayout="horizontal"
      dataSource={[
        {
          title: user.username,
          description: user.email,
          avatar: (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "16px 0",
              }}
            >
              <Avatar
                size={40}
                src={user.profileImage}
                icon={!user.profileImage && <UserOutlined />}
              />
            </div>
          ),
        },
        {
          title: "Settings",
          avatar: <SettingOutlined />,
          onClick: handleSettings,
        },
        {
          title: "Logout",
          avatar: <LogoutOutlined />,
          onClick: handleLogout,
        },
      ]}
      renderItem={(item) => (
        <List.Item
          style={{
            cursor: item.onClick ? "pointer" : "default",
            padding: "1rem",
          }}
          onClick={item.onClick}
        >
          <List.Item.Meta
            avatar={item.avatar}
            title={<Text strong>{item.title}</Text>}
            description={
              item.description && (
                <Text type="secondary">{item.description}</Text>
              )
            }
          />
        </List.Item>
      )}
    />
  );

  // ..
  return (
    <Layout
      style={{
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          backgroundColor: "#597ef7",
        }}
      >
        <div
          className="logo"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
          onClick={() => navigate("/home")}
        >
          <Infinity style={{ color: "white" }} size={44} />
          <h2 style={{ color: "white" }}>CollabSphere</h2>
        </div>
        <Popover
          content={popoverContent}
          trigger="click"
          placement="bottomRight"
          overlayInnerStyle={{ padding: 0 }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          <Avatar
            size="medium"
            src={user.profileImage}
            icon={!user.profileImage && <UserOutlined />}
            style={{ cursor: "pointer" }}
          />
        </Popover>
      </Header>
      <Layout color="white">
        <Sider
          theme="light"
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            height: "100vh",
            backgroundColor: "#597ef7",
            color: "white",
          }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="demo-logo-vertical" />
          <Menu
            style={{
              backgroundColor: "#597ef7",
              paddingTop: "10px",
              color: "white"
            }}
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
            items={items}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 20px",
            backgroundColor: "#f0f2f5",
            marginLeft: collapsed ? 80 : 200,
          }}
        >
          <Content
            style={{
              padding: "48px",
            }}
          >
            <div
              style={{
                background: colorBgContainer,
                minHeight: 500,
                padding: 24,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet context={contextValue} />
            </div>
          </Content>
        </Layout>
      </Layout>
      <UserSettings 
        visible={isSettingsVisible}
        onClose={handleSettingsClose}
      />
    </Layout>
    // <div className="container-fluid">
    //   <SuccessToster
    //     message={"Login Success"}
    //     show={show}
    //     position={"top-right"}
    //     setShow={setShow}
    //   />

    //   <div className="row">
    //     <div className="col-2 menu-field">
    //       <SideNav />
    //     </div>

    //     <div className="col-10 table-field">
    //       <Navbar />
    //       <div style={{ marginTop: "100px" }}>
    //         <Outlet />
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default AppLayout;
