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
   
    //const contratPart = contratType ? contratType.slice(0, 3).toUpperCase() : 'CNT';
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
          contratFile: contratFile1,
          //reference: generateReference(clientUsername, values.type),
        };

        Modal.confirm({
          title: 'Confirmer l\'ajout du contrat',
          content: (
            <div>
              <p>Êtes-vous sûr de vouloir ajouter ce contrat ?</p>
              <p><strong>Référence:</strong> {values.reference}</p>
              <p><strong>Date Début:</strong> {values.dateDebut.format("YYYY-MM-DD")}</p>
              <p><strong>Client:</strong> {clients.find(client => client.id === values.client)?.username}</p>
              <p><strong>Délai de paiement:</strong> {values.delai} jours</p>
              <p><strong>Type:</strong> {values.type}</p>
              {values.type === 'Forfait' && (
                <>
                  <p><strong>Total:</strong> {values.total}</p>
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
                  <p><strong>Total:</strong> {values.total}</p>
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
        // Gérer les erreurs de validation du formulaire si nécessaire
        console.error('Validation échouée:', error);
      });
  };

  const handleSelectClient = (client) => {
    setClients((prevClients) => [...prevClients, client]);
    addForm.setFieldsValue({ client: client.id });
    generateContractRef(client, null); // Regenerate invoice number if only client is selected

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

    generateContractRef(clientUsername, value); // Regenerate invoice number if contract is selected
    setType(value);
    if (value === 'Forfait') {
      addForm.setFieldsValue({ prixJourHomme: null });
    } else if (value === 'Jour Homme') {
      addForm.setFieldsValue({ total: null });
    } else {
      // Mix case: nothing to clear, just show relevant fields
    }
  };

  const handleFrequenceChange = (value) => {
    setTypeFrequenceFacturation(value);
    if (value === 'Spécifique') {
      addForm.setFieldsValue({ montantParMois: null });
    } else {
      // Mensuelle case: check if type is Forfait to set montantParMois
      if (type === 'Forfait') {
        addForm.setFieldsValue({ montantParMois: addForm.getFieldValue('montantParMois') });
      }
    }
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
          onFinish={handleAddContrat} // Le traitement de la confirmation se fait via handleAddContrat
          form={addForm}
        >
          <Form.Item
            name="reference"
            label="Référence du contrat"
          
            style={{ marginBottom: "8px" }}
          >
            <Input readOnly  />
          </Form.Item>
          <Form.Item
            name="dateDebut"
            label="Date Début"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date de début du contrat!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="client"
            label="Client"
            rules={[{ required: true, message: "Veuillez choisir le client!" }]}
            style={{ marginBottom: "8px" }}
          >
            <Select
              placeholder="Sélectionner un client"
              allowClear
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: "8px", cursor: "pointer" }}>
                    <AddClientForm handleState={handleSelectClient} />
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
                message:
                  "Veuillez saisir le délai de paiement (en jours) du contrat!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Veuillez sélectionner le type de contrat!" }]}
            style={{ marginBottom: "8px" }}
          >
            <Select onChange={handleTypeChange}>
              <Option value="Forfait">Forfait</Option>
              <Option value="Jour Homme">Jour Homme</Option>
              <Option value="Mix">Mix</Option>
            </Select>
          </Form.Item>
          {type === 'Forfait' && (
            <>
              <Form.Item
                name="total"
                label="Total"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le total!",
                  },
                ]}
                style={{ marginBottom: "8px" }}
              >
                <Input type="number" step="0.001" />
              </Form.Item>
              {typeFrequenceFacturation === 'Mensuelle' && (
                <Form.Item
                  name="montantParMois"
                  label="Montant à facturer par Mois"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez saisir le montant à facturer par mois!",
                    },
                  ]}
                  style={{ marginBottom: "8px" }}
                >
                  <Input type="number" step="0.001" />
                </Form.Item>
              )}
            </>
          )}
          {type === 'Jour Homme' && (
            <Form.Item
              name="prixJourHomme"
              label="Prix du jour/homme"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le prix du jour/homme!",
                },
              ]}
              style={{ marginBottom: "8px" }}
            >
              <Input type="number" step="0.001"/>
            </Form.Item>
          )}
          {type === 'Mix' && (
            <>
              <Form.Item
                name="total"
                label="Total"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le total!",
                  },
                ]}
                style={{ marginBottom: "8px" }}
              >
                <Input type="number" step="0.001"/>
              </Form.Item>
              <Form.Item
                name="prixJourHomme"
                label="Prix du jour/homme"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le prix du jour/homme!",
                  },
                ]}
                style={{ marginBottom: "8px" }}
              >
                <Input type="number" step="0.001" />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="typeFrequenceFacturation"
            label="Fréquence de facturation"
            rules={[{ required: true, message: "Veuillez sélectionner la fréquence de facturation!" }]}
            style={{ marginBottom: "8px" }}
          >
            <Select onChange={handleFrequenceChange}>
              <Option value="Mensuelle">Mensuelle</Option>
              <Option value="Spécifique">Spécifique</Option>
            </Select>
          </Form.Item>
          {typeFrequenceFacturation === 'Spécifique' && (
            <Form.Item
              name="detailsFrequence"
              label="Détails spécifiques"
              style={{ marginBottom: "8px" }}
            >
              <Input />
            </Form.Item>
          )}
         <Form.Item
  name="devise"
  label="Devise"
  rules={[
    {
      required: true,
      message: "Veuillez sélectionner la devise du contrat!",
    },
  ]}
  style={{ marginBottom: '8px' }}
>
  <Select placeholder="Sélectionnez une devise">
    <Option value="USD">USD</Option>
    <Option value="EUR">EUR</Option>
    <Option value="JPY">JPY</Option>
    <Option value="TND">TND</Option>
    <Option value="CAD">CAD</Option>
    <Option value="DZD">DZD</Option>

  </Select>
</Form.Item>

          <Form.Item
            name="contratFile"
            label="Ajouter le contrat PDF"
            style={{ marginBottom: "8px" }}
          >
            <Upload beforeUpload={() => false} onChange={handleFileChange}>
              <Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleAddContrat}>
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
