import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  DatePicker,
  Select,
  Upload,
  Space,
  Tooltip,
} from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import api from "../../../utils/axios";

function UpdateContratForm({ record, handleState }) {
  const { Option } = Select;
  const { TextArea } = Input;
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [file, setFile] = useState(null);
  const [type, setType] = useState(record.type);
  const [typeFrequenceFacturation, setTypeFrequenceFacturation] = useState(
    record.typeFrequenceFacturation
  );
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    if (record) {
      const initialValues = {
        ...record,
        dateDebut: moment(record.dateDebut,"YYYY-MM-DD"),
        dateFin: moment(record.dateFin),

        contratFile: record.contratFile,
      };
      setInitialValues(initialValues);
      editForm.setFieldsValue(initialValues);
    }
  }, [record, editForm]);

  const handleUpdate = () => {
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue(initialValues);
  };

  const handleConfirmEdit = (values) => {
    Modal.confirm({
      title: "Confirmer la modification",
      content: "Êtes-vous sûr de vouloir modifier ce contrat?",
      okText: "Oui",
      cancelText: "Non",
      onOk: () => handleEditContrat(values),
    });
  };

  const handleEditContrat = (values) => {
    const formattedValues = {
      ...values,
      dateDebut: values.dateDebut.format("YYYY-MM-DD"),
      dateFin: values.dateFin.format("YYYY-MM-DD"),

      contratFile: file,
    };

    api
      .put(`/contrat/updateContrat/${record.key}`, formattedValues)
      .then((response) => {
        handleState({
          ...formattedValues,
          key: record.key,
        });
        setIsEditModalVisible(false);
        notification.success({ message: "Contrat modifié avec succès" });
      })
      .catch((error) => {
        notification.error({
          description:
            error?.response?.data?.error ||
            `Une erreur lors de la modification du contrat "${values?.reference}"`,
        });
      });
  };

  const handleFileChange = (e) => {
    const file = e.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Content = event.target.result.split(",")[1];
        setFile(base64Content);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTypeChange = (value) => {
    setType(value);

    const updatedValues = { ...initialValues, type: value };

    if (value === "Forfait") {
      editForm.setFieldsValue({
        ...updatedValues,
        prixJourHomme: null,
        montantParMois:
          typeFrequenceFacturation === "Mensuelle"
            ? initialValues.montantParMois
            : null,
      });
    } else if (value === "Jour Homme") {
      editForm.setFieldsValue({
        ...updatedValues,
        total: null,
        montantParMois: null,
        prixJourHomme: initialValues.prixJourHomme,
      });
    } else if (value === "Mix") {
      editForm.setFieldsValue({
        ...updatedValues,
        montantParMois: initialValues.montantParMois,
        prixJourHomme: initialValues.prixJourHomme,
      });
    }
  };

  const handleFrequenceChange = (value) => {
    setTypeFrequenceFacturation(value);
    const updatedValues = { ...initialValues, typeFrequenceFacturation: value };

    if (value === "Spécifique") {
      editForm.setFieldsValue({
        ...updatedValues,
        montantParMois: null,
      });
    } else if (value === "Mensuelle" && type === "Forfait") {
      editForm.setFieldsValue({
        ...updatedValues,
        montantParMois: initialValues.montantParMois,
      });
    }
  };
  const validateDelai = (e) => {
    let value = e.target.value;
    value = value.replace(/,/g, ""); 
    if (parseInt(value, 10) < 1) {
      value = 1;
    }
    editForm.setFieldsValue({ delai: value });
  };

    // Function to update the minDate for the end date based on the start date
    const handleDateDebutChange = (date, dateString) => {
      editForm.setFieldsValue({ dateDebut: date });
      if (date) {
        editForm.setFieldsValue({ dateFin: null });
      }
    };
  
    const handleDateFinDisabledDate = (current) => {
      const dateDebut = editForm.getFieldValue('dateDebut');
      return dateDebut ? current <= dateDebut.startOf('day') : false;
    };
  return (
    <>
      {" "}
      <Tooltip title="Modifer">
        <Button
          icon={<EditOutlined />}
          size="small"
          onClick={handleUpdate}
        ></Button>
      </Tooltip>
      <Modal
        title={`Modifier le contrat ${record?.reference}`}
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        style={{ top: 15 }}
      >
        <Form
          form={editForm}
          name="editContratForm"
          layout="vertical"
          onFinish={handleConfirmEdit}
        >
          <Form.Item
            name="reference"
            label="Référence du contrat"
            style={{ marginBottom: "8px" }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="dateDebut"
            label="Date de début"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date de début du contrat!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker format="YYYY-MM-DD" 
             style={{ width: "100%" }}
             onChange={handleDateDebutChange} />
          </Form.Item>
          <Form.Item
            name="dateFin"
            label="Date de fin"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date de fin du contrat!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker
            format="YYYY-MM-DD" 
               style={{ width: "100%" }}
               disabledDate={handleDateFinDisabledDate}
           />
          </Form.Item>
          <Form.Item
            name="client"
            label="Client"
            rules={[{ required: true, message: "Veuillez choisir le client!" }]}
            style={{ marginBottom: "8px" }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="delai"
            label="Délai de paiement (en jours)"
            rules={[
              {
                required: true,
                message:
                  "Veuillez saisir le délai de paiement (en jours) du contrat!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input
              type="number"              
               placeholder="Délai de paiement (en jours)"
              min={1}
              onChange={validateDelai}
              onKeyPress={(e) => {
                if (e.key === ",") {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner le type de contrat!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Select onChange={handleTypeChange} value={type}>
              <Option value="Forfait">Forfait</Option>
              <Option value="Jour Homme">Jour Homme</Option>
              <Option value="Mix">Mix</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="devise"
            label="Devise"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner la devise du contrat!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Select placeholder="Sélectionnez une devise">
              <Option value="USD">USD</Option>
              <Option value="EUR">EUR</Option>
              <Option value="TND">TND</Option>
            </Select>
          </Form.Item>
          {type === "Forfait" && (
            <>
              <Form.Item
                name="total"
                label="Montant total du contrat (TTC)"
                rules={[
                  {
                    required: true,
                    message:
                      "Veuillez saisir le montant total du contrat (TTC)!",
                  },
                ]}
                style={{ marginBottom: "8px" }}
              >
                <Input type="number" min={1} step="0.001" />
              </Form.Item>
              {typeFrequenceFacturation === "Mensuelle" && (
                <Form.Item
                  name="montantParMois"
                  label="Montant à facturer par Mois"
                  rules={[
                    {
                      required: true,
                      message:
                        "Veuillez saisir le montant à facturer par mois!",
                    },
                  ]}
                  style={{ marginBottom: "8px" }}
                >
                  <Input type="number" min={1} step="0.001" />
                </Form.Item>
              )}
            </>
          )}
          {type === "Jour Homme" && (
            <Form.Item
              name="prixJourHomme"
              label="Prix du jour/homme"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le prix du jour/homme!",
                },
              ]}
              style={{ marginBottom: "8px" }}
            >
              <Input type="number" min={1} step="0.001" />
            </Form.Item>
          )}
          {type === "Mix" && (
            <>
              <Form.Item
                name="total"
                label="Montant total du contrat (TTC)"
                rules={[
                  {
                    required: true,
                    message:
                      "Veuillez saisir le montant total du contrat (TTC)!",
                  },
                ]}
                style={{ marginBottom: "8px" }}
              >
                <Input type="number" min={1} step="0.001" />
              </Form.Item>
              <Form.Item
                name="prixJourHomme"
                label="Prix du jour/homme"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le prix du jour/homme!",
                  },
                ]}
                style={{ marginBottom: "8px" }}
              >
                <Input type="number" min={1} step="0.001" />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="typeFrequenceFacturation"
            label="Fréquence de facturation"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner la fréquence de facturation!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Select
              onChange={handleFrequenceChange}
              value={typeFrequenceFacturation}
            >
              <Option value="Mensuelle">Mensuelle</Option>
              <Option value="Spécifique">Spécifique</Option>
            </Select>
          </Form.Item>
          {typeFrequenceFacturation === "Spécifique" && (
            <Form.Item
              name="detailsFrequence"
              label="Détails spécifiques"
              style={{ marginBottom: "8px" }}
            >
              <TextArea rows={4} />
            </Form.Item>
          )}

          <Form.Item
            name="contratFile"
            label="Modifier le contrat PDF"
            style={{ marginBottom: "8px" }}
          >
            <Upload beforeUpload={() => false} onChange={handleFileChange}>
              <Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
            </Upload>
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

export default UpdateContratForm;
