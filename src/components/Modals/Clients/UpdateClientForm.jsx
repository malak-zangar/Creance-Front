import { Button, Form, Input, Modal, notification, Space, Tooltip } from "antd";
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import api from "../../../utils/axios";

function UpdateClientForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm] = Form.useForm();

  const handleUpdate = () => {
    editForm.setFieldsValue({ ...record });
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue({ ...record });
  };

  const handleConfirmEdit = (values) => {
    Modal.confirm({
      title: "Confirmer la modification",
      content: "Êtes-vous sûr de vouloir modifier ce client?",
      okText: "Oui",
      cancelText: "Non",
      onOk: () => handleEditClient(values),
    });
  };


  const handleEditClient = (values) => {
    api
      .put(`/user/updateClient/${record.key}`, values)
      .then((response) => {
        handleState({
          ...values,
          key: record.key,
        });
        setIsEditModalVisible(false);
        notification.success({ message: "Client modifié avec succès" });
      })
      .catch((error) => {
        notification.error({
          description:
            error?.response?.data?.error ||
            `Une erreur lors de la modification du client "${values?.username}"`,
        });
      });
  };

  return (
    <>
      <Tooltip title="Modifier">
        <Button
          icon={<EditOutlined />}
          size="small"
          onClick={handleUpdate}
        ></Button>
      </Tooltip>
      <Modal
        title={"Modifier le client d'ID : " + record?.key}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingUser(null);
        }}
        footer={null}
        style={{ top: 10 }}
      >
        <Form
          form={editForm}
          name="editClientForm"
          initialValues={editingUser}
          layout="vertical"
          onFinish={handleConfirmEdit}
        >
          <Form.Item
            name="username"
            label="Nom du client"
            rules={[
              { required: true, message: "Veuillez saisir le nom du client!" },
              { min: 3, message: "Le nom doit comporter au moins 3 lettres!" },
              { max: 25, message: "Le nom doit comporter au plus 25 lettres!" },
              {
                pattern: /^\S.*\S$|^\S{1,2}$/,
                message: "Le nom ne doit pas commencer ou finir par un espace!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email de contact"
            rules={[
              { required: true, message: "Veuillez saisir l'email du client!" },
              { type: "email", message: "Veuillez saisir un email valide!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="emailcc"
            label="Email à copier en cc"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'email à copier en cc du client!",
              },
              { type: "email", message: "Veuillez saisir un email valide!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Téléphone"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le numéro de téléphone du client!",
              },

              {
                pattern: /^\d{7,15}$/,
                message:
                  "Le numéro de téléphone doit comporter entre 7 et 15 chiffres!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="identifiantFiscal"
            label="ID Fiscal"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'identifiant fiscal' du client!",
              },
              {
                pattern: /^[a-zA-Z0-9]{6,20}$/,
                message:
                  "L'identifiant fiscal doit comporter entre 6 et 20 caractères alphanumériques!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="adresse"
            label="Adresse"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'adresse du client!",
              },
              {
                min: 6,
                message: "L'adresse doit comporter au moins 6 lettres!",
              },
              {
                pattern: /^\S.*\S$|^\S{1,2}$/,
                message:
                  "L'adresse ne doit pas commencer ou finir par un espace!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Modifier
              </Button>
              <Button type="default" onClick={handleCancel}>
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateClientForm;
