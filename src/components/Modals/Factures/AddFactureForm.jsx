import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Space,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import api from "../../../utils/axios";

export const AddFactureForm = ({ handleState }) => {
  const { Option } = Select;
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [contrats, setContrats] = useState([]);

  const fetchClients = () => {
    api
      .get("/user/getAllActif")
      .then((response) => {
        setClients(
          response.data.map((client) => ({
            id: client.id,
            username: client.username,
          }))
        );
      })
      .catch((error) => {
        notification.error("Error fetching clients:", error);
      });
  };

  const fetchContrats = (clientId) => {
    api
      .get(`/contrat/getByClient/${clientId}`)
      .then((response) => {
        if (response.data.contracts) {
          setContrats([response.data.contracts]);
        } else {
          setContrats([]);
        }
      })
      .catch((error) => {
        notification.error("Error fetching contrats:", error);
      });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleClientChange = (value) => {
    if (value) {
      fetchContrats(value);
      generateInvoiceNumber(value, null); // Regenerate invoice number if only client is selected
    } else {
      setContrats([]);
      generateInvoiceNumber(null, null); // Reset invoice number if no client is selected
    }
  };

  const handleContratChange = (value) => {
    const clientId = addForm.getFieldValue('client');
    generateInvoiceNumber(clientId, value); // Regenerate invoice number if contract is selected
  };

  const generateInvoiceNumber = (clientId, contratId) => {
    const client = clients.find((client) => client.id === clientId);
    const contrat = contrats.find((contrat) => contrat.id === contratId);
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999

    const clientPart = client ? client.username.slice(0, 3).toUpperCase() : 'CLT';
    const contratPart = contrat ? contrat.reference.slice(0, 3).toUpperCase() : 'CNT';
    const invoiceNumber = `${clientPart}-${contratPart}-${randomNumber}`;

    addForm.setFieldsValue({ numero: invoiceNumber });
  };

  const handleAddFacture = (values) => {
    const contratId = values.contrat;

    const dataToSend = {
      ...values,
      contrat_id: contratId,
      date: values.date.format('YYYY-MM-DD'),
    };

    Modal.confirm({
      title: 'Confirmer l\'ajout de la facture',
      content: (
        <div>
          <p><strong>Numéro:</strong> {values.numero}</p>
          <p><strong>Client:</strong> {clients.find(client => client.id === values.client)?.username}</p>
          <p><strong>Contrat:</strong> {contrats.flat().find(contrat => contrat.id === values.contrat)?.reference}</p>
          <p><strong>Montant:</strong> {values.montant}</p>
          <p><strong>Délai de paiement:</strong> {values.delai} jours</p>
          <p><strong>Montant encaissé:</strong> {values.montantEncaisse}</p>
          <p><strong>Action de recouvrement:</strong> {values.actionRecouvrement}</p>
          <p><strong>Date de facture:</strong> {values.date.format('YYYY-MM-DD')}</p>
        </div>
      ),
      okText: 'Confirmer',
      cancelText: 'Annuler',
      onOk: () => {
        api
          .post("/facture/create", dataToSend)
          .then((response) => {
            notification.success({ message: "Facture ajoutée avec succès" });

            setShowAddForm(false);
            handleState({
              ...response.data.facture,
              key: response.data.facture.id,
            });
            addForm.resetFields();
          })
          .catch((error) => {
            notification.error({
              description:
                error?.response?.data?.erreur ||
                `Une erreur est survenue lors de la création de la facture "${values?.numero}"`,
            });
          });
      },
      onCancel() {
        console.log('Ajout de la facture annulé');
      },
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    addForm.resetFields();
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setShowAddForm(true)}
        icon={<PlusCircleOutlined />}
      >
        Ajouter une Facture
      </Button>
      <Modal
        title="Ajouter une nouvelle facture"
        visible={showAddForm}
        onCancel={handleCancel}
        footer={null}
        style={{ top: 15 }}
      >
        <Form
          layout="vertical"
          name="addFactureForm"
          onFinish={handleAddFacture}
          form={addForm}
        >
          <Form.Item
            name="numero"
            label="Numéro de facture"
            style={{ marginBottom: '8px' }}
          >
            <Input readOnly  />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[
              { required: true, message: "Veuillez saisir la date de la facture!" },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <DatePicker style={{ width: "100%" }} />
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
            <Select
              placeholder="Sélectionner un client"
              allowClear
              onChange={handleClientChange}
            >
              {clients.map((client) => (
                <Option key={client.id} value={client.id}>
                  {client.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {contrats.length > 0 && (
            <Form.Item
              name="contrat"
              label="Contrat"
              rules={[
                {
                  required: true,
                  message: "Veuillez choisir le contrat!",
                },
              ]}
              style={{ marginBottom: '8px' }}
            >
              <Select placeholder="Sélectionner un contrat" allowClear onChange={handleContratChange}>
                {contrats.flat().map((contrat) => (
                  <Option key={contrat.id} value={contrat.id}>
                    {contrat.reference}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            name="montant"
            label="Montant"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant de la facture!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input type="number" step="0.001" />
          </Form.Item>
          <Form.Item
            name="delai"
            label="Délai de paiement (en jours)"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le délai de paiement (en jours) de la facture!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="montantEncaisse"
            label="Montant Encaisse"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant encaissé de la facture!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input type="number" step="0.001" />
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
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Ajouter
              </Button>
              <Button key="cancel" onClick={handleCancel}>
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
