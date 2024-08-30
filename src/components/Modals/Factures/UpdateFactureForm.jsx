import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Space,
  Switch,
  Tooltip,
} from "antd";
import { useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import api from "../../../utils/axios";

function UpdateFactureForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingFacture, setEditingFacture] = useState(null);
  const [editForm] = Form.useForm();
  const [contratDevise, setContratDevise] = useState("");
  const [contratDateDebut, setContratDateDebut] = useState(moment());
  const [contratDateFin, setContratDateFin] = useState(moment());
  const [isRelanceActive, setIsRelanceActive] = useState(record?.actifRelance);

  const handleUpdate = () => {
    setContratDevise(record.devise);

    const formattedMontant = formatMontant(record.montant, record.devise);
    const formattedMontantEncaisse = formatMontant(
      record.montantEncaisse,
      record.devise
    );

    editForm.setFieldsValue({
      ...record,
      date: moment(record.date),
      montant: formattedMontant,
      montantEncaisse: formattedMontantEncaisse,
    });

    setIsEditModalVisible(true);
  };

  useEffect(() => {
    if (isEditModalVisible) {
      editForm.setFieldsValue({
        ...record,
        date: moment(record.date),
        montant: formatMontant(record.montant, contratDevise),
        montantEncaisse: formatMontant(record.montantEncaisse, contratDevise),
        actifRelance: record.actifRelance,
      });
      editForm.validateFields(["montant", "montantEncaisse"]);
    }
  }, [isEditModalVisible, record, editForm, contratDevise]);

  const handleDateCreationDisabledDate = (current) => {
    const contrat = editForm.getFieldValue("contrat");
    const delai = editForm.getFieldValue("delai");
    if (!contratDateDebut || !contratDateFin) {
      return false;
    }
    const currentDateWithDelai = current.clone().add(delai, "days");
    return (
      current < contratDateDebut.startOf("day") ||
      currentDateWithDelai > contratDateFin.endOf("day")
    );
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue({ ...record, date: moment(record.date) });
  };

  const handleConfirmEdit = (values) => {
    Modal.confirm({
      title: "Confirmer la modification",
      content: "Êtes-vous sûr de vouloir modifier cette facture?",
      okText: "Oui",
      cancelText: "Non",
      onOk: () => handleEditFacture(values),
    });
  };

  const handleEditFacture = (values) => {
    const formattedValues = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
      actifRelance: isRelanceActive,
    };

    api
      .put(`/facture/updateFacture/${record.key}`, formattedValues)
      .then((response) => {
        handleState({
          ...values,
          key: record.key,
          actifRelance: isRelanceActive,
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

  const validateMontant = (rule, value) => {
    const montantEncaisse = editForm.getFieldValue("montantEncaisse");
    const valueStr = value ? value.toString() : "";
    if (valueStr === "" || montantEncaisse === "") {
      return Promise.reject("Les montants doivent être des nombres valides!");
    }
    if (parseFloat(valueStr) < parseFloat(montantEncaisse)) {
      return Promise.reject(
        "Le montant ne peut pas être inférieur au montant encaissé!"
      );
    }
    const validPattern =
      contratDevise === "TND" ? /^\d+\.\d{3}$/ : /^\d+\.\d{2}$/;
    const message =
      contratDevise === "TND"
        ? "Le montant doit comporter exactement 3 décimales pour TND!"
        : "Le montant doit comporter exactement 2 décimales pour EUR ou USD!";
    if (!validPattern.test(valueStr)) {
      return Promise.reject(message);
    }
    return Promise.resolve();
  };

  const formatMontant = (value, devise) => {
    if (!value) return "";
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) return value;
    return devise === "TND"
      ? numberValue.toFixed(3) // Format TND (3 decimals)
      : numberValue.toFixed(2); // Format other currencies (2 decimals)
  };

  const validateMontantEncaisse = () => {
    const montant = editForm.getFieldValue("montant");
    const montantEncaisse = editForm.getFieldValue("montantEncaisse");
    if (montantEncaisse > montant) {
      return Promise.reject(
        new Error("Le montant encaissé ne doit pas dépasser le montant total!")
      );
    }
    const validPattern =
      contratDevise === "TND" ? /^\d+\.\d{3}$/ : /^\d+\.\d{2}$/;
    const message =
      contratDevise === "TND"
        ? "Le montant encaissé doit comporter exactement 3 décimales pour TND!"
        : "Le montant encaissé doit comporter exactement 2 décimales pour EUR ou USD!";
    if (!validPattern.test(montantEncaisse)) {
      return Promise.reject(message);
    }
    return Promise.resolve();
  };

  const handleSwitchChange = (checked) => {
    setIsRelanceActive(checked);
  };

  const handleBlurMontant = (e) => {
    const formattedValue = formatMontant(e.target.value, contratDevise);
    editForm.setFieldsValue({ montant: formattedValue });
  };

  const handleBlurMontantEncaisse = (e) => {
    const formattedValue = formatMontant(e.target.value, contratDevise);
    editForm.setFieldsValue({ montantEncaisse: formattedValue });
  };

  return (
    <>
      <Tooltip title="Modifier">
        <Button
          icon={<EditOutlined />}
          size="small"
          onClick={handleUpdate}
        ></Button>
      </Tooltip>
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
            label="Référence de facture"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la référence de la facture!",
              },
              {
                pattern: /^[a-zA-Z0-9 ]+$/,
                message: "La référence doit être alphanumérique!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input disabled />
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
            label={`Montant TTC de la facture en : ${contratDevise}`}
            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant de la facture!",
              },
              { validator: validateMontant },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input
              onBlur={handleBlurMontant}
              min={1}
              step={contratDevise === "TND" ? "0.001" : "0.01"}
              placeholder={contratDevise === "TND" ? "1.000" : "1.00"}
            />
          </Form.Item>

          <Form.Item
            name="montantEncaisse"
            label={`Montant encaisse de la facture en : ${contratDevise}`}
            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant encaisse de la facture!",
              },
              {
                validator: validateMontantEncaisse,
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input
              onBlur={handleBlurMontantEncaisse}
              min={1}
              step={contratDevise === "TND" ? "0.001" : "0.01"}
              placeholder={contratDevise === "TND" ? "1.000" : "1.00"}
            />
          </Form.Item>

          <Form.Item
            name="date"
            label="Date de création"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date de création!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker
              disabledDate={handleDateCreationDisabledDate}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="delai"
            label="Délai"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le délai!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input
              type="number"
              disabled
              min={0}
              step={1}
              placeholder="Délai en jours"
            />
          </Form.Item>

          <Form.Item name="actifRelance" label="Activer relance">
            <Switch checked={isRelanceActive} onChange={handleSwitchChange} />
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
