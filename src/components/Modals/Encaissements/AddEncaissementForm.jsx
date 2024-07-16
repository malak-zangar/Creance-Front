import { Button, DatePicker, Form, Input, Modal, notification, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState, useEffect } from "react";

const { Option } = Select;

export const AddEncaissementForm = ({ handleState }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedFacture, setSelectedFacture] = useState(null); // Ajout de l'état pour la facture sélectionnée

  /*const fetchClients = () => {
    axios
      .get("http://localhost:5555/user/getAllActif")
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
  };*/

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5555/facture/getClientsWithActiveUnpaidInvoices');
      setClients(    response.data.map((client) => ({
        id: client.id,
        username: client.username,
      })));
    } catch (error) {
      notification.error({ message: 'Failed to fetch clients' });
    }
  };

  const fetchFactures = (clientId) => {
    axios
      .get(`http://localhost:5555/facture/getByClient/actif/${clientId}`)
      .then((response) => {
        if (response.data) {
          setFactures(response.data);
          console.log(response.data)
        } else {
          setFactures([]);
        }
      })
      .catch((error) => {
        notification.error("Error fetching factures:", error);
      });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleClientChange = (value) => {
    if (value) {
      fetchFactures(value);
    } else {
      setFactures([]);
    }
  };

  const handleAddEncaissement = (values) => {
    const factureId = values.facture;
    const selectedFacture = factures.find((facture) => facture.id === factureId);
    if (!selectedFacture) {
      notification.error({
        description: "Veuillez sélectionner une facture valide.",
      });
      return;
    }

    const dataToSend = {
      ...values,
      facture_numero: factureId,
      date: values.date.format("YYYY-MM-DD"),
    };
    axios
      .post("http://localhost:5555/encaissement/create", dataToSend)
      .then((response) => {
        console.log("Paiement added successfully:", response.data);
        notification.success({ message: "Paiement ajouté avec succès" });

        setShowAddForm(false);
        handleState({
          ...response.data.encaissement,
          key: response.data.encaissement.id,
        });
        addForm.resetFields();
      })
      .catch((error) => {
        notification.error({
          description:
            error?.response?.data?.erreur ||
            `Un erreur lors de la creation du paiement "${values?.reference}"`,
        });
      });
  };

  const handleFactureChange = (value) => {
    const facture = factures.find((facture) => facture.id === value);
    setSelectedFacture(facture); // Mettre à jour l'état de la facture sélectionnée
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setShowAddForm(true)}
        icon={<PlusCircleOutlined />}
      >
        Ajouter un Paiement
      </Button>
      <Modal
        title="Ajouter un nouveau paiement"
        visible={showAddForm}
        onCancel={() => setShowAddForm(false)}
        footer={null}
        style={{ top: 15 }}
      >
        <Form
          layout="vertical"
          name="addEncaissementForm"
          onFinish={handleAddEncaissement}
          form={addForm}
        >
          <Form.Item
            name="reference"
            label="Référence de paiement"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la référence de paiement!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
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
            style={{ marginBottom: "8px" }}
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
          {factures.length > 0 && (
            <Form.Item
              name="facture"
              label="Facture"
              rules={[
                {
                  required: true,
                  message:
                    "Veuillez choisir la facture correspondante à ce paiement!",
                },
              ]}
              style={{ marginBottom: "8px" }}
            >
              <Select
                placeholder="Sélectionner une facture"
                allowClear
                onChange={handleFactureChange}
              >
                {factures.map((facture) => (
                  <Option key={facture.id} value={facture.id}>
                    {facture.numero}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          {selectedFacture && (
            <Form.Item
              name="montantEncaisse"
              label={`Montant encaissé (${selectedFacture.devise})`}
              rules={[
                {
                  required: true,
                  message:
                    "Veuillez saisir le montant encaissé du paiement !",
                },
              ]}
              style={{ marginBottom: "8px" }}
            >
              <Input type="number" step="0.001" />
            </Form.Item>
          )}
                    <Form.Item
            name="modeReglement"
            label="Mode de règlement"
            rules={[
              {
                required: true,
                message:
                  "Veuillez saisir le mode de règlement de paiement!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
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
            style={{ marginBottom: "8px" }}
          >
            <DatePicker style={{ width: "100%" }} />
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
