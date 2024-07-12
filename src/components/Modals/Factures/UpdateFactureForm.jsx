import { Button, DatePicker, Form, Input, Modal, notification } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";

function UpdateFactureForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingFacture, setEditingFacture] = useState(null);
  const [editForm] = Form.useForm();

  const handleUpdate = () => {
    editForm.setFieldsValue({ ...record, date: moment(record.date) });

    setIsEditModalVisible(true);

    console.log(record);
  };

  const handleEditFacture = (values) => {
    const formattedValues = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
    };

    axios
      .put(
        `http://localhost:5555/facture/updateFacture/${record.key}`,
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
            `Un erreur lors de la modification de la facture "${values?.numero}"`,
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
            label="Délai en jours"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le délai de la facture!",
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
            <Button type="primary" htmlType="submit">
              Modifier
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateFactureForm;
