import React, { useState, useEffect } from 'react';
import { Modal, Button, Descriptions, Card, Avatar, List, Tooltip } from 'antd';
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
    setSelectedContract(null); // Clear the selected contract when closing the modal
  };

  const handleContractClick = (contract) => {
    const contractWithKey = { ...contract, key: contract.id };
    setSelectedContract(contractWithKey);
    console.log(selectedContract)
    setIsContractModalVisible(true);
  };

  const formatDate = (date) => {
    return date ? moment(date).format('DD/MM/YYYY') : '-';
  };

  const currentDate = moment();

  const ongoingContracts = record.contrats?.filter((contrat) =>
    moment(contrat.dateDebut).isBefore(currentDate) &&
    moment(contrat.dateFin).isAfter(currentDate)
  )|| [];

  const notOngoingContracts = record.contrats?.filter((contrat) =>
    !(moment(contrat.dateDebut).isBefore(currentDate) && moment(contrat.dateFin).isAfter(currentDate))
  )|| [];

  useEffect(() => {
    if (isDetailsModalVisible) {
      const defaultContract = ongoingContracts[0] || notOngoingContracts[0] || null;
      if (defaultContract) {
        handleContractClick(defaultContract); // Show the details of the first contract
      }
    }
  }, [isDetailsModalVisible]);

  return (
    <>
      <Tooltip title="Details">
        <Button 
          icon={<InfoCircleOutlined />} 
          size="small" 
          onClick={handleDetails} 
          style={{ margin: '8px' }}
        />
      </Tooltip>
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
            <Descriptions.Item label="Contrats en cours">
              {ongoingContracts?.length > 0 ? (
                <List
                  size="small"
                  dataSource={ongoingContracts}
                  renderItem={(contrat) => (
                    <List.Item
                      key={contrat.id}
                      onClick={() => handleContractClick(contrat)}
                      style={{ color: '#0e063b' }}
                    >
                      <span > {contrat?.reference}</span>
                      {isContractModalVisible && selectedContract && (
        <DetailsContratForm record={selectedContract} />
      )}
                    </List.Item>
                  )}
                />
              ) : (
                'Aucun contrat'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Contrats non en cours">
              {notOngoingContracts?.length > 0 ? (
                <List
                  size="small"
                  dataSource={notOngoingContracts}
                  renderItem={(contrat) => (
                    <List.Item
                      key={contrat.id}
                      onClick={() => handleContractClick(contrat)}
                      style={{color: '#0e063b' }}
                    >
                      <span>{contrat?.reference}</span>
                      {isContractModalVisible && selectedContract && (
        <DetailsContratForm record={selectedContract} />
      )}
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
