/*import { Button, DatePicker, Form, Input, Modal, notification, Space } from "antd";
import { useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import api from "../../../utils/axios";

function UpdateFactureForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingFacture, setEditingFacture] = useState(null);
  const [editForm] = Form.useForm();

  const handleUpdate = () => {
    editForm.setFieldsValue({ ...record, 
      date: moment(record.date) });

    setIsEditModalVisible(true);

    console.log(record);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue({ ...record });
  };

  const handleEditFacture = (values) => {
    const formattedValues = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
    };

    api
      .put(
        `/facture/updateFacture/${record.key}`,
        formattedValues
      )
      .then((response) => {
        handleState({
          ...values,
          key: record.key,
        });
        setIsEditModalVisible(false);
        notification.success({ message: "Facture modifiée avec succès" });
      })
      .catch((error) => {
        notification.error({
          description:
            error?.response?.data?.error ||
            `Une erreur lors de la modification de la facture "${values?.numero}"`,
        });
      });
  };

  return (
    <>
      <Button
        icon={<EditOutlined />}
        type="primary"
        size="small"
        onClick={handleUpdate}
      >
        Modifier
      </Button>

      <Modal
        title={"Modifier la facture " + record?.numero}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingFacture(null);
        }}
        footer={null}
        style={{ top: 15 }}
      >
        <Form
          form={editForm}
          name="editFactureForm"
          initialValues={editingFacture}
          layout="vertical"
          onFinish={handleEditFacture}
        >
          <Form.Item
            name="numero"
            label="Numéro de facture"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le numéro de la facture!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date de la facture!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="client"
            label="Client"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="contrat"
            label="Contrat"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input disabled />
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
            style={{ marginBottom: "8px" }}
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
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="delai"
            label="Délai de paiement (en jours)"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le délai de paiement (en jours) de la facture!",
              },
            ]}
            style={{ marginBottom: "8px" }}
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
            style={{ marginBottom: "8px" }}
          >
            <Input type="number" step="0.001" />
          </Form.Item>

          <Form.Item
            name="actionRecouvrement"
            label="Action de recouvrement"
            rules={[
              {
                required: true,
                message:
                  "Veuillez saisir l'action de recouvrement de la facture!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item>
          <Space>
              <Button type="primary" htmlType="submit">
                Modifier
              </Button>  
              <Button type="default" onClick={handleCancel}>
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateFactureForm;
*/

import { Button, DatePicker, Form, Input, Modal, notification, Space } from "antd";
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import api from "../../../utils/axios";

function UpdateFactureForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingFacture, setEditingFacture] = useState(null);
  const [editForm] = Form.useForm();

  const handleUpdate = () => {
    editForm.setFieldsValue({ ...record, date: moment(record.date) });
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue({ ...record });
  };

  const handleConfirmEdit = (values) => {
    Modal.confirm({
      title: 'Confirmer la modification',
      content: 'Êtes-vous sûr de vouloir modifier cette facture?',
      okText: 'Oui',
      cancelText: 'Non',
      onOk: () => handleEditFacture(values),
    });
  };

  const handleEditFacture = (values) => {
    const formattedValues = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
    };

    api
      .put(`/facture/updateFacture/${record.key}`, formattedValues)
      .then((response) => {
        handleState({
          ...values,
          key: record.key,
        });
        setIsEditModalVisible(false);
        notification.success({ message: "Facture modifiée avec succès" });
      })
      .catch((error) => {
        notification.error({
          description:
            error?.response?.data?.error ||
            `Une erreur lors de la modification de la facture "${values?.numero}"`,
        });
      });
  };

  return (
    <>
      <Button
        icon={<EditOutlined />}
        size="small"
        onClick={handleUpdate}
      >
      </Button>

      <Modal
        title={"Modifier la facture " + record?.numero}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingFacture(null);
        }}
        footer={null}
        style={{ top: 15 }}
      >
        <Form
          form={editForm}
          name="editFactureForm"
          initialValues={editingFacture}
          layout="vertical"
          onFinish={handleConfirmEdit}
        >
          <Form.Item
            name="numero"
            label="Numéro de facture"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le numéro de la facture!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date de la facture!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="client"
            label="Client"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="contrat"
            label="Contrat"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input disabled />
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
            style={{ marginBottom: "8px" }}
          >
            <Input type="number" step="0.001" />
          </Form.Item>

          <Form.Item
            name="delai"
            label="Délai de paiement (en jours)"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le délai de paiement (en jours) de la facture!",
              },
            ]}
            style={{ marginBottom: "8px" }}
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
            style={{ marginBottom: "8px" }}
          >
            <Input type="number" step="0.001" />
          </Form.Item>

          <Form.Item
            name="actionRecouvrement"
            label="Action de recouvrement"
            rules={[
              {
                required: true,
                message:
                  "Veuillez saisir l'action de recouvrement de la facture!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Modifier
              </Button>
              <Button type="default" onClick={handleCancel}>
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateFactureForm;
