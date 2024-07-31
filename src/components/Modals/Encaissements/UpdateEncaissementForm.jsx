/*import { Button, Form, Input, Modal, notification, Space } from "antd";
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

  const handleCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue({ ...record });
  };

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
            `Une erreur lors de la modification du paiement "${values?.reference}"`,
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

export default UpdateEncaissementForm;
*/

import { Button, DatePicker, Form, Input, Modal, notification, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { EditOutlined } from '@ant-design/icons';
import api from "../../../utils/axios";
import moment from "moment";

function UpdateEncaissementForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm] = Form.useForm();

  const [facture, setFacture] = useState(null); // État pour stocker la facture associée
 
  useEffect(() => {
    if (record?.facture) {
      api
        .get(`/facture/getByID/${record.facture_id}`)
        .then((response) => {
          setFacture(response.data.facture); 
        })
    }

    editForm.validateFields(["montantEncaisse"]);

  }, [record,editForm]);

  const handleCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue({ ...record });
  };

  const handleUpdate = () => {
    editForm.setFieldsValue({ ...record });
    setIsEditModalVisible(true);
  };

  const handleConfirmEdit = (values) => {
    Modal.confirm({
      title: 'Confirmer la modification',
      content: 'Êtes-vous sûr de vouloir modifier ce paiement?',
      okText: 'Oui',
      cancelText: 'Non',
      onOk: () => handleEditEncaissement(values),
    });
  };

  const handleEditEncaissement = (values) => {
    api
      .put(`/encaissement/updateEncaissement/${record.key}`, values)
      .then((response) => {
        handleState({
          ...values,
          key: record.key,
          date: values.date.format("YYYY-MM-DD"),

        });
        setIsEditModalVisible(false);
        notification.success({ message: "Encaissement modifié avec succès" });
      })
      .catch((error) => {
        notification.error({
          description:
            error?.response?.data?.error ||
            `Une erreur lors de la modification du paiement "${values?.reference}"`,
        });
      });
  };

  const validateMontantEncaisse = () => {
    const solde = facture?.solde;
    console.log(solde);
    const montantEncaisse = editForm.getFieldValue("montantEncaisse");
    console.log(montantEncaisse);

    if (montantEncaisse > solde || montantEncaisse < 1) {
      return Promise.reject(
        new Error(
          "Le montant encaissé doit etre supérieur à 1!"
        )
      );
    }
    return Promise.resolve();
  };

  return (
    <>  <Tooltip title="Modifier">
      <Button
        icon={<EditOutlined />}
        size="small"
        onClick={handleUpdate}
      >
        
      </Button>
      </Tooltip>
      <Modal
        title={"Modifier le paiement " + record?.reference}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingUser(null);
        }}
        footer={null}
        style={{ top: 15 }}
      >
        <Form
          form={editForm}
          name="editEncaissementForm"
          initialValues={editingUser}
          layout="vertical"
          onFinish={handleConfirmEdit}
        >
            <Form.Item
            name="modeReglement"
            label="Mode de règlement"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le mode de règlement du paiement!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="reference"
            label="Référence du paiement"
            rules={[
              { required: true, message: "Veuillez saisir la référence du paiement!" },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="facture"
            label="Facture"
            rules={[
              { required: true, message: "Veuillez choisir la facture correspondante à ce paiement!" },
            ]}
            style={{ marginBottom: '8px' }}
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
            ]}
            style={{ marginBottom: '8px' }}
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
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input type="date"
            
            />
          </Form.Item>

        
          <Form.Item
            name="montantEncaisse"
            label={`Montant encaissé en ${record?.devise}`}
          
            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant encaissé du paiement!",
              },
              {
                validator: validateMontantEncaisse,
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input type="number"   min={1}
                  step="0.001"
                  placeholder="Montant à encaisser " />
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

export default UpdateEncaissementForm;
