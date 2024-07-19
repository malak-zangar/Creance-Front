import { Button, Form, Input, Modal, notification } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import api from "../../../utils/axios";

export const AddClientForm = ({ handleState }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const handleAddClient = (values) => {
    console.log(values);
    api
      .post("/user/create", values)
      .then((response) => {
        console.log("Client added successfully:", response.data);
        notification.success({ message: "Client modifié avec succès" });

        setShowAddForm(false);
        handleState({
          ...response.data.client,
          key: response.data.client.id,
        });
        addForm.resetFields();
      })
      .catch((error) => {
        notification.error({
          description:
            error?.response?.data?.erreur ||
            `Une erreur lors de la creation du client "${values?.username}"`,
        });
      });
  };
  return (
    <>
      <Button
        type="primary"
        onClick={() => setShowAddForm(true)}
        icon={<PlusCircleOutlined />}
      >
        Ajouter un Client
      </Button>
      <Modal
        title="Ajouter un nouveau client"
        visible={showAddForm}
        onCancel={() => setShowAddForm(false)}
        footer={null}        style={{ top: 15 }} 

      >
        <Form
          layout="vertical"
          name="addClientForm"
          onFinish={handleAddClient}
          form={addForm}
        >
          <Form.Item
            name="username"
            label="Nom du client"
            rules={[
              { required: true, message: "Veuillez saisir le nom du client!" },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Veuillez saisir l'email du client!" },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="emailcc"
            label="Email à copier en cc"
            rules={[
              { required: true, message: "Veuillez saisir l'email à copier en cc du client!" },
            ]}style={{ marginBottom: '8px' }} 
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
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="identifiantFiscal"
            label="ID Fiscal"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'identifiant fiscal' du client!",
              },
            ]}style={{ marginBottom: '8px' }} 
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
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
