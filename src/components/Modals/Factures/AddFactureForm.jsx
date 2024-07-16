import { Button, DatePicker, Form, Input, Modal, notification, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState, useEffect } from "react";

export const AddFactureForm = ({ handleState }) => {
  const { Option } = Select;
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [contrats, setContrats] = useState([]);

  const fetchClients = () => {
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
  };

  const fetchContrats = (clientId) => {
    console.log(clientId)
    axios
      .get(`http://localhost:5555/contrat/getByClient/${clientId}`)
      .then((response) => {
        if (response.data.contracts) {
          console.log(response)
          setContrats([response.data.contracts]);
          console.log(contrats)
        } else {
          console.log(response)

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
      console.log(value)
      console.log(contrats)

      fetchContrats(value);
      console.log(contrats)

    } else {
      console.log(contrats)

      setContrats([]);
    }
  };

  const handleAddFacture = (values) => {
   // const clientId = values.client;
    const contratId = values.contrat;

    const dataToSend = {
      ...values,
      //client_id: clientId,
      contrat_id: contratId,
      date: values.date.format('YYYY-MM-DD'),
    };

    axios
      .post("http://localhost:5555/facture/create", dataToSend)
      .then((response) => {
        console.log("Facture added successfully:", response.data);
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
            `Un erreur lors de la creation de la facture "${values?.numero}"`,
        });
      });
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
        onCancel={() => setShowAddForm(false)}
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
            rules={[
              { required: true, message: "Veuillez saisir le numéro de la facture!" },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input />
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
             <Select placeholder="Sélectionner un contrat" allowClear>
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
            name="devise"
            label="Devise"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la devise de la facture!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input />
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
                message: "Veuillez saisir le montant encaisse de la facture!",
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
            <Button type="primary" htmlType="submit">
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
