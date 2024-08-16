import { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message, Card } from "antd";
import image from "../../assets/Login.png";
import { setaccess_token } from "../../utils/auth";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Title from "antd/es/typography/Title";
import Headerr from "../../components/Modals/Headerr";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();

  const onFinish = async (values) => {
    try {
      console.log(values);
      const response = await api.post("/auth/login", values);
      console.log(response.data);
      localStorage.setItem("access_token", response.data.access_token);
      setaccess_token(response.data.access_token);
      message.success("Connexion réussie");
      console.log(response.data.user);
      setCurrentUser(response.data.user.username);
      console.log(currentUser);

      localStorage.setItem("currentUser", response.data.user.username);
      console.log(localStorage.getItem("currentUser"));

      localStorage.setItem("currentUserId", response.data.user.id);
      console.log(localStorage.getItem("currentUserId"));

      localStorage.setItem("currentUserEmail", response.data.user.email);
      console.log(localStorage.getItem("currentUserEmail"));

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response.data.erreur);

      message.error(
        "Erreur de connexion : Veuillez vérifier votre nom d'utilisateur et votre mot de passe"
      );
    }
  };

  return (

    <><Headerr/>
      
   <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
    <Title level={2} style={{ marginBottom: "25px",
              marginTop: "20px",
            color: "#0c21a7",
 }}>
          Se connecter
        </Title>
        <br />
        <Card style={{ width: "100%", maxWidth: "800px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 ">
            <div
              className="hidden sm:block"
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
              layout="vertical"
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Mot de passe"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "SVP entrer votre mot de passe",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>
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
                    borderColor: "#0c21a7",
                    backgroundColor: "white",
                    color: "#0c21a7",
                  }}
                >
                  Se connecter
                </Button>
              </Form.Item>
              <a
                className="login-form-forgot"
                href="/sendEmail"
                style={{ color: "#0c21a7" }}
              >
                Mot de passe oublié ?
              </a>

            </Form>
          </div>
        </Card>
      </div></>
  );
};

export default Login;
