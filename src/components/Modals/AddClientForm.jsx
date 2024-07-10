import { Button, Form, Input, Modal, notification } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";

export const AddClientForm = ({ handleState }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const handleAddClient = (values) => {
    console.log(values);
    axios
      .post("http://localhost:5551/user/create", values)
      .then((response) => {
        console.log("Client added successfully:", response.data);
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
            `Un erreur lors de la creation du client "${values?.username}"`,
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
        Ajouter Client
      </Button>
      <Modal
        title="Ajouter un nouveau client"
        visible={showAddForm}
        onCancel={() => setShowAddForm(false)}
        footer={null}
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
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Veuillez saisir l'email du client!" },
            ]}
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
            ]}
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
            ]}
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