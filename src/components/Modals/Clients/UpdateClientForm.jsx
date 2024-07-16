import { Button, Form, Input, Modal, notification } from "antd";
import { useState } from "react";
import { EditOutlined} from '@ant-design/icons';
import api from "../../../utils/axios";

function UpdateClientForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm] = Form.useForm();

  const handleUpdate = () => {
    editForm.setFieldsValue({ ...record });
    setIsEditModalVisible(true);
  };

  const handleEditClient = (values) => {
    api
      .put(`/user/updateClient/${record.key}`, values)
      .then((response) => {
        
        handleState({
            ...values,
            key: record.key
        });
        setIsEditModalVisible(false);
      })
      .catch((error) => {
        notification.error({
          description:
            error?.response?.data?.error ||
            `Un erreur lors de la modification du client "${values?.username}"`,
        });
      });
  };

  return (
    <>
      <Button icon={<EditOutlined />} type="primary" size="small" onClick={handleUpdate}>Modifier</Button>

      <Modal
        title={"Modifier le client d'ID : "+ record?.key}
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
          onFinish={handleEditClient}
        >
          
          <Form.Item
            name="username"
            label="Nom du client"
            rules={[
              { required: true, message: "Veuillez saisir le nom du client!" },
            ]}            style={{ marginBottom: '8px' }} 
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
            label="Email CC"
            rules={[
              { required: true, message: "Veuillez saisir l'email cc du client!" },
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
            label="Identifiant Fiscal"
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
              Modifier
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateClientForm;
