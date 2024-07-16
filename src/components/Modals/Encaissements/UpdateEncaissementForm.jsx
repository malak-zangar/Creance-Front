import { Button, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { EditOutlined} from '@ant-design/icons';
import api from "../../../utils/axios";

function UpdateEncaissementForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm] = Form.useForm();

  const [facture, setFacture] = useState(null); // État pour stocker la facture associée

  useEffect(() => {
    if (record?.facture) {
      api
        .get(`/facture/getByID/${record.key}`)
        .then((response) => {
          console.log(response.data.facture)
          setFacture(response.data.facture); // Mettre à jour l'état avec la facture
        })
        .catch((error) => {
          notification.error("Erreur lors de la récupération de la facture:", error);
        });
    }
  }, [record]);

  const handleUpdate = () => {
    editForm.setFieldsValue({ ...record });
    const date = new Date(record.date);
    const formattedDate = date.toISOString().split('T')[0];
    editForm.setFieldsValue({ ...record, date: formattedDate });
    setIsEditModalVisible(true);
  };

  const handleEditEncaissement = (values) => {
    api
      .put(`/encaissement/updateEncaissement/${record.key}`, values)
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
            `Un erreur lors de la modification du paiement "${values?.reference}"`,
        });
      });
  };

  return (
    <>
      <Button icon={<EditOutlined />} type="primary" size="small" onClick={handleUpdate}>Modifier</Button>

      <Modal
        title={"Modifier le paiement "+ record?.reference}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingUser(null);
        }}
        footer={null}   style={{ top: 15 }} 
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
            label="Référence du paiement"
            rules={[
              { required: true, message: "Veuillez saisir la référence du paiement!" },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="facture"
            label="Facture"
            rules={[
              { required: true, message: "Veuillez choisir la facture correspondante à ce paiement!" },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="client"
            label="Client"
            rules={[
              {
                required: true,
                message: "Veuillez choisir le client correspondant à ce paiement!",
              },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date de paiement"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date de paiement!",
              },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="modeReglement"
            label="mode de règlement"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le mode de reglement du paiement!",
              },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input  />
          </Form.Item>
          <Form.Item
            name="montantEncaisse"
            label={`Montant encaissé en ${facture?.devise} `}
                        rules={[
              {
                required: true,
                message: "Veuillez saisir le montant encaissé du paiement!",
              },
            ]}style={{ marginBottom: '8px' }} 
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
