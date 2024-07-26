import React, { useState } from 'react';
import { Modal, Button, Descriptions, Card, Avatar, List } from 'antd';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import DetailsContratForm from '../Contrats/DetailsContratForm';

const DetailsClientForm = ({ record }) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isContractModalVisible, setIsContractModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const handleDetails = () => {
    setIsDetailsModalVisible(true);
  };

  const handleClose = () => {
    setIsDetailsModalVisible(false);
  };

  const handleContractClick = (contract) => {
    setSelectedContract(contract);
    setIsContractModalVisible(true);
  };

  const formatDate = (date) => {
    if (date == null) {
      return '-';
    } else {
      return moment(date).format('DD/MM/YYYY');
    }
  };

  return (
    <>
      <Button icon={<InfoCircleOutlined />} size="small" onClick={handleDetails}>
        
      </Button>
      <Modal
        title={`Informations du client : ${record.username}`}
        visible={isDetailsModalVisible}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Fermer
          </Button>,
        ]}
        style={{ top: 20 }}
      >
        <Card>
          <Card.Meta
            avatar={
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar icon={<UserOutlined />} />
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: record.actif ? 'green' : 'red',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    border: '2px solid white',
                  }}
                />
              </div>
            }
            description={`Nom d'utilisateur : ${record.username}`}
          />
          <Descriptions bordered style={{ marginTop: '16px' }} column={1}>
            <Descriptions.Item label="Email de contact">{record.email}</Descriptions.Item>
            <Descriptions.Item label="Email à copier en cc">{record.emailcc}</Descriptions.Item>
            <Descriptions.Item label="Téléphone">{record.phone}</Descriptions.Item>
            <Descriptions.Item label="ID Fiscal">{record.identifiantFiscal}</Descriptions.Item>
            <Descriptions.Item label="Adresse">{record.adresse}</Descriptions.Item>
            <Descriptions.Item label="Date de création">{formatDate(record.dateCreation)}</Descriptions.Item>
            <Descriptions.Item label="Contrats">
              {record.contrats?.length > 0 ? (
                <List
                  size="small"
                  dataSource={record.contrats}
                  renderItem={(contrat) => (
              
                  <List.Item
                  onClick={() => handleContractClick(contrat)} style={{ cursor: 'pointer', color: '#0e063b' }} >
                  <span style={{ textDecoration: 'underline' }}>{contrat?.reference}</span>
                  {selectedContract && (
                <DetailsContratForm record={selectedContract} />  )}
                  </List.Item>
                  )}
                />
              ) : (
                'Aucun contrat'
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>

     
    </>
  );
};

export default DetailsClientForm;
