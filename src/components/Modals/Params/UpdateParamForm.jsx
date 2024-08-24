import { Button, Form, Input, Modal, notification, Space, Tooltip } from "antd";
import { useState } from "react";
import {  EditTwoTone } from '@ant-design/icons';
import api from "../../../utils/axios";
import ExchangeRateHistoryModal from "./ExchangeRateHistoryModal";

function UpdateParamForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingParam, setEditingParam] = useState(null);
  const [editForm] = Form.useForm();
  const [isTndHistoryVisible, setIsTndHistoryVisible] = useState(false);
  const [isUsdHistoryVisible, setIsUsdHistoryVisible] = useState(false);


  const handleUpdate = () => {
    editForm.setFieldsValue({ ...record });
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue({ ...record });
  };

  const handleEditParam = (values) => {
    
    api
      .put(`/paramentreprise/updateparamentrep/${record.key}`, values)
      .then((response) => {
        
        handleState({
            ...values,
            key: record.key
        });
        setIsEditModalVisible(false);
      })
      .catch((error) => {
        notification.error({
          description:
            error?.response?.data?.error ||
            `Une erreur lors de la modification des paramètres d'ID "${record?.key}"`,
        });
      });
  };

  return (
    <>  <Tooltip title="Modifier">
      <Button icon={<EditTwoTone />}  size="small" onClick={handleUpdate}>Modifier les paramètres</Button>
</Tooltip>
      <Modal
        title={"Modifier les paramètres d'ID : "+ record?.key}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingParam(null);
        }}
        footer={null}
        style={{ top: 10 }} 

      >
        <Form
          form={editForm}
          name="editParamForm"
          initialValues={editingParam}
          layout="vertical"
          onFinish={handleEditParam}
        >
          
          <Form.Item
            name="raisonSociale"
            label="Raison sociale"
            rules={[
              { required: true, message: "Veuillez saisir la raison sociale de l'entreprise!" },
              {
                pattern: /^[a-zA-Z0-9 ]+$/,
                message: "La raison sociale doit être alphanumérique!",
              },
            ]}            style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Veuillez saisir l'email de l'entreprise!" },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Téléphone"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le numéro de téléphone de l'entreprise!",
              },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="identifiantFiscal"
            label="ID Fiscal"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'identifiant fiscal de l'entreprise!",
              },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="adresse"
            label="Adresse complète"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'adresse complète de l'entreprise!",
              },
              {
                pattern: /^[a-zA-Z0-9 ]+$/,
                message: "L'adresse doit être alphanumérique!",
              },
            ]}style={{ marginBottom: '8px' }} 
          >
            <Input />
          </Form.Item>
          <Form.Item label="Taux de change | EUR">
            <Input.Group compact>
              <Form.Item
                name="tauxTndEur"
                rules={[
                  { required: true, message: "Veuillez saisir le taux de change TND!" },
                ]}
                style={{ width: '48%', marginRight: '4px',border: 'none' }}
              >
                <Input type="number" min={0} step={0.01} addonBefore={
                    <Button size="small"
                      type="link"
                      onClick={() => setIsTndHistoryVisible(true)}
                      style={{ padding: 0 }} 
                    >TND</Button>} />
              </Form.Item>
              <Form.Item
                name="tauxUsdEur"
                rules={[
                  { required: true, message: "Veuillez saisir le taux de change USD!" },
                ]}
                style={{ width: '48%',border: 'none' }}
              >
                <Input type="number" step={0.01} min={0} addonBefore={
                    <Button size="small"
                      type="link"
                      onClick={() => setIsUsdHistoryVisible(true)}
                      style={{ padding: 0 }} 
                    >USD</Button>
                  }
                  />
              </Form.Item>
            </Input.Group>
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
      <ExchangeRateHistoryModal
        currency="TND"
        visible={isTndHistoryVisible}
        onClose={() => setIsTndHistoryVisible(false)}
      />

      <ExchangeRateHistoryModal
        currency="USD"
        visible={isUsdHistoryVisible}
        onClose={() => setIsUsdHistoryVisible(false)}
      />
    </>
  );
}

export default UpdateParamForm;
