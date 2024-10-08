import { Button, Form, Input, Modal, notification, Select, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { EditOutlined } from '@ant-design/icons';
import api from "../../../utils/axios";

function UpdateEncaissementForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm] = Form.useForm();
  const { Option } = Select;
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [modeReglement, setModeReglement] = useState(""); // New state for payment mode
  const [factureMontantTotal, setFactureMontantTotal] = useState(null);
  const [factureSolde, setFactureSolde] = useState(null);

  const [facture, setFacture] = useState(null); // État pour stocker la facture associée
 
  const fetchClients = async () => {
    try {
      const response = await api.get("/facture/getClientsWithUnpaidInvoices");
      setClients(
        response.data.map((client) => ({
          id: client.id,
          username: client.username,
        }))
      );
    } catch (error) {
      notification.error({ message: "Failed to fetch clients" });
    }
  };

  const fetchFactures = (clientId) => {
    api
      .get(`/facture/getByClient/actif/${clientId}`)
      .then((response) => {
        if (response.data) {
          setFactures(response.data);
        } else {
          setFactures([]);
        }
      })
      .catch((error) => {
        notification.error("Error fetching factures:", error);
      });
  };
  const handleClientChange = (value) => {
    if (value) {
      fetchFactures(value);
    } else {
      setFactures([]);
    }
  };

  const handleFactureChange = (value) => {
    const facture = factures.find((facture) => facture.id === value);
    setSelectedFacture(facture);
    setFactureMontantTotal(facture.montant); // Assurez-vous que 'montantTotal' est un champ de votre facture
    setFactureSolde(facture.solde);
  };

  const handleModeReglementChange = (value) => {
    setModeReglement(value);
    editForm.setFieldsValue({ reference: "" });
  };


  useEffect(() => {
    if (record?.facture) {
      api
        .get(`/facture/getByID/${record.facture_id}`)
        .then((response) => {
          setFacture(response.data.facture); 
        })
    }

    editForm.validateFields(["montantEncaisse"]);
fetchClients();
  }, [record,editForm]);

  const formatMontant = (value, devise) => {
    if (!value) return "";
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) return value;
    return devise === "TND"
      ? numberValue.toFixed(3) // Format TND (3 decimals)
      : numberValue.toFixed(2); // Format other currencies (2 decimals)
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue({ ...record });
  };

  const handleUpdate = () => {
    const formattedMontantEncaisse = formatMontant(record.montantEncaisse, record.devise);

    editForm.setFieldsValue({ ...record,  montantEncaisse: formattedMontantEncaisse, });
    setIsEditModalVisible(true);
  };

  const handleConfirmEdit = (values) => {
    Modal.confirm({
      title: 'Confirmer la modification',
      content: 'Êtes-vous sûr de vouloir modifier ce paiement?',
      okText: 'Oui',
      cancelText: 'Non',
      onOk: () => handleEditEncaissement({...values,facture_id: selectedFacture?.id} ),
    });
  };

  const handleEditEncaissement = (values) => {
    api
      .put(`/encaissement/updateEncaissement/${record.key}`, values)
      .then((response) => {
        handleState({
          ...values,
          key: record.key,

        });
        setIsEditModalVisible(false);
        notification.success({ message: "Encaissement modifié avec succès" });
      })
      .catch((error) => {
        notification.error({
          description:
            error?.response?.data?.error ||
            `Une erreur lors de la modification du paiement "${values?.reference}"`,
        });
      });
  };
  


  const validateMontantEncaisse = () => {
    const solde = record?.solde;
    const montantEncaisse = editForm.getFieldValue("montantEncaisse");

    if (montantEncaisse > solde || montantEncaisse < 1) {
      return Promise.reject(
        new Error(
          "Le montant encaissé doit etre supérieur à 1!"
        )
      );
    }
    const validPattern = record.devise === "TND" ? /^\d+\.\d{3}$/ : /^\d+\.\d{2}$/;
    const message =
      record.devise === "TND"
        ? "Le montant encaissé doit comporter exactement 3 décimales pour TND!"
        : "Le montant encaissé doit comporter exactement 2 décimales pour EUR ou USD!";
    if (!validPattern.test(montantEncaisse)) {
      return Promise.reject(message);
    }
    return Promise.resolve();
  };
  const handleBlurMontantEncaisse = (e) => {
    const formattedValue = formatMontant(e.target.value, record.devise);
    editForm.setFieldsValue({ montantEncaisse: formattedValue });
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
        title={"Modifier le paiement "}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingUser(null);
        }}
        footer={null}
        style={{ top: 15 }}
      >
        <Form
          form={editForm}
          name="editEncaissementForm"
          initialValues={editingUser}
          layout="vertical"
          onFinish={handleConfirmEdit}
        >
            <Form.Item
            name="modeReglement"
            label="Mode de règlement"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le mode de règlement du paiement!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
 <Select
              placeholder="Sélectionner un mode de règlement"
              onChange={handleModeReglementChange}
            >
              <Option value="Chèque">Chèque</Option>
              <Option value="Virement">Virement</Option>
            </Select>     
                 </Form.Item>
          <Form.Item
            name="reference"
            label={
              modeReglement === "Chèque"
                ? "Numéro de chèque"
                : modeReglement === "Virement"
                ? "Numéro de Virement"
                : "Référence"
            }       
                 rules={[
              { required: true, message: "Veuillez saisir la référence du paiement!" },
              {
                pattern: /^[^\s]{3,20}$/,
                message:
                  "La référence ne doit pas contenir d'espaces et doit avoir entre 3 et 20 caractères!",
              },
              {
                pattern: /^[a-zA-Z0-9 ]+$/,
                message: "La référence doit être alphanumérique!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="client"
            label="Client"
            rules={[
              {
                required: true,
                message: "Veuillez choisir le client correspondant à ce paiement!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
    <Select
              placeholder="Sélectionner un client"
              allowClear
              onChange={handleClientChange}
            >
              {clients.map((client) => (
                <Option key={client.id} value={client.id}>
                  {client.username}
                </Option>
              ))}
            </Select>      
                </Form.Item>
                {factures.length > 0 && (

          <Form.Item
            name="facture"
            label="Facture"
            rules={[
              { required: true, message: "Veuillez choisir la facture correspondante à ce paiement!" },
            ]}
            style={{ marginBottom: '8px' }}
          >
    <Select
                placeholder="Sélectionner une facture"
                allowClear
                onChange={handleFactureChange}
              >
                {factures.map((facture) => (
                  <Option key={facture.id} value={facture.id}>
                    {facture.numero}
                  </Option>
                ))}
              </Select>
                        </Form.Item>
                )}
                  {selectedFacture && (
            <>
              <Form.Item
                label={`Montant TTC de la Facture (${selectedFacture.devise})`}
                style={{ marginBottom: "8px" }}
              >
                <Input value={selectedFacture.montant} disabled />
              </Form.Item>
              <Form.Item
                label={`Solde de la Facture (${selectedFacture.devise})`}
                style={{ marginBottom: "8px" }}
              >
                <Input value={selectedFacture.solde} disabled />
              </Form.Item>
            
            </>
          )}
          <Form.Item
            name="montantEncaisse"
            label={`Montant encaissé en ${facture?.devise}`}
          
            rules={[
              {
                required: true,
                message: "Veuillez saisir le montant encaissé du paiement!",
              },
              {
                validator: validateMontantEncaisse,
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input
                          onBlur={handleBlurMontantEncaisse}

           // type="number" 
              min={1}
            step={record.devise === "TND" ? "0.001" : "0.01"}
            placeholder="Montant à encaisser " />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date de paiement"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la date de paiement!",
              },
            ]}
            style={{ marginBottom: '8px' }}
          > <Input type="date"/>
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

export default UpdateEncaissementForm;
