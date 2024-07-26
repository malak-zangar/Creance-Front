import { Button, Form, Input, Modal, notification, Space } from "antd";
import { useState } from "react";
import { EditOutlined} from '@ant-design/icons';
import api from "../../../utils/axios";

function UpdateParamForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingParam, setEditingParam] = useState(null);
  const [editForm] = Form.useForm();

  const handleUpdate = () => {
    editForm.setFieldsValue({ ...record });
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue({ ...record });
  };

  const handleEditParam = (values) => {
    
    api
      .put(`/paramentreprise/updateparamentrep/${record.key}`, values)
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
            `Une erreur lors de la modification des paramètres d'ID "${record?.key}"`,
        });
      });
  };

  return (
    <>
      <Button icon={<EditOutlined />}  size="small" onClick={handleUpdate}></Button>

      <Modal
        title={"Modifier les paramètres d'ID : "+ record?.key}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingParam(null);
        }}
        footer={null}
        style={{ top: 10 }} 

      >
        <Form
          form={editForm}
          name="editParamForm"
          initialValues={editingParam}
          layout="vertical"
          onFinish={handleEditParam}
        >
          
          <Form.Item
            name="raisonSociale"
            label="Raison sociale"
            rules={[
              { required: true, message: "Veuillez saisir la raison sociale de l'entreprise!" },
            ]}            style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Veuillez saisir l'email de l'entreprise!" },
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
                message: "Veuillez saisir le numéro de téléphone de l'entreprise!",
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
                message: "Veuillez saisir l'identifiant fiscal de l'entreprise!",
              },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="adresse"
            label="Adresse complète"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'adresse complète de l'entreprise!",
              },
            ]}style={{ marginBottom: '8px' }} 
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

export default UpdateParamForm;
