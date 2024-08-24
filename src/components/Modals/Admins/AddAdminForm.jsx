import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Space
} from "antd";
import { PlusCircleOutlined,LockOutlined,MailOutlined ,UserOutlined} from "@ant-design/icons";
import { useState } from "react";
import api from "../../../utils/axios";

export const AddAdminForm = ({ handleState }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [formValues, setFormValues] = useState(null);
  const [password, setPassword] = useState("");

  const handleCancel = () => {
    setShowAddForm(false);
    addForm.resetFields();
  };

  const handleAddAdmin = () => {
    addForm
      .validateFields()
      .then((values) => {
        const dataToSend = {
          ...values,
        };
        setFormValues(values);
        Modal.confirm({
          title: "Confirmer l'ajout du client",
          content: (
            <div>
              <p>Êtes-vous sûr de vouloir ajouter cet administrateur ?</p>
              <p>
                <strong>Nom d'utilisateur:</strong> {values.username}
              </p>
              <p>
                <strong>Email:</strong> {values.email}
              </p>
              <p>
                <strong>Mot de passe:</strong> {values.password}
              </p>
            </div>
          ),
          okText: "Confirmer",
          cancelText: "Annuler",
          onOk: () => {
            api
              .post("/auth/create", dataToSend)
              .then((response) => {
                console.log("Administrateur ajouté avec succès:", response.data);
                notification.success({ message: "Administrateur ajouté avec succès" });

                setShowAddForm(false);
                handleState({
                  ...response.data.admin,
                  key: response.data.admin.id,
                });
                addForm.resetFields();
              })
              .catch((error) => {
                notification.error({
                  description:
                    error?.response?.data?.erreur ||
                    `Une erreur lors de la création de l'administrateur "${formValues?.username}"`,
                });
              });
          },
          onCancel() {
            console.log("Ajout de l'dministrateur annulé");
          },
        });
      })
      .catch((error) => {
        console.error("Validation échouée:", error);
      });
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setShowAddForm(true)}
        icon={<PlusCircleOutlined />}
      >
        Ajouter un Administrateur
      </Button>
      <Modal
        title="Ajouter un nouveau administrateur"
        visible={showAddForm}
        onCancel={() => setShowAddForm(false)}
        footer={null}
        style={{ top: 15 }}
      >
        <Form
          layout="vertical"
          name="addAdminForm"
          onFinish={handleAddAdmin} 
          form={addForm}
        >
          <Form.Item
            name="username"
            label="Nom d'utilisateur"
            rules={[
              { required: true, message: "Veuillez saisir le nom d'utilisateur!" },
              { min: 3, message: "Le nom doit comporter au moins 3 lettres!" },
              { max: 25, message: "Le nom doit comporter au plus 25 lettres!" },
              {
                pattern: /^\S.*\S$|^\S{1,2}$/,
                message: "Le nom ne doit pas commencer ou finir par un espace!",
              },
              {
                pattern: /^[a-zA-Z0-9 ]+$/,
                message: "Le nom doit être alphanumérique!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Saisir le nom d'utilisateur" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Veuillez saisir l'email!" },
              { type: "email", message: "Veuillez saisir un email valide!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input
          placeholder="Saisir l'adresse Email"
             prefix={<MailOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
       
          <Form.Item
                label="Mot de passe"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "SVP entrer un mot de passe",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Saisir le mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>
    
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleAddAdmin}>
                Ajouter
              </Button>
              <Button key="cancel" onClick={handleCancel}>
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
