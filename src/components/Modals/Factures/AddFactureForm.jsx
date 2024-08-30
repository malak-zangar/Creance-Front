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

export const AddFactureForm = ({ handleState }) => {
  const { Option } = Select;
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [contratDevise, setContratDevise] = useState("");
  const [contratDateDebut, setContratDateDebut] = useState(moment());
  const [contratDateFin, setContratDateFin] = useState(moment());
  const [contratDelais, setContratDelais] = useState("");

  const fetchClients = () => {
    api
      .get("/user/getAllActif")
      .then((response) => {
        setClients(
          response.data
            .filter((client) => client.contratsEncours.length > 0)
            .map((client) => ({
              id: client.id,
              username: client.username,
            }))
        );
      })
      .catch((error) => {
        notification.error({
          message: "Error fetching clients:",
          description: error.message,
        });
      });
  };

  const handleDateCreationDisabledDate = (current) => {
    if (!contratDateDebut || !contratDateFin) {
      return false;
    }
    const currentDateWithDelai = current.clone().add(contratDelais, "days");
    return (
      current < contratDateDebut.startOf("day") ||
      currentDateWithDelai > contratDateFin.endOf("day")
    );
  };

  const fetchContrats = (clientId) => {
    api
      .get(`/contrat/getActualByClient/${clientId}`)
      .then((response) => {
        if (response.data.contracts) {
          setContrats([response.data.contracts]);
        } else {
          setContrats([]);
          setContratDelais(null);
        }
      })
      .catch((error) => {
        notification.error({
          message: "Erreur lors de la récupération des contrats:",
          description: error.message,
        });
      });
  };

  useEffect(() => {
    fetchClients();
    addForm.validateFields(["montant", "montantEncaisse"]);
  }, [addForm]);

  const handleClientChange = (value) => {
    if (value) {
      setContrats([]);
      setContratDelais(null);
      fetchContrats(value);
    } else {
      setContrats([]);
      setContratDelais(null);
    }
  };

  const handleContratChange = (value) => {
    const contrat = contrats.flat().find((contrat) => contrat.id === value);
    if (contrat) {
      setContratDevise(contrat.devise);
      setContratDelais(contrat.delai);
      setContratDateDebut(moment(contrat.dateDebut));
      setContratDateFin(moment(contrat.dateFin));
      addForm.setFieldsValue({ contratDelais: contrat.delai });
    } else {
      setContratDelais("");
      addForm.setFieldsValue({ contratDelais: "" });
    }
  };

  const handleAddFacture = (values) => {
    const contratId = values.contrat;

    const dataToSend = {
      ...values,
      contrat_id: contratId,
      date: values.date.format("YYYY-MM-DD"),
    };

    Modal.confirm({
      title: "Confirmer l'ajout de la facture",
      content: (
        <div>
          <p>
            <strong>Référence:</strong> {values.numero}
          </p>
          <p>
            <strong>Client:</strong>{" "}
            {clients.find((client) => client.id === values.client)?.username}
          </p>
          <p>
            <strong>Contrat:</strong>{" "}
            {
              contrats.flat().find((contrat) => contrat.id === values.contrat)
                ?.reference
            }
          </p>
          <p>
            <strong>Montant:</strong> {values.montant} {contratDevise}
          </p>
          <p>
            <strong>Délai de paiement:</strong> {values.contratDelais} jours
          </p>
          <p>
            <strong>Montant encaissé:</strong> {values.montantEncaisse}{" "}
            {contratDevise}
          </p>
          <p>
            <strong>Date de facture:</strong> {values.date.format("YYYY-MM-DD")}
          </p>
        </div>
      ),
      okText: "Confirmer",
      cancelText: "Annuler",
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
        console.log("Ajout de la facture annulé");
      },
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    addForm.resetFields();
    setContratDelais("");
    setContratDevise("");
    setContratDateDebut(moment());
    setContratDateFin(moment());
  };

  const validateMontant = (rule, value) => {
    const montantEncaisse = addForm.getFieldValue("montantEncaisse");

    const valueStr = value ? value.toString() : "";
    if (valueStr === "" || montantEncaisse === "") {
      return Promise.reject("Les montants doivent être des nombres valides!");
    }

    if (parseFloat(valueStr) < parseFloat(montantEncaisse)) {
      return Promise.reject(
        "Le montant ne peut pas être inférieur au montant encaissé!"
      );
    }

    const validPattern =
      contratDevise === "TND" ? /^\d+\.(\d{3})$/ : /^\d+\.(\d{2})$/;
    const message =
      contratDevise === "TND"
        ? "Le montant doit comporter exactement 3 décimales pour TND!"
        : "Le montant doit comporter exactement 2 décimales pour EUR ou USD!";

    if (!validPattern.test(valueStr)) {
      return Promise.reject(message);
    }

    return Promise.resolve();
  };

  const validateMontantEncaisse = (rule, value) => {
    const montant = addForm.getFieldValue("montant");
    if (value > montant) {
      return Promise.reject(
        "Le montant encaissé ne peut pas être supérieur au montant total!"
      );
    }
    const validPattern =
      contratDevise === "TND" ? /^\d+\.\d{3}$/ : /^\d+\.\d{2}$/;
    const message =
      contratDevise === "TND"
        ? "Le montant encaissé doit comporter exactement 3 décimales pour TND!"
        : "Le montant encaissé doit comporter exactement 2 décimales pour EUR ou USD!";
    if (!validPattern.test(value)) {
      return Promise.reject(message);
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
            label="Référence de facture"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la référence de la facture!",
              },
              {
                min: 3,
                message: "La référence doit comporter au moins 3 lettres!",
              },
              {
                max: 25,
                message: "La référence doit comporter au plus 25 lettres!",
              },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: "La référence doit être alphanumérique!",
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
              { required: true, message: "Veuillez sélectionner un client!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Select onChange={handleClientChange}>
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
                  message: "Veuillez sélectionner un contrat!",
                },
              ]}
              style={{ marginBottom: "8px" }}
            >
              <Select onChange={handleContratChange}>
                {contrats.flat().map((contrat) => (
                  <Option key={contrat.id} value={contrat.id}>
                    {contrat.reference}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="contratDelais"
            initialValue={contratDelais}
            label={`Délai de paiement (en jours)`}
            rules={[
              {
                required: true,
                message: "Veuillez saisir le délai de paiement!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input
              disabled
              type="number"
              placeholder="-"
              value={contratDelais}
            />
          </Form.Item>

          <Form.Item
            name="montant"
            label={`Montant TTC de la facture ( ${contratDevise} )`}
            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant!",
              },
              { validator: validateMontant },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input
              step={contratDevise === "TND" ? "0.001" : "0.01"}
              min={1}
              placeholder={contratDevise === "TND" ? "1.000" : "1.00"}
              onChange={(e) => e.target.value.replace(/,/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="montantEncaisse"
            label={`Montant encaissé de la facture ( ${contratDevise} )`}
            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant encaissé!",
              },
              { validator: validateMontantEncaisse },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input
              step={contratDevise === "TND" ? "0.001" : "0.01"}
              min={1}
              placeholder={contratDevise === "TND" ? "1.000" : "1.00"}
              onChange={(e) => e.target.value.replace(/,/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="date"
            label="Date de Facture"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner la date de la facture!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker
              format="YYYY/MM/DD"
              disabledDate={handleDateCreationDisabledDate}
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleCancel}>Annuler</Button>
              <Button type="primary" htmlType="submit">
                Ajouter la Facture
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
