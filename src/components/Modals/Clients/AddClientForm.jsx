import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Space,
  Switch,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import api from "../../../utils/axios";
import moment from "moment";

export const AddClientForm = ({ handleState }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [formValues, setFormValues] = useState(null);
  const [unit, setUnit] = useState("days");
  const [relanceDisabled, setRelanceDisabled] = useState(false);

  const handleDisableChange = (checked) => {
    setRelanceDisabled(checked);
    if (checked) {
      addForm.setFieldsValue({ delaiRelance: 0, maxRelance: 0 });
    }else {
      addForm.setFieldsValue({
        delaiRelance: '',
        maxRelance: '',
      });
    }
  };

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
        const delaiRelanceInDays = unit === "weeks" && !relanceDisabled ? values.delaiRelance * 7 : values.delaiRelance;
        const dataToSend = {
          ...values,
          dateCreation: values.dateCreation.format("YYYY-MM-DD"),
          delaiRelance: delaiRelanceInDays,
        };

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
              <strong>Délai de relance:</strong> {unit === "weeks" ? values.delaiRelance + " semaines" : values.delaiRelance + " jours"}              </p>
              <p>
                <strong>Max de relance:</strong> {values.maxRelance} fois
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
            console.log("Submitted values:", dataToSend); // Utiliser dataToSend pour envoyer au backend
            setFormValues(values);
    
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

  const validateDelai = () => {
    if (addForm.getFieldValue("delaiRelance") < 1 ||isNaN(addForm.getFieldValue("delaiRelance"))) {
      return Promise.reject(
        new Error(
          "Le délai de relance doit etre supérieur à 1!"
        )
      );
    }
    return Promise.resolve();
  };

  const validateMaxRelance = () => {
    if (addForm.getFieldValue("maxRelance") < 1 ||isNaN(addForm.getFieldValue("maxRelance"))) {
      return Promise.reject(
        new Error(
          "Le max de relance doit etre supérieur à 1!"
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
          onFinish={handleAddClient} 
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
              {
                pattern: /^[a-zA-Z0-9 ]+$/,
                message: "Le nom doit être alphanumérique!",
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
              {
                pattern: /^[a-zA-Z0-9 ]+$/,
                message: "L'adresse doit être alphanumérique!",
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

          <div style={{ 
             marginTop: "10px",
             display: "flex",
             alignItems: "center",
             justifyContent: "center", 
           }}>
          <Switch size="small"  onChange={handleDisableChange} />

      <span style={{ margin: "8px" }}>Désactiver les relances</span>
    </div>

    <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
          gap: "10px" 
        }}
      >
        <Form.Item
          name="delaiRelance"
          label="Délai de relance"
          style={{ margin: 0, flex: 1 }}
          rules={[
            {
              required: true,
              message: "Veuillez saisir le délai de relance!",
            },
            {
              validator: validateDelai,
            },
          ]}
        >
          <Input
            type="number"
            placeholder="Délai de relance"
            min={1}
            disabled={relanceDisabled}
            style={{ width: "170px" }}
            onKeyPress={(e) => {
              if (e.key === "," || e.key ===".") {
                e.preventDefault();
              }
            }}
          />
        </Form.Item> 
        <Form.Item
          label=" "
          name="delaiUnit"
          style={{ margin: 0 }}
        >
          <Select
            value={unit}
            placeholder="Jours"
            disabled={relanceDisabled}
            onChange={(value) => setUnit(value)} 
            style={{ width: "110px" }}
          >
            <Select.Option selected value="days">Jours</Select.Option>
            <Select.Option value="weeks">Semaines</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="maxRelance"
          label="Maximum de relance"
          style={{ margin: 0, flex: 1 }}
          rules={[
            {
              required: true,
              message: "Veuillez saisir le nombre maximum de relance!",
            },
            {
              validator: validateMaxRelance,
            },
          ]}
        >
          <Input
            type="number"
            placeholder="Max de relance"
            min={1}
            disabled={relanceDisabled}
            style={{ width: "170px" }}
            onKeyPress={(e) => {
              if (e.key === "," || e.key ===".") {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
      </div>

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
