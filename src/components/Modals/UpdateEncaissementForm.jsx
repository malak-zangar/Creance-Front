import { Button, Form, Input, Modal, notification } from "antd";
import axios from "axios";
import { useState } from "react";
import { EditOutlined} from '@ant-design/icons';

function UpdateEncaissementForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm] = Form.useForm();

  const handleUpdate = () => {
    editForm.setFieldsValue({ ...record });
    const date = new Date(record.date);
    const formattedDate = date.toISOString().split('T')[0];
    editForm.setFieldsValue({ ...record, date: formattedDate });
    setIsEditModalVisible(true);
  };

  const handleEditEncaissement = (values) => {
    axios
      .put(`http://localhost:5551/encaissement/updateEncaissement/${record.key}`, values)
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
            `Un erreur lors de la modification de l'encaissement "${values?.reference}"`,
        });
      });
  };

  return (
    <>
      <Button icon={<EditOutlined />} type="primary" size="small" onClick={handleUpdate}>Modifier</Button>

      <Modal
        title={"Modifier l'encaissement "+ record?.reference}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingUser(null);
        }}
        footer={null}
      >
        <Form
          form={editForm}
          name="editEncaissementForm"
          initialValues={editingUser}
          layout="vertical"
          onFinish={handleEditEncaissement}
        >
        <Form.Item
            name="reference"
            label="Référence de l'encaissement"
            rules={[
              { required: true, message: "Veuillez saisir la référence de l'encaissement!" },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="facture"
            label="Facture"
            rules={[
              { required: true, message: "Veuillez choisir la facture correspondante à cet encaissement!" },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="client"
            label="Client"
            rules={[
              {
                required: true,
                message: "Veuillez choisir le client correspondant à cet encaissement!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date de l'encaissement"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date de l'encaissement!",
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="modeReglement"
            label="mode Reglement"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le mode de reglement de l'encaissement!",
              },
            ]}
          >
            <Input  />
          </Form.Item>
          <Form.Item
            name="montantEncaisse"
            label="Montant encaisse"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant encaisse de l'encaissement!",
              },
            ]}
          >
            <Input type="number" step="0.001"  />
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

export default UpdateEncaissementForm;
