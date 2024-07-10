import { Button, Form, Input, Modal, notification,Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState,useEffect } from "react";


export const AddFactureForm= ({ handleState }) => {

  const { Option } = Select;
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [clients, setClients] = useState([]);


  const fetchClients = () => {
    axios
      .get("http://localhost:5551/user/getAllActif")
      .then((response) => {
        console.log(response)
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

  const handleAddFacture = (values) => {
    console.log(values);
 
    const clientId = values.client;

    const dataToSend = {
      ...values,
      client_id: clientId,
    };

    axios
      .post("http://localhost:5551/facture/create", dataToSend)
      .then((response) => {
        console.log("Facture added successfully:", response.data);
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
        Ajouter Facture
      </Button>
      <Modal
        title="Ajouter une nouvelle facture"
        visible={showAddForm}
        onCancel={() => setShowAddForm(false)}
        footer={null}
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
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[
              { required: true, message: "Veuillez saisir la date de la facture!" },
            ]}
          >
            <Input type="Date" />
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
>
 
    <Select
      placeholder="Sélectionner un client"
      allowClear
    >
      {clients.map((client) => (
                <Option key={client.id} value={client.id}>
                  {client.username}
                </Option>
              ))}
    </Select>
 
</Form.Item>

          <Form.Item
            name="montant"
            label="Montant"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant de la facture!",
              },
            ]}
          >
            <Input type="number"step="0.001" />
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