import React, { useContext } from "react";
import {
  FileTextOutlined,
  FileDoneOutlined,
  SettingOutlined,
  TeamOutlined,
  DollarOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { Outlet, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // Importez votre contexte d'authentification

const { Header, Content, Sider } = Layout;

const items = [
  {
    key: "1",
    icon: React.createElement(DashboardOutlined),
    label: <Link to="/dashboard">Tableau de bord</Link>,
  },
  {
    key: "2",
    icon: React.createElement(FileDoneOutlined),
    label: <Link to="/contrats">Contrats</Link>,
  },
  {
    key: "3",
    icon: React.createElement(TeamOutlined),
    label: <Link to="/clients">Clients</Link>,
  },
  {
    key: "4",
    icon: React.createElement(FileTextOutlined),
    label: <Link to="/factures/actif">Factures</Link>,
  },
  {
    key: "5",
    icon: React.createElement(DollarOutlined),
    label: <Link to="/encaissements">Paiements</Link>,
  },
  {
    key: "6",
    icon: React.createElement(SettingOutlined),
    label: <Link to="/dashboard">Paramétrage</Link>,
  },
];

const Main = () => {

  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        {user?.username}
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Déconnexion
      </Menu.Item>
    </Menu>
  );
console.log(user)
  return (
    <Layout className="h-[100vh]">
<Sider
          className="h-[100vh]"
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          } }
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          } }
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            className="h-[100vh]"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={items} />
        </Sider><Layout>
            <Header
              style={{
                padding: 0,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                background: "#fff", // Replace with your desired background color
                paddingRight: "16px",
              }}
            >
              <Dropdown overlay={profileMenu}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Avatar style={{}} icon={<UserOutlined />} />
                  <span style={{ marginLeft: "8px" }}>{user?.username}</span>
                </div>
              </Dropdown>
            </Header>
            <Content
              style={{
                margin: "24px 16px 0",
                overflowY: "scroll",
              }}
            >
              <div
                style={{
                  padding: 24,
                  minHeight: "95%",
                  background: "#fff", // Replace with your desired background color
                  borderRadius: "8px", // Replace with your desired border radius
                }}
              >
                <Outlet />
              </div>
            </Content>
          </Layout>

    </Layout>
  );
};

export default Main;
