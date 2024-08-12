import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message, Modal } from "antd";
import mail from "../../assets/mail.png";
import { MailOutlined } from "@ant-design/icons";
import api from "../../utils/axios";
import Headerr from "../../components/Modals/Headerr";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const SaisirEmail = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const showConfirmModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(values)

      const response = await api.post("/auth/sendmail", values);
      console.log("Response:", response.data);
      message.success("Email envoyé avec succés");
      form.resetFields();
      navigate("/login");

    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email':", error.response.data.erreur);
      message.error(` ${error.response.data.erreur}`);
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Headerr />
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Title
            level={2}
            style={{
              marginBottom: "35px",
              marginTop: "30px",
              color: "#0c21a7",
            }}
          >
            Récupérer votre mot de passe
          </Title>

          <Card
            style={{ width:"50%",
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
                  backgroundImage: `url(${mail})`,
                  backgroundSize: "contain",
                  width: "160px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></div>
              <Form form={form} layout="vertical" onFinish={showConfirmModal}>
                <Form.Item
                  label="Adresse Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer votre adresse email !",
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

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Envoyer Email
                  </Button>
                </Form.Item>

                <Form.Item>
              
                <a href="/login" style={{ color: "#0c21a7" }}>
                  Retourner à la page de connexion
                </a>
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
            <p>
              Êtes-vous sûr de vouloir envoyer un émail de récupération de mot
              de passe à cette adresse ?
            </p>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default SaisirEmail;
