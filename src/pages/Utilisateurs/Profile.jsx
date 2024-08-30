import React, { useState,useEffect } from "react";
import { Form, Input, Button, Typography, Card, message, Modal } from "antd";
import profile from "../../assets/profile.png";
import { LockOutlined, UserOutlined ,MailOutlined} from "@ant-design/icons";
import api from "../../utils/axios";


const { Title } = Typography;
const currentUserId = localStorage.getItem("currentUserId");

const Profile = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("currentUserEmail"));
  const [currentPassword, setCurrentPassword] = useState('');

  const showConfirmModal = () => {
    setIsModalVisible(true);
  };

 
  const handleOk = async () => {

    try {
      const values = await form.validateFields();
    
      const response = await api.post(`/auth/verify-password/${currentUserId}`, { password: currentPassword });
    
      if (response.status === 200) {
        const updateResponse = await api.put(`/auth/profile/${currentUserId}`, values);
        console.log("Response:", updateResponse.data);
        message.success("Modifications effectuées avec succès");
        localStorage.setItem("currentUserEmail", values.email);
        setEmail(values.email);
        form.resetFields();
        setCurrentPassword('');
      } else {
        throw new Error('Mot de passe incorrect');
      }
    } catch (error) {
      if (error.response.data.message === 'Mot de passe incorrect') {
        message.error("Mot de passe actuel incorrect");
      } else {
        message.error("Erreur lors de la modification");
      }
    } finally {
      setIsModalVisible(false);
      setCurrentPassword(''); 
    }
    
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentPassword(''); 

  };


  return (
    <div>
      <Title level={3} style={{ marginBottom: "20px" , textAlign: "center" }}>
        Mon Profil
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
              width: "320px",
              backgroundRepeat: "no-repeat",
              backgroundImage: `url(${profile})`,
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
            style={{ padding: "20px" }}
          >
            <Form.Item label="Nom d'utilisateur">
              <Input
                value={localStorage.getItem("currentUser")}
                disabled
                prefix={<UserOutlined className="site-form-item-icon" />}
              />
            </Form.Item>
            <Form.Item label="Adresse email"      
              initialValue={email}
              rules={[{ required: true, message: "Veuillez entrer votre adresse email!" }]}
            name="email"
            > 
              <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                prefix={<MailOutlined className="site-form-item-icon" />}
              />
            </Form.Item>

            <Form.Item
              label="Nouveau mot de passe"
              name="password"
              rules={[
              
                {
                  min: 6,
                  message: "Le mot de passe doit contenir au moins 6 caractères.",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value && !getFieldValue("confirmPassword")) {
                      return Promise.reject(
                        new Error("Les deux mots de passe ne correspondent pas!")
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Entrez votre nouveau mot de passe"
                prefix={<LockOutlined className="site-form-item-icon" />}
              />
            </Form.Item>

            <Form.Item
              label="Confirmer le mot de passe"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
            
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
                placeholder="Confirmez votre mot de passe"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Mettre à jour 
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
        <p>Si vous etes sur de vouloir confirmer vos modifications, merci de saisir votre mot de passe actuel ici :</p>
    <br/>
    <Input.Password
      placeholder="Mot de passe actuel"
      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
    />
      </Modal>
    </div>
  );
};

export default Profile;
