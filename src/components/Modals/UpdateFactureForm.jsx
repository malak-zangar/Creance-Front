import { Button, Form, Input, Modal, notification } from "antd";
import axios from "axios";
import { useState,useEffect } from "react";
import { EditOutlined} from '@ant-design/icons';

function UpdateFactureForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingFacture, setEditingFacture] = useState(null);
  const [editForm] = Form.useForm();

  const handleUpdate = () => {
    const formattedDate = new Date(record.date).toISOString().split('T')[0];
    const formattedEcheance = new Date(record.echeance).toISOString().split('T')[0];
    editForm.setFieldsValue({ ...record, date: formattedDate, echeance: formattedEcheance });
    setIsEditModalVisible(true);

    console.log(record)
  };

  const handleEditFacture = (values) => {

    const formattedValues = {
      ...values,
      date: new Date(values.date).toISOString().split('T')[0],
      echeance: new Date(values.echeance).toISOString().split('T')[0]
    };

    axios
      .put(`http://localhost:5551/facture/updateFacture/${record.key}`, formattedValues)
      .then((response) => {
        
        handleState({
            ...values,
            key: record.key
        });
        setIsEditModalVisible(false);
        notification.success({ message: 'Facture modifiée avec succès' });
        
      })
      .catch((error) => {
        notification.error({
          description:
            error?.response?.data?.error ||
            `Un erreur lors de la modification de la facture "${values?.numero}"`,
        });
      });
  };

  return (
    <>
      <Button icon={<EditOutlined />} type="primary" size="small" onClick={handleUpdate}>Modifier</Button>

      <Modal
        title={"Modifier la facture "+ record?.numero}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingFacture(null);
        }}
        footer={null}
      >
        <Form
          form={editForm}
          name="editFactureForm"
          initialValues={editingFacture}
          layout="vertical"
          onFinish={handleEditFacture}
        >
          <Form.Item
            name="numero"
            label="Numéro de facture"
            rules={[
              { required: true, message: "Veuillez saisir le numéro de la facture!" },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[
              { required: true, message: "Veuillez saisir la date de la facture!" },
            ]}
          >
            <Input type="Date" />
          </Form.Item>
          <Form.Item
  name="client"
  label="Client"
  rules={[
    {
      required: true,
      message: "Veuillez choisir le client!",
    },
  ]}
>
<Input disabled />
 
</Form.Item>

          <Form.Item
            name="montant"
            label="Montant"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant de la facture!",
              },
            ]}
          >
            <Input type="number"step="0.001" />
          </Form.Item>
          <Form.Item
            name="delai"
            label="Délai en jours"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le délai de la facture!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="montantEncaisse"
            label="Montant Encaisse"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant encaisse de la facture!",
              },
            ]}
          >
            <Input type="number" step="0.001" />
          </Form.Item>
          <Form.Item
            name="solde"
            label="Solde"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le solde de la facture!",
              },
            ]}
          >
            <Input type="number" step="0.001" />
          </Form.Item>
          <Form.Item
            name="echeance"
            label="Echéance"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date d'échéance de la facture!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="retard"
            label="Retard"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le retard de la facture!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="statut"
            label="Statut"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le statut de la facture!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="dateFinalisation"
            label="Date Finalisation"
          >
            <Input  disabled  />
          </Form.Item>
          <Form.Item
            name="actionRecouvrement"
            label="Action de recouvrement"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'action de recouvrement de la facture!",
              },
            ]}
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

export default UpdateFactureForm;
