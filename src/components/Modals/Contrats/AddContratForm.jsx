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
  Divider,
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
  const [contratFile1, setContratFile1] = useState("");
  const [type, setType] = useState(null);
  const [typeFrequenceFacturation, setTypeFrequenceFacturation] = useState(null);


  const fetchClients = () => {
    api
      .get("/user/getAll")
      .then((response) => {
        console.log(response);
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

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddContrat = (values) => {
    console.log(values);

    const clientId = values.client;

    const dataToSend = {
      ...values,
      client_id: clientId,
      dateDebut: values.dateDebut.format("YYYY-MM-DD"),
      contratFile: contratFile1,
    };
    console.log(values.contratFile);

    api
      .post("/contrat/create", dataToSend)
      .then((response) => {
        console.log("Contract added successfully:", response.data);
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
  };

  const handleSelectClient = (client) => {
    setClients((prevClients) => [...prevClients, client]);
    addForm.setFieldsValue({ client: client.id });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    addForm.resetFields();
    setContratFile1(null);
  };

  const handleFileChange = (e) => {
    const file = e.file;
    console.log(file);
  
    if (file) {
      const reader = new FileReader();
      console.log(reader);
  
      reader.onload = (event) => {
        console.log(event);
        const base64Content = event.target.result.split(",")[1];
        console.log(base64Content);
        setContratFile1(base64Content);
        console.log(contratFile1);
      };
  
      reader.readAsDataURL(file); // This line reads the file
    }
  };
  
  const handleTypeChange = (value) => {
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
        onCancel={() => setShowAddForm(false)}
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
            rules={[
              {
                required: true,
                message: "Veuillez saisir la référence du contrat!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
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
                message: "Veuillez saisir la devise du contrat!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input />
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
            {" "}
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
