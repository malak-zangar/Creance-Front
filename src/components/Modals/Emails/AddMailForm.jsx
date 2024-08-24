import {
  Button,
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
import TextArea from "antd/es/input/TextArea";

export const AddMailForm = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();
  const [formValues, setFormValues] = useState(null);

  const handleCancel = () => {
    setShowAddForm(false);
    addForm.resetFields();
  };

  const handleAddEmail = ({ handleState }) => {
    addForm
      .validateFields()
      .then((values) => {
        const dataToSend = {
          ...values,
          dateInsertion: moment().format("YYYY-MM-DD"),
        };

        Modal.confirm({
          title: "Confirmer l'ajout de l'email",
          content: (
            <div>
              <p>Êtes-vous sûr de vouloir ajouter cet email ?</p>
              <p>
                <strong>Type d'email:</strong> {values.type}
              </p>
              <p>
                <strong>Objet d'email:</strong> {values.objet}
              </p>
              <p>
                <strong>Corps d'email:</strong> {values.corps}
              </p>
            </div>
          ),
          okText: "Confirmer",
          cancelText: "Annuler",
          onOk: () => {
            console.log("Submitted values:", dataToSend); // Utiliser dataToSend pour envoyer au backend
            setFormValues(values);

            api
              .post("/emailcascade/create", dataToSend)
              .then((response) => {
                console.log("Email ajouté avec succès:", response.data.emailcascade);

                setShowAddForm(false);
                notification.success({ message: "Email ajouté avec succès" });
                addForm.resetFields();
                console.log(response.data.emailcascade.id);

                handleState({
                  ...response.data.emailcascade,
                  key: response.data.emailcascade.id,
                });

              })
              .catch((error) => {
                notification.error({
                  description:
                    error?.response?.data?.erreur ||
                    `Une erreur lors de la création de l'email "${formValues?.type}"`,
                });
              });
          },
          onCancel() {
            console.log("Ajout de l'email annulé");
          },
          style: { top: 15 }, 
        });
      })
      .catch((error) => {
        console.error("Validation échouée:", error);
      });
  };

  return (
    <>
      <Button  style={{ fontSize: '18px' }}
        onClick={() => setShowAddForm(true)}
        icon={<PlusCircleOutlined />}
      >
       
      </Button>
      <Modal
        title="Ajouter un nouveau email"
        visible={showAddForm}
        onCancel={() => setShowAddForm(false)}
        footer={null}
        style={{ top: 15 }}
      >
        <Form
          layout="vertical"
          name="addEmailForm"
          onFinish={handleAddEmail}
          form={addForm}
        >
          <Form.Item
            name="type"
            label="Type de l'email"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le type de l'email !",
              },
              { min: 3, message: "Le type doit comporter au moins 3 lettres!" },
              {
                max: 30,
                message: "Le type doit comporter au plus 30 lettres!",
              },
              {
                pattern: /^\S.*\S$|^\S{1,2}$/,
                message:
                  "Le type ne doit pas commencer ou finir par un espace!",
              },
              {
                pattern: /^[a-zA-Z0-9 ']+$/,
                message: "Le type doit être alphanumérique!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="objet"
            label="Objet de l'email "
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'objet de l'email!",
              },
              { min: 3, message: "L'objet doit comporter au moins 3 lettres!" },
              {
                max: 100,
                message: "L'objet doit comporter au plus 100 lettres!",
              },
              {
                pattern: /^\S.*\S$|^\S{1,2}$/,
                message:
                  "L'objet ne doit pas commencer ou finir par un espace!",
              },
         
            ]}

            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="corps"
            label="Corps de l'email"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le corps de l'email!",
              },
              {
                min: 30,
                message: "Le corps doit comporter au moins 30 lettres!",
              },
              {
                max: 1000,
                message: "Le corps doit comporter au plus 900 lettres!",
              },
             /* {
                pattern: /^\S.*\S$|^\S{1,2}$/,
                message:
                  "Le corps ne doit pas commencer ou finir par un espace!",
              },*/
            ]}
            normalize={(value) => value.trim()} // Supprime les espaces en début/fin
            style={{ marginBottom: "8px" }}
          >
            <TextArea rows={10} placeholder="Corps de l'email" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleAddEmail}>
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
