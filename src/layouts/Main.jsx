import React from "react";
import {
  FileTextOutlined,
  FileDoneOutlined,
  SettingOutlined,
  TeamOutlined,
  EuroCircleOutlined ,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,UserSwitchOutlined
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Avatar, theme } from "antd";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { removeaccess_token } from '../utils/auth';
import neodev from "../assets/logo-neopolis.png"; 


const { Header, Content, Sider } = Layout;

const items = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: <Link to="/dashboard">Tableau de bord</Link>,
    path: "/dashboard"
  },
  {
    key: "5",
    icon: <EuroCircleOutlined />,
    label: <Link to="/encaissements">Paiements</Link>,
    path: "/encaissements"
  },
  {
    key: "4",
    icon: <FileTextOutlined />,
    label: <Link to="/factures/actif">Factures</Link>,
    path: "/factures"
  },
  {
    key: "2",
    icon: <FileDoneOutlined />,
    label: <Link to="/contrats/actif">Contrats</Link>,
    path: "/contrats"
  },
  {
    key: "3",
    icon: <TeamOutlined />,
    label: <Link to="/clients">Clients</Link>,
    path: "/clients"
  },


  { key: "6",
    icon: <UserSwitchOutlined />,
    label: <Link to="/administrateurs">Administrateurs</Link>,
    path: "/administrateurs"
  },
  {
    key: "7",
    icon: <SettingOutlined />,
    label: <Link to="/parametres/actuels">Paramétrage</Link>,
    path: "/parametres"
  },

];

const Main = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = localStorage.getItem('currentUser');

  const handleLogout = () => {
    removeaccess_token();
    navigate("/login");
  };
  const handleProfile = () => {
    navigate("/profile");
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />} onClick={handleProfile}>{currentUser}</Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Déconnexion
      </Menu.Item>
    </Menu>
  );

  const selectedKey = items.find(item => location.pathname.startsWith(item.path))?.key || "1";

  return (
    <Layout className="h-[100vh]">
      <Sider
        className="h-[100vh]"
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          className="h-[100vh]"
          mode="inline"
          selectedKeys={[selectedKey]} 
        >
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: colorBgContainer,
            paddingRight: "16px",
          }}
        >
  <div style={{ display: "flex", alignItems: "center", paddingLeft: "16px" }}>
        <img src={neodev} alt="Logo" style={{ height: "40px" }}  /> 
      </div>
          <Dropdown overlay={profileMenu}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Avatar icon={<UserOutlined />} />
              <span style={{ marginLeft: "8px" , marginRight: "10px"}}>{currentUser}</span>
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
              background: colorBgContainer,
              borderRadius: "8px",
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
