import { Button, Form, Input, Modal, notification, Select, DatePicker } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState, useEffect } from "react";
import { AddClientForm } from "../Clients/AddClientForm";
import moment from 'moment';

export const AddContratForm = ({ handleState }) => {
  const { Option } = Select;
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [clients, setClients] = useState([]);

  const fetchClients = () => {
    axios
      .get("http://localhost:5555/user/getAll")
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
        console.error("Error fetching clients:", error);
      });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle form submission to add a new contract
  const handleAddContrat = (values) => {
    console.log(values);

    const clientId = values.client;

    const dataToSend = {
      ...values,
      client_id: clientId,
      dateDebut: values.dateDebut.format('YYYY-MM-DD'),
      dateProchaineAction: values.dateProchaineAction.format('YYYY-MM-DD'),
      dateRappel: values.dateRappel.format('YYYY-MM-DD')
    };

    axios
      .post("http://localhost:5555/contrat/create", dataToSend)
      .then((response) => {
        console.log("Contract added successfully:", response.data);
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
              { required: true, message: "Veuillez saisir la référence du contrat!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateDebut"
            label="Date Début"
            rules={[
              { required: true, message: "Veuillez saisir la date de début du contrat!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="client"
            label="Client"
            rules={[
              { required: true, message: "Veuillez choisir le client!" },
            ]}
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
            label="Délai en jours"
            rules={[
              { required: true, message: "Veuillez saisir le délai du contrat!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="conditionsFinancieres"
            label="Conditions financières"
            rules={[
              { required: true, message: "Veuillez saisir les conditions financières du contrat!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="prochaineAction"
            label="Prochaine action"
            rules={[
              { required: true, message: "Veuillez saisir la prochaine action du contrat!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="dateProchaineAction"
            label="Date de prochaine action"
            rules={[
              { required: true, message: "Veuillez saisir la date de la prochaine action du contrat!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="dateRappel"
            label="Date de rappel pour renégociation"
            rules={[
              { required: true, message: "Veuillez saisir la date de rappel du contrat!" },
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