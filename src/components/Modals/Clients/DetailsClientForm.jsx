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
    setSelectedContract(null); 
  };

  const handleContractClick = (contract) => {
    const contractWithKey = { ...contract, key: contract.id };
    setSelectedContract(contractWithKey);
    console.log(selectedContract)
    setIsContractModalVisible(true);
  };

  const formatDate = (date) => {
    console.log(date)
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
        handleContractClick(defaultContract); 
      }
    }
  }, [isDetailsModalVisible]);

  const displayDelaiRelance = (delaiRelance) => {
    if (delaiRelance % 7 === 0) {
      return `${delaiRelance / 7} semaines`;
    }
    return `${delaiRelance} jours`;
  };
  const isRelanceDisabled = record.delaiRelance === 0 && record.maxRelance === 0;
 
  return (
    <>
      <Tooltip title="Details">
        <Button 
          icon={<InfoCircleOutlined />} 
          size="small" 
          onClick={handleDetails} 
         // style={{ margin: '8px' }}
        />
      </Tooltip>
      <Modal
        title={`Informations du client `}
        visible={isDetailsModalVisible}
        onCancel={handleClose}
        width={900}

        footer={[
          <Button key="close" onClick={handleClose}>
            Fermer
          </Button>,
        ]}
        style={{ top: 20 }}
      >

<hr style={{ backgroundColor: '#CCCCCC', height: '1px', border: 'none' }}/>    
<div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
           <span >
              <div style={{ position: 'relative', display: 'inline-block', marginRight: 10 , marginTop:5 }}>
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
            
          {`Nom d'utilisateur : ${record?.username}`}
            </span> </div>
          <Descriptions bordered style={{ marginTop: '16px' }} column={2}>
            <Descriptions.Item label="Email de contact">{record.email}</Descriptions.Item>
            <Descriptions.Item label="Email à copier en cc">{record.emailcc}</Descriptions.Item>
            <Descriptions.Item label="Téléphone">{record.phone}</Descriptions.Item>
            <Descriptions.Item label="ID Fiscal">{record.identifiantFiscal}</Descriptions.Item>
            <Descriptions.Item label="Adresse">{record.adresse}</Descriptions.Item>
            <Descriptions.Item label="Date de création">{formatDate(record.dateCreation)}</Descriptions.Item>

            <Descriptions.Item label="Délai de relance"> 

            {isRelanceDisabled ? "Relance désactivée" : displayDelaiRelance(record.delaiRelance)}
            </Descriptions.Item>
            <Descriptions.Item label="Maximum de relance">
            {isRelanceDisabled ? "Relance désactivée" : record.maxRelance+' fois'} </Descriptions.Item>

            <Descriptions.Item label="Contrats en cours">
              {ongoingContracts?.length > 0 ? (
                <List
                  size="small"
                  dataSource={ongoingContracts}
                  renderItem={(contrat) => (
                    <List.Item
                      key={contrat.id}
                      onClick={() => handleContractClick(contrat)}
                      style={{ color: '#6666FF',           
                      }}
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
                      style={{color: '#6666FF' }}
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
   
      </Modal>

    
    </>
  );
};

export default DetailsClientForm;
