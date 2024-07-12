import { Button, DatePicker, Form, Input, Modal, notification, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState, useEffect } from "react";

const { Option } = Select;

export const AddEncaissementForm = ({ handleState }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [factures, setFactures] = useState([]);



  const fetchFactures = () => {
    axios
      .get("http://localhost:5555/facture/getAllActif")
      .then((response) => {
        setFactures(
          response.data.map((facture) => ({
            id: facture.id,
            numero: facture.numero,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching factures:", error);
      });
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  const handleAddEncaissement = (values) => {
    console.log(values);
   
    const factureId = values.facture;

    const dataToSend = {
      ...values,
      facture_numero: factureId,
    };
    axios
      .post("http://localhost:5555/encaissement/create", dataToSend)
      .then((response) => {
        console.log("Encaissement added successfully:", response.data);
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
            `Un erreur lors de la creation de l'encaissement "${values?.reference}"`,
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
        Ajouter un Encaissement
      </Button>
      <Modal
        title="Ajouter un nouveau encaissement"
        visible={showAddForm}
        onCancel={() => setShowAddForm(false)}
        footer={null}   style={{ top: 15 }} 
      >
        <Form
          layout="vertical"
          name="addEncaissementForm"
          onFinish={handleAddEncaissement}
          form={addForm}
        >
          <Form.Item
            name="reference"
            label="Référence de l'encaissement"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la référence de l'encaissement!",
              },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="facture"
            label="Facture"
            rules={[
              {
                required: true,
                message:
                  "Veuillez choisir la facture correspondante à cet encaissement!",
              },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Select>
              {factures.map((facture) => (
                <Option key={facture.id} value={facture.id}>
                  {facture.numero}
                </Option>
              ))}
            </Select>
          </Form.Item>
       
          <Form.Item
            name="date"
            label="Date de l'encaissement"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date de l'encaissement!",
              },
            ]}style={{ marginBottom: '8px' }} 
          >
            <DatePicker style={{ width: "100%" }} />
            </Form.Item>

          <Form.Item
            name="modeReglement"
            label="mode Reglement"
            rules={[
              {
                required: true,
                message:
                  "Veuillez saisir le mode de reglement de l'encaissement!",
              },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="montantEncaisse"
            label="Montant encaisse"
            rules={[
              {
                required: true,
                message:
                  "Veuillez saisir le montant encaisse de l'encaissement!",
              },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input type="number" step="0.001" />
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
