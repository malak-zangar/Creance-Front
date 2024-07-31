/*import {
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

const { Option } = Select;

export const AddEncaissementForm = ({ handleState }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedFacture, setSelectedFacture] = useState(null); // Ajout de l'état pour la facture sélectionnée

  const fetchClients = async () => {
    try {
      const response = await api.get('/facture/getClientsWithActiveUnpaidInvoices');
      setClients(response.data.map((client) => ({
        id: client.id,
        username: client.username,
      })));
    } catch (error) {
      notification.error({ message: 'Failed to fetch clients' });
    }
  };

  const fetchFactures = (clientId) => {
    api
      .get(`/facture/getByClient/actif/${clientId}`)
      .then((response) => {
        if (response.data) {
          setFactures(response.data);
          console.log(response.data);
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

  const handleFactureChange = (value) => {
    const facture = factures.find((facture) => facture.id === value);
    setSelectedFacture(facture); // Mettre à jour l'état de la facture sélectionnée
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

    Modal.confirm({
      title: 'Confirmer l\'ajout du paiement',
      content: (
        <div>
          <p><strong>Référence:</strong> {values.reference}</p>
          <p><strong>Client:</strong> {clients.find(client => client.id === values.client)?.username}</p>
          <p><strong>Facture:</strong> {selectedFacture.numero}</p>
          <p><strong>Montant encaissé:</strong> {values.montantEncaisse} {selectedFacture.devise}</p>
          <p><strong>Mode de règlement:</strong> {values.modeReglement}</p>
          <p><strong>Date de paiement:</strong> {values.date.format("YYYY-MM-DD")}</p>
        </div>
      ),
      okText: 'Confirmer',
      cancelText: 'Annuler',
      onOk: () => {
        api
          .post("/encaissement/create", dataToSend)
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
                `Une erreur est survenue lors de la création du paiement "${values?.reference}"`,
            });
          });
      },
      onCancel() {
        console.log('Ajout du paiement annulé');
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
        Ajouter un Paiement
      </Button>
      <Modal
        title="Ajouter un nouveau paiement"
        visible={showAddForm}
        onCancel={handleCancel}
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
*/

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
import moment from "moment";

const { Option } = Select;

export const AddEncaissementForm = ({ handleState }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [modeReglement, setModeReglement] = useState(""); // New state for payment mode
  const [factureMontantTotal, setFactureMontantTotal] = useState(null);
  const [factureSolde, setFactureSolde] = useState(null);

  const fetchClients = async () => {
    try {
      const response = await api.get("/facture/getClientsWithUnpaidInvoices");
      setClients(
        response.data.map((client) => ({
          id: client.id,
          username: client.username,
        }))
      );
    } catch (error) {
      notification.error({ message: "Failed to fetch clients" });
    }
  };

  const fetchFactures = (clientId) => {
    api
      .get(`/facture/getByClient/actif/${clientId}`)
      .then((response) => {
        if (response.data) {
          setFactures(response.data);
          console.log(response.data);
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
    addForm.validateFields(["montantEncaisse"]);
  }, [addForm]);

  const handleClientChange = (value) => {
    if (value) {
      fetchFactures(value);
    } else {
      setFactures([]);
    }
  };

  const handleFactureChange = (value) => {
    const facture = factures.find((facture) => facture.id === value);
    setSelectedFacture(facture);
    setFactureMontantTotal(facture.montant); // Assurez-vous que 'montantTotal' est un champ de votre facture
    setFactureSolde(facture.solde);
  };

  const handleModeReglementChange = (value) => {
    setModeReglement(value);
    // Réinitialiser reference field when payment mode changes
    addForm.setFieldsValue({ reference: "" });
  };

  const handleAddEncaissement = (values) => {
    const factureId = values.facture;
    console.log(factureId)
    const selectedFacture = factures.find(
      (facture) => facture.id === factureId
    );
    if (!selectedFacture) {
      notification.error({
        description: "Veuillez sélectionner une facture valide.",
      });
      return;
    }

    // Determine the prefix based on the mode of payment
    let referenceWithPrefix = values.reference;
    if (modeReglement === "Chèque") {
      referenceWithPrefix = " CH" + referenceWithPrefix;
    } else if (modeReglement === "Virement") {
      referenceWithPrefix = " VIR" + referenceWithPrefix;
    }

    const dataToSend = {
      ...values,
      facture_numero: factureId,
      date: values.date.format("YYYY-MM-DD"),
      reference: referenceWithPrefix, // Include the suffix in the reference
    };

    Modal.confirm({
      title: "Confirmer l'ajout du paiement",
      content: (
        <div>
          <p>
            <strong>Référence:</strong> {referenceWithPrefix}
          </p>
          <p>
            <strong>Client:</strong>{" "}
            {clients.find((client) => client.id === values.client)?.username}
          </p>
          <p>
            <strong>Facture:</strong> {selectedFacture.numero}
          </p>
          <p>
            <strong>Montant encaissé:</strong> {values.montantEncaisse}{" "}
            {selectedFacture.devise}
          </p>
          <p>
            <strong>Mode de règlement:</strong> {values.modeReglement}
          </p>
          <p>
            <strong>Date de paiement:</strong>{" "}
            {values.date.format("YYYY-MM-DD")}
          </p>
        </div>
      ),
      okText: "Confirmer",
      cancelText: "Annuler",
      onOk: () => {
        api
          .post("/encaissement/create", dataToSend)
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
                `Une erreur est survenue lors de la création du paiement "${values?.reference}"`,
            });
          });
      },
      onCancel() {
        console.log("Ajout du paiement annulé");
      },
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    addForm.resetFields();
    setSelectedFacture(null);
    setFactures([]);
  };

  const handleDisabledDate = (current) => {
    const currentDate = moment();
    console.log(selectedFacture);
    if (!selectedFacture) {
      return currentDate ? current > currentDate.startOf("day") : false;
    }

    const dateDebutFacture = moment(selectedFacture.date);
    console.log(dateDebutFacture); // Utiliser la date de début de la facture
    return (
      current < dateDebutFacture.startOf("day") ||
      current > currentDate.endOf("day")
    ); // Désactiver les dates avant la date de début
  };

  const validateMontantEncaisse = () => {
    const solde = selectedFacture?.solde;
    console.log(solde);
    const montantEncaisse = addForm.getFieldValue("montantEncaisse");
    console.log(montantEncaisse);

    if (montantEncaisse > solde || montantEncaisse < 1) {
      return Promise.reject(
        new Error(
          "Le montant encaissé ne doit pas dépasser le solde de la facture et doit etre supérieur à 1!"
        )
      );
    }
    return Promise.resolve();
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
        onCancel={handleCancel}
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
            name="modeReglement"
            label="Mode de règlement"
            rules={[
              {
                required: true,
                message: "Veuillez choisir le mode de règlement de paiement!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Select
              placeholder="Sélectionner un mode de règlement"
              onChange={handleModeReglementChange}
            >
              <Option value="Chèque">Chèque</Option>
              <Option value="Virement">Virement</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="reference"
            label={
              modeReglement === "Chèque"
                ? "Numéro de chèque"
                : modeReglement === "Virement"
                ? "Numéro de Virement"
                : "Référence"
            }
            rules={[
              {
                required: true,
                message: "Veuillez saisir la référence du paiement!",
              },
              {
                pattern: /^[^\s]{3,20}$/,
                message:
                  "La référence ne doit pas contenir d'espaces et doit avoir entre 3 et 20 caractères!",
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
            <>
              <Form.Item
                label={`Montant Total TTC de la Facture (${selectedFacture.devise})`}
                style={{ marginBottom: "8px" }}
              >
                <Input value={selectedFacture.montant} disabled />
              </Form.Item>
              <Form.Item
                label={`Solde de la Facture (${selectedFacture.devise})`}
                style={{ marginBottom: "8px" }}
              >
                <Input value={selectedFacture.solde} disabled />
              </Form.Item>
              <Form.Item
                name="montantEncaisse"
                label={`Montant à encaisser (${selectedFacture.devise})`}
                rules={[
                  {
                    required: true,
                    message:
                      "Veuillez saisir le montant encaissé du paiement !",
                  },
                  {
                    validator: validateMontantEncaisse,
                  },
                ]}
                style={{ marginBottom: "8px" }}
              >
                <Input
                  type="number"
                  min={1}
                  step="0.001"
                  placeholder="Montant à encaisser "
                />
              </Form.Item>
            </>
          )}
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
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={handleDisabledDate}
            />
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
