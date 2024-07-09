import React from "react";
import {
  FileTextOutlined,TeamOutlined,DollarOutlined
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Outlet,Link } from "react-router-dom";


const { Header, Content, Sider } = Layout;

const items = [
  {
    key: '1',
    icon: React.createElement(TeamOutlined),
    label: <Link to="/clients">Gestion des Clients</Link>,
  },
  {
    key: '2',
    icon: React.createElement(FileTextOutlined),
    label: <Link to="/factures">Gestion des Factures</Link>,
  },

  {
    key: '3',
    icon: React.createElement(DollarOutlined),
    label: <Link to="/encaissements">Gestion des Encaissements</Link>,
  },
];
const Main = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
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
          defaultSelectedKeys={["1"]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "24px 16px 0",
            overflowY: "scroll"
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: "95%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              
            }}
          >
            <Outlet/>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Main;
