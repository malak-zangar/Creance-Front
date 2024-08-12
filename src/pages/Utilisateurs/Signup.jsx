import { useState } from "react";
import { LockOutlined, UserOutlined,MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Card } from "antd";
import image from "../../assets/Login.png";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";
import Headerr from "../../components/Modals/Headerr";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      console.log(values);
      const response = await api.post("/auth/create", values);
      console.log(response.data);
      message.success("Inscription réussie");

      navigate("/login");
    } catch (error) {
      console.error("signup failed:", error.response.data.erreur);

      message.error(
        ` ${error.response.data.erreur}`
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
          S'inscrire
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
                  label="Adresse Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "SVP entrer votre adresse email ",
                    },
                    {
                      type: "email",
                      message: "Veuillez saisir un email valide!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Saisir votre adresse Email"
                    prefix={<MailOutlined className="site-form-item-icon" />}
                  />
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
      
              <Form.Item>
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
                  S'inscrire
                </Button>
              </Form.Item>
         
              <Form.Item>
                <br />
                Vous avez déja un compte ?
                <a href="/login" style={{ color: "#0c21a7" }}>
                  Se connecter
                </a>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div></>
  );
};

export default Signup;
