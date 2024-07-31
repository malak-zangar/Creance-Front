import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Select,
  DatePicker,
  Space,
  Upload,
} from "antd";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { AddClientForm } from "../Clients/AddClientForm";
import api from "../../../utils/axios";

export const AddContratForm = ({ handleState }) => {
  const { Option } = Select;
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [contratFile1, setContratFile1] = useState(null);
  const [type, setType] = useState(null);
  const [typeFrequenceFacturation, setTypeFrequenceFacturation] = useState(null);
  const { TextArea } = Input;

  const fetchClients = () => {
    api
      .get("/user/getAll")
      .then((response) => {
        setClients(
          response.data.map((client) => ({
            id: client.id,
            username: client.username,
          }))
        );
      })
      .catch((error) => {
        notification.error({ message: "Erreur lors de la récupération des clients", description: error.message });
      });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const generateContractRef = (clientUsername, contratType) => {
    const randomNumber = Math.floor(Math.random() * 10000); // Generates a random number between 0 and 9999
    const clientPart = clientUsername ? clientUsername.slice(0, 3).toUpperCase() : 'CLT';
    let contratPart;
    if (contratType === 'Jour Homme') {
      contratPart = 'JH';
    } else {
      contratPart = contratType ? contratType.slice(0, 3).toUpperCase() : 'CNT';
    }
    const contractRef = `${clientPart}-${contratPart}-${randomNumber}`;
    addForm.setFieldsValue({ reference: contractRef });
  };

  const handleAddContrat = () => {
    addForm.validateFields()
      .then(values => {
        const clientId = values.client;
        const dataToSend = {
          ...values,
          client_id: clientId,
          dateDebut: values.dateDebut.format("YYYY-MM-DD"),
          dateFin: values.dateFin.format("YYYY-MM-DD"),
          contratFile: contratFile1,
        };
        Modal.confirm({
          title: 'Confirmer l\'ajout du contrat',
          content: (
            <div>
              <p>Êtes-vous sûr de vouloir ajouter ce contrat ?</p>
              <p><strong>Référence:</strong> {values.reference}</p>
              <p><strong>Date Début:</strong> {values.dateDebut.format("YYYY-MM-DD")}</p>
              <p><strong>Date Fin:</strong> {values.dateFin.format("YYYY-MM-DD")}</p>
              <p><strong>Client:</strong> {clients.find(client => client.id === values.client)?.username}</p>
              <p><strong>Délai de paiement:</strong> {values.delai} jours</p>
              <p><strong>Type:</strong> {values.type}</p>
              {values.type === 'Forfait' && (
                <>
                  <p><strong>Montant total du contrat (TTC):</strong> {values.total}</p>
                  {typeFrequenceFacturation === 'Mensuelle' && (
                    <p><strong>Montant à facturer par Mois:</strong> {values.montantParMois}</p>
                  )}
                </>
              )}
              {values.type === 'Jour Homme' && (
                <p><strong>Prix du jour/homme:</strong> {values.prixJourHomme}</p>
              )}
              {values.type === 'Mix' && (
                <>
                  <p><strong>Montant total du contrat (TTC):</strong> {values.total}</p>
                  <p><strong>Prix du jour/homme:</strong> {values.prixJourHomme}</p>
                </>
              )}
              <p><strong>Fréquence de facturation:</strong> {values.typeFrequenceFacturation}</p>
              {values.typeFrequenceFacturation === 'Spécifique' && (
                <p><strong>Détails spécifiques:</strong> {values.detailsFrequence}</p>
              )}
              <p><strong>Devise:</strong> {values.devise}</p>
            </div>
          ),
          okText: 'Confirmer',
          cancelText: 'Annuler',
          onOk: () => {
            api.post("/contrat/create", dataToSend)
              .then((response) => {
                notification.success({ message: "Contrat ajouté avec succès" });
                setShowAddForm(false);
                handleState({
                  ...response.data.contrat,
                  key: response.data.contrat.id,
                });
                addForm.resetFields();
              })
              .catch((error) => {
                notification.error({
                  description:
                    error?.response?.data?.erreur ||
                    `Une erreur est survenue lors de la création du contrat "${values?.reference}"`,
                });
              });
          },
          onCancel() {
            console.log('Ajout du contrat annulé');
          },
        });
      })
      .catch(error => {
        notification.error('Validation échouée:', error);
      });
  };

  const handleSelectClient = (client) => {
    setClients((prevClients) => [...prevClients, client]);
    addForm.setFieldsValue({ client: client.id });
    generateContractRef(client, null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    addForm.resetFields();
    setContratFile1(null);
  };

  const handleFileChange = (info) => {
    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Content = event.target.result.split(",")[1];
        setContratFile1(base64Content);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTypeChange = (value) => {
    const clientId = addForm.getFieldValue('client');
    const clientUsername = clients.find(client => client.id === clientId)?.username;
    generateContractRef(clientUsername, value);
    setType(value);
    if (value === 'Forfait') {
      addForm.setFieldsValue({ prixJourHomme: null });
    } else if (value === 'Jour Homme') {
      addForm.setFieldsValue({ total: null });
    }
  };

  const handleFrequenceChange = (value) => {
    setTypeFrequenceFacturation(value);
    if (value === 'Spécifique') {
      addForm.setFieldsValue({ montantParMois: null });
    } else {
      if (value === "Mensuelle" && type === 'Forfait') {
        addForm.setFieldsValue({ montantParMois: addForm.getFieldValue('montantParMois') });
      }
    }
  };

  const validateDelai = (e) => {
    let value = e.target.value;
    value = value.replace(/,/g, ""); 
    if (parseInt(value, 10) < 1) {
      value = 1;
    }
    addForm.setFieldsValue({ delai: value });
  };

    // Function to update the minDate for the end date based on the start date
    const handleDateDebutChange = (date, dateString) => {
      addForm.setFieldsValue({ dateDebut: date });
      if (date) {
        addForm.setFieldsValue({ dateFin: null });
      }
    };
  
    const handleDateFinDisabledDate = (current) => {
      const dateDebut = addForm.getFieldValue('dateDebut');
      return dateDebut ? current <= dateDebut.startOf('day') : false;
    };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setShowAddForm(true)}
        icon={<PlusCircleOutlined />}
      >
        Ajouter un Contrat
      </Button>
      <Modal
        title="Ajouter un nouveau contrat"
        visible={showAddForm}
        onCancel={handleCancel}
        footer={null}
        style={{ top: 15 }}
      >
        <Form
          layout="vertical"
          name="addFactureForm"
          onFinish={handleAddContrat}
          form={addForm}
        >
          <Form.Item
            name="reference"
            label="Référence du contrat"
            style={{ marginBottom: "8px" }}
          >
            <Input readOnly disabled />
          </Form.Item>
          <Form.Item
            name="dateDebut"
            label="Date de début"
            rules={[{ required: true, message: "Veuillez sélectionner la date de début!" }]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker
              style={{ width: "100%" }}
              onChange={handleDateDebutChange}
            />
          </Form.Item>
          <Form.Item
            name="dateFin"
            label="Date de fin"
            rules={[{ required: true, message: "Veuillez sélectionner la date de fin!" }]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={handleDateFinDisabledDate}
            />
          </Form.Item>
          <Form.Item
            name="client"
            label="Client"
            rules={[{ required: true, message: "Veuillez sélectionner un client!" }]}
            style={{ marginBottom: "8px" }}
          >
            <Select
              showSearch
              placeholder="Sélectionner un client"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ display: "flex", padding: 8 }}>
                    <AddClientForm onClientAdded={handleSelectClient} />
                  </div>
                </>
              )}
            >
              {clients.map((client) => (
                <Option key={client.id} value={client.id}>
                  {client.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="delai"
            label="Délai de paiement (en jours)"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le délai de paiement!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input
              type="number"
              placeholder="Délai de paiement (en jours)"
              min={1}
              onChange={validateDelai}
              onKeyPress={(e) => {
                if (e.key === ",") {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type de contrat"
            rules={[{ required: true, message: "Veuillez sélectionner le type de contrat!" }]}
            style={{ marginBottom: "8px" }}
          >
            <Select placeholder="Sélectionner un type de contrat" onChange={handleTypeChange}>
              <Option value="Forfait">Forfait</Option>
              <Option value="Jour Homme">Jour Homme</Option>
              <Option value="Mix">Mix</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="devise"
            label="Devise"
            rules={[
              { required: true, message: "Veuillez sélectionner la devise!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Select placeholder="Sélectionner la devise">
              <Option value="USD">USD</Option>
              <Option value="EUR">EUR</Option>
              <Option value="TND">TND</Option>
             
            </Select>
          </Form.Item>
          {type === "Forfait" && (
            <Form.Item
              name="total"
              label="Montant total du contrat (TTC)"
              rules={[
                { required: true, message: "Veuillez saisir le montant total du contrat!" },
              ]}
              style={{ marginBottom: "8px" }}
            >
              <Input type="number" min={1} step="0.001" placeholder="Montant total (TTC)" />
            </Form.Item>
          )}
          {type === "Jour Homme" && (
            <Form.Item
              name="prixJourHomme"
              label="Prix du jour/homme"
              rules={[
                { required: true, message: "Veuillez saisir le prix du jour/homme!" },
              ]}
              style={{ marginBottom: "8px" }}
            >
              <Input type="number" min={1} step="0.001" placeholder="Prix du jour/homme" />
            </Form.Item>
          )}
          {type === "Mix" && (
            <>
              <Form.Item
                name="total"
                label="Montant total du contrat (TTC)"
                rules={[
                  { required: true, message: "Veuillez saisir le montant total du contrat!" },
                ]}
                style={{ marginBottom: "8px" }}
              >
                <Input type="number" min={1} step="0.001" placeholder="Montant total (TTC)" />
              </Form.Item>
              <Form.Item
                name="prixJourHomme"
                label="Prix du jour/homme"
                rules={[
                  { required: true, message: "Veuillez saisir le prix du jour/homme!" },
                ]}
                style={{ marginBottom: "8px" }}
              >
                <Input type="number" step="0.001" min={1} placeholder="Prix du jour/homme" />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="typeFrequenceFacturation"
            label="Fréquence de facturation"
            rules={[{ required: true, message: "Veuillez sélectionner la fréquence de facturation!" }]}
            style={{ marginBottom: "8px" }}
          >
            <Select placeholder="Sélectionner la fréquence de facturation" onChange={handleFrequenceChange}>
              <Option value="Mensuelle">Mensuelle</Option>
              <Option value="Spécifique">Spécifique</Option>
            </Select>
          </Form.Item>
          {typeFrequenceFacturation === "Mensuelle" && type === "Forfait" && (
            <Form.Item
              name="montantParMois"
              label="Montant à facturer par Mois"
              rules={[
                { required: true, message: "Veuillez saisir le montant à facturer par mois!" },
              ]}
              style={{ marginBottom: "8px" }}
            >
              <Input type="number" min={1} step="0.001" placeholder="Montant par mois" />
            </Form.Item>
          )}
          {typeFrequenceFacturation === "Spécifique" && (
            <Form.Item
              name="detailsFrequence"
              label="Détails spécifiques de la fréquence"
              rules={[
                { required: true, message: "Veuillez saisir les détails spécifiques!" },
              ]}
              style={{ marginBottom: "8px" }}
            >
              <TextArea rows={4} placeholder="Détails spécifiques de la fréquence" />
            </Form.Item>
          )}
  
          <Form.Item
            name="contratFile"
            label="Fichier de contrat"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            style={{ marginBottom: "8px" }}
          >
            <Upload
              name="contratFile"
              listType="text"
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>Cliquez pour télécharger</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Ajouter
              </Button>
              <Button onClick={handleCancel}>Annuler</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
