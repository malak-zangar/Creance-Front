import { Button, Form, Input, Modal, notification, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { EditOutlined } from '@ant-design/icons';
import moment from "moment";
import api from "../../../utils/axios";

function UpdateContratForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  const handleUpdate = () => {
    editForm.setFieldsValue({
      ...record,
      dateDebut: moment(record.dateDebut),
      dateProchaineAction: moment(record.dateProchaineAction),
      dateRappel: moment(record.dateRappel),
    });
    setIsEditModalVisible(true);
  };

  const handleEditContrat = (values) => {
    const formattedValues = {
      ...values,
      dateDebut: values.dateDebut.format("YYYY-MM-DD"),
      dateProchaineAction: values.dateProchaineAction.format("YYYY-MM-DD"),
      dateRappel: values.dateRappel.format("YYYY-MM-DD"),
    };
  
    api
      .put(`/contrat/updateContrat/${record.key}`, formattedValues)
      .then((response) => {
        handleState({
          ...formattedValues,
          key: record.key,
        });
        setIsEditModalVisible(false);
        notification.success({ message: 'Contrat modifié avec succès' });
      })
      .catch((error) => {
        notification.error({
          description: error?.response?.data?.error || `Une erreur lors de la modification du contrat "${values?.reference}"`,
        });
      });
  };
  

  return (
    <>
      <Button icon={<EditOutlined />} type="primary" size="small" onClick={handleUpdate}>Modifier</Button>

      <Modal
        title={`Modifier le contrat ${record?.reference}`}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
        }}
        footer={null}
        style={{ top: 15 }}
      >
        <Form
          form={editForm}
          name="editContratForm"
          initialValues={record}
          layout="vertical"
          onFinish={handleEditContrat}
        >
          <Form.Item
            name="reference"
            label="Référence du contrat"
            rules={[
              { required: true, message: "Veuillez saisir la référence du contrat!" },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateDebut"
            label="Date Début"
            rules={[
              { required: true, message: "Veuillez saisir la date de début du contrat!" },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <DatePicker format="YYYY-MM-DD" />
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
            style={{ marginBottom: '8px' }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="delai"
            label="Délai de paiement (en jours)"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le délai de paiement (en jours) du contrat!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="conditionsFinancieres"
            label="Conditions Financières"
            rules={[
              {
                required: true,
                message: "Veuillez saisir les conditions financières du contrat!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="prochaineAction"
            label="Prochaine action"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la prochaine action du contrat!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="dateProchaineAction"
            label="Date de prochaine action"
            rules={[
              { required: true, message: "Veuillez saisir la date de la prochaine action du contrat!" },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="dateRappel"
            label="Date de rappel pour renégociation"
            rules={[
              { required: true, message: "Veuillez saisir la date de rappel du contrat!" },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <DatePicker format="YYYY-MM-DD" />
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

export default UpdateContratForm;
