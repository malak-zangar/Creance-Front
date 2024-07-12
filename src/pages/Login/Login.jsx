// Login.js
import React, { useContext } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import AuthContext from "../../context/AuthContext"; // Importez votre contexte d'authentification
import image from "../../assets/Login.png";
import { Card } from "antd";

const Login = () => {
  const { login } = useContext(AuthContext); // Utilisez le contexte d'authentification

  const onFinish = async (values) => {
    console.log("Logging in with values:", values);
    try {
      const success = await login(values);
      console.log("Login success:", success);
      if (success) {
        message.success('Connexion réussie');
        window.location.href = "/dashboard";
      } else {
        message.error('Nom d\'utilisateur ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Erreur de connexion : Veuillez vérifier votre nom d\'utilisateur et votre mot de passe');
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
                <Form.Item name="remember" noStyle>
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
                <a
                  className="login-form-forgot"
                  href=""
                  style={{ color: "#aa42e8" }}
                >
                  Mot de passe oublié ?
                </a>
                <Form.Item>
                  <br />
                  Vous n'avez pas de compte ?{" "}
                  <a href="" style={{ color: "#aa42e8" }}>
                    Créer un compte
                  </a>
                </Form.Item>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};
export default Login;
