import { Button, DatePicker, Form, Input, Modal, notification, Space, Tooltip } from "antd";
import { useState,useEffect } from "react";
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

  const handleUpdate = () => {
    console.log(record.delai)
    setContratDevise(record.devise);

    editForm.setFieldsValue({ ...record, date: moment(record.date) });
    setIsEditModalVisible(true);
  };

  useEffect(() => {
    if (isEditModalVisible) {
      editForm.setFieldsValue({ ...record, date: moment(record.date), delai: record.delai });
    }
  }, [isEditModalVisible, record, editForm]);

  const handleDateCreationDisabledDate = (current) => {
    const contrat = editForm.getFieldValue('contrat');
    console.log(contrat)
    
    const delai = editForm.getFieldValue('delai');
    console.log(delai) // Récupérer le délai du formulaire
    if (!contratDateDebut || !contratDateFin) {
      return false;
    }
    const currentDateWithDelai = current.clone().add(delai, 'days');
    return current < contratDateDebut.startOf("day") || currentDateWithDelai > contratDateFin.endOf("day");
  };


  const validateDelai = (e) => {
    let value = e.target.value;
    value = value.replace(/,/g, ""); 
    if (parseInt(value, 10) < 1) {
      value = 1;
    }
    editForm.setFieldsValue({ delai: value });
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    
    editForm.setFieldsValue({ ...record ,date: moment(record.date)});
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

  const validateMontantEncaisse = () => {
    const montant = editForm.getFieldValue("montant");
    const montantEncaisse = editForm.getFieldValue("montantEncaisse");

    if (montantEncaisse > montant) {
      return Promise.reject(new Error("Le montant encaissé ne doit pas dépasser le montant total!"));
    }
    return Promise.resolve();
  };

  return (
    <>  <Tooltip title="Modifier">
      <Button
        icon={<EditOutlined />}
        size="small"
        onClick={handleUpdate}
      >
      </Button>
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
            name="delai"
            label={`Délai de paiement (en jours)`}
            rules={[
              {
                required: true,
                message:
                  "Veuillez saisir le délai de paiement (en jours) de la facture!",
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
            name="date"
            label="Date d'émission"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date d'émission de la facture!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <DatePicker 
            style={{ width: "100%" }} 
            disabledDate={handleDateCreationDisabledDate}
/>
          </Form.Item>

<Form.Item
            name="montant"
            //label="Montant"
            label={`Montant total (TTC) de la facture en : ${contratDevise}`}

            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant de la facture!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input type="number" onChange={() => editForm.validateFields(['montantEncaisse'])}
             min={1} step="0.001" placeholder="Montant total (TTC)" />
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
            <Input type="number" min={1} step="0.001" />
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
