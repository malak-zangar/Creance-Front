import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Space,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import api from "../../../utils/axios";
import moment from "moment";

export const AddClientForm = ({ handleState }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [formValues, setFormValues] = useState(null);

  const handleCancel = () => {
    setShowAddForm(false);
    addForm.resetFields();
  };

  const handleDateCreationDisabledDate = (current) => {
    const currentDate = moment();
    return currentDate ? current > currentDate.startOf("day") : false;
  };

  const handleAddClient = () => {
    addForm
      .validateFields()
      .then((values) => {
        const dataToSend = {
          ...values,
          dateCreation: values.dateCreation.format("YYYY-MM-DD"),
        };
        setFormValues(values);
        Modal.confirm({
          title: "Confirmer l'ajout du client",
          content: (
            <div>
              <p>Êtes-vous sûr de vouloir ajouter ce client ?</p>
              <p>
                <strong>Nom:</strong> {values.username}
              </p>
              <p>
                <strong>Email:</strong> {values.email}
              </p>
              <p>
                <strong>Email à copier en cc:</strong> {values.emailcc}
              </p>
              <p>
                <strong>Téléphone:</strong> {values.phone}
              </p>
              <p>
                <strong>ID Fiscal:</strong> {values.identifiantFiscal}
              </p>
              <p>
                <strong>Adresse:</strong> {values.adresse}
              </p>
              <p>
                <strong>Date de création:</strong>
                {values.dateCreation.format("DD/MM/YYYY")}
              </p>
            </div>
          ),
          okText: "Confirmer",
          cancelText: "Annuler",
          onOk: () => {
            api
              .post("/user/create", dataToSend)
              .then((response) => {
                console.log("Client ajouté avec succès:", response.data);
                notification.success({ message: "Client ajouté avec succès" });

                setShowAddForm(false);
                handleState({
                  ...response.data.client,
                  key: response.data.client.id,
                });
                addForm.resetFields();
              })
              .catch((error) => {
                notification.error({
                  description:
                    error?.response?.data?.erreur ||
                    `Une erreur lors de la création du client "${formValues?.username}"`,
                });
              });
          },
          onCancel() {
            console.log("Ajout du client annulé");
          },
        });
      })
      .catch((error) => {
        console.error("Validation échouée:", error);
      });
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setShowAddForm(true)}
        icon={<PlusCircleOutlined />}
      >
        Ajouter un Client
      </Button>
      <Modal
        title="Ajouter un nouveau client"
        visible={showAddForm}
        onCancel={() => setShowAddForm(false)}
        footer={null}
        style={{ top: 15 }}
      >
        <Form
          layout="vertical"
          name="addClientForm"
          onFinish={handleAddClient} // Le traitement de la confirmation se fait via handleAddClient
          form={addForm}
        >
          <Form.Item
            name="username"
            label="Nom du client"
            rules={[
              { required: true, message: "Veuillez saisir le nom du client!" },
              { min: 3, message: "Le nom doit comporter au moins 3 lettres!" },
              { max: 25, message: "Le nom doit comporter au plus 25 lettres!" },
              {
                pattern: /^\S.*\S$|^\S{1,2}$/,
                message: "Le nom ne doit pas commencer ou finir par un espace!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email de contact "
            rules={[
              { required: true, message: "Veuillez saisir l'email du client!" },
              { type: "email", message: "Veuillez saisir un email valide!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="emailcc"
            label="Email à copier en cc"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'email à copier en cc du client!",
              },
              { type: "email", message: "Veuillez saisir un email valide!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Téléphone"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le numéro de téléphone du client!",
              },

              {
                pattern: /^\d{7,15}$/,
                message:
                  "Le numéro de téléphone doit comporter entre 7 et 15 chiffres!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="identifiantFiscal"
            label="ID Fiscal"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'identifiant fiscal' du client!",
              },
              {
                pattern: /^[a-zA-Z0-9]{6,20}$/,
                message:
                  "L'identifiant fiscal doit comporter entre 6 et 20 caractères alphanumériques!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="adresse"
            label="Adresse"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'adresse du client!",
              },
              {
                min: 6,
                message: "L'adresse doit comporter au moins 6 lettres!",
              },
              {
                pattern: /^\S.*\S$|^\S{1,2}$/,
                message:
                  "L'adresse ne doit pas commencer ou finir par un espace!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dateCreation"
            label="Date de création"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date de création du client!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker
              disabledDate={handleDateCreationDisabledDate}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleAddClient}>
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
