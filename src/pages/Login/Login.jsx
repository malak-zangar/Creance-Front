import { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message, Card } from "antd";
import image from "../../assets/Login.png";
import { setaccess_token } from '../../utils/auth';
import api from '../../utils/axios';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth(); // Get setCurrentUser from AuthContext

  const onFinish = async (values) => {
    try {
      console.log(values)
      const response = await api.post('/auth/login', values);
      console.log(response.data)
      localStorage.setItem('access_token', response.data.access_token);
      setaccess_token(response.data.access_token);
      message.success('Connexion réussie');
      const user = await api.get('/auth/protected');
      console.log(user.data.logged_in_as);
      setCurrentUser(user.data.logged_in_as);
      localStorage.setItem('currentUser',user.data.logged_in_as );

      navigate("/dashboard");
    } catch (error) {
      console.error('Login failed:', error);
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Vous n'avez pas de compte ?
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
