import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import "./loginstyle.css";
import image from "../../assets/Login.png";
import { Card } from "antd";

const Login = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //  height: "100vh",
      }}
    >
        
      <h1
        style={{
          marginTop: "35px",
          color: "#9336cb",
          fontSize: "28px",
          marginBottom: "20px",
        }}
      >
        <b>Se connecter</b>
      </h1>
      <br />
      <Card
        style={{ width: "800px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
      >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginRight: "30px",
            height: "350px",
            width: "350px",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${image})`,
          }}
        ></div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Nom d'utilisateur"
            name="username"
            rules={[
              {
                required: true,
                message: "SVP entrer votre nom d'utilisateur",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Nom d'utilisateur"
            />
          </Form.Item>
          <Form.Item
            label="Mot de passe"
            name="password"
            style={{ marginLeft: "7%" }}
            rules={[
              {
                required: true,
                message: "SVP entrer votre mot de passe",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mot de passe"
            />
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Form.Item>
              <Form.Item name="remember"  noStyle>
                <Checkbox>Se souvenir de moi</Checkbox>
              </Form.Item>
              <Form.Item>
                <br />
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{
                    borderColor: "#9336cb",
                    backgroundColor: "white",

                    color: "#9336cb",
                  }}
                >
                  Se connecter
                </Button>
              </Form.Item>
              <a className="login-form-forgot" href="" style={{ color: '#aa42e8' }}>
                Mot de passe oublié ?
              </a>
              <Form.Item>
                <br />
                Vous n'avez pas de compte ? <a href="" style={{ color: '#aa42e8' }}>Créer un compte</a>
              </Form.Item>
            </Form.Item>
          </div>
        </Form>
      </div></Card>
    </div>
  );
};
export default Login;
