import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Space,
  Tooltip,
} from "antd";
import { useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import api from "../../../utils/axios";
import TextArea from "antd/es/input/TextArea";

function UpdateMailForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingMail, setEditingMail] = useState(null);
  const [editForm] = Form.useForm();

  useEffect(() => {
    editForm.setFieldsValue({
      ...record,
    });
  }, [record, editForm]);

  const handleUpdate = () => {
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue({ ...record });
  };

  const handleUpdateMail = () => {
    editForm
      .validateFields()
      .then((values) => {
        Modal.confirm({
          title: "Confirmer la mise à jour de l'email ",
          content: <div>Voulez vous vraiment valider les modifications? </div>,
          okText: "Confirmer",
          cancelText: "Annuler",
          onOk: () => {
            api
              .put(`/emailcascade/updateemailcascade/${record.key}`, values)
              .then((response) => {
                handleState({
                  ...values,
                  key: record.key,
                });
                setIsEditModalVisible(false);
                notification.success({
                  message: "Email mis à jour avec succès",
                });
              })
              .catch((error) => {
                notification.error({
                  description:
                    error?.response?.data?.erreur ||
                    `Une erreur est survenue lors de la mise à jour de l'email "${record.type}"`,
                });
              });
          },
        });
      })
      .catch((error) => {
        console.error("Validation échouée:", error);
      });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Modifier">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={handleUpdate}
            style={{
              minWidth: "auto",
              height: "22px",
              width: "22px",
            }}
          />
        </Tooltip>
      </div>

      <Modal
        title={"Modifier l'Email de : " + record?.type}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingMail(null);
        }}
        footer={null}
        style={{ top: 10 }}
      >
        <Form
          form={editForm}
          name="editMailForm"
          initialValues={editingMail}
          layout="vertical"
          onFinish={handleUpdateMail}
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
            ]}
            normalize={(value) => value.trim()}
            style={{ marginBottom: "8px" }}
          >
            <TextArea rows={10} placeholder="Corps de l'email" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Modifier
              </Button>
              <Button onClick={handleCancel}>Annuler</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateMailForm;
