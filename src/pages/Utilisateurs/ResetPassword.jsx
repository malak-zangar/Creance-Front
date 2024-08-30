import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Card, message, Modal } from "antd";
import pwd from "../../assets/pwd.png";
import { LockOutlined } from "@ant-design/icons";
import api from "../../utils/axios";
import Headerr from "../../components/Modals/Headerr";
import { useLocation, useNavigate } from "react-router-dom";

const { Title } = Typography;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const query = useQuery();
  const token = query.get("token"); 

  useEffect(() => {
    if (!token) {
      message.error("Token manquant dans l'URL");
    }
  }, [token]);

  const showConfirmModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); 
      const response = await api.put(`/auth/resetpassword`,  { token, ...values });
      console.log("Response:", response.data);
      message.success("Mot de passe modifié avec succès");
      form.resetFields(); 
      navigate("/login");

    } catch (error) {
      message.error("Erreur lors de la modification du mot de passe");
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <> <Headerr/>
    <div>
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
          Réinitialiser votre mot de passe
        </Title>
    
        <Card
          style={{
       
            maxWidth: "900px",
            height: "auto",
            margin: "0 auto",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div
              className="hidden md:block"
              style={{
                backgroundImage: `url(${pwd})`,
                backgroundSize: "contain",
                width: "210px",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></div>
            <Form
              form={form}
              layout="vertical"
              onFinish={showConfirmModal}
              style={{ padding: "10px 6px" }}
            >

              <Form.Item
                label="Nouveau mot de passe"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer votre nouveau mot de passe!",
                  },
                  {
                    min: 6,
                    message: "Le mot de passe doit contenir au moins 6 caractères.",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Nouveau mot de passe"
                  prefix={<LockOutlined className="site-form-item-icon" />} />
              </Form.Item>

              <Form.Item
                label="Confirmer le mot de passe"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Veuillez confirmer votre mot de passe!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Les deux mots de passe ne correspondent pas!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Confirmez mot de passe" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Mettre à jour le mot de passe
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>

        <Modal
          title="Confirmation"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Confirmer"
          cancelText="Annuler"
        >
          <p>Êtes-vous sûr de vouloir modifier votre mot de passe?</p>
        </Modal>
      </div></div></>
  );
};

export default ResetPassword;
