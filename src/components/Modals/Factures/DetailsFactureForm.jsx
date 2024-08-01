import React, { useState } from 'react';
import { Modal, Button, Descriptions, Card, Avatar, Tooltip } from 'antd';
import { InfoCircleOutlined, FileDoneOutlined } from '@ant-design/icons';
import moment from 'moment';

const DetailsFactureForm = ({ record }) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const handleDetails = () => {
    setIsDetailsModalVisible(true);
  };

  const handleClose = () => {
    setIsDetailsModalVisible(false);
  };

  const getColor = (statut) => {
    switch (statut) {
        case 'Échue':
            return 'red';
        case 'Non échue':
            return 'gray';
        case 'Payée':
            return 'green';

    }
};

  const renderStatut= (statut) => {

    const color = getColor(statut);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
                style={{
                    padding: '0px 2px',
                    borderRadius: '4px',
                    backgroundColor: color,
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}
            >
                {statut}
            </div>
        </div>
    );
};

  const formatDate = (date) => {
    
    if (date == null) {
      return ('-')
    }
    else
    return moment(date).format('DD/MM/YYYY');
  };

  return (
    <> <Tooltip title="Détails">
      <Button icon={<InfoCircleOutlined />} size="small" onClick={handleDetails}>
      </Button></Tooltip>
      <Modal
        title={`Informations de la facture : ${record?.numero}`}
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
                <Avatar icon={<FileDoneOutlined />} />
              </div>
            }
            description={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{`Numéro : ${record?.numero}`}</span>
                {renderStatut(record?.statut)}
              </div>
            }
          />
          <Descriptions bordered style={{ marginTop: '16px' }} column={1}>
            <Descriptions.Item label="Client">{record?.client}</Descriptions.Item>
            <Descriptions.Item label="Contrat">{record?.contrat}</Descriptions.Item>
            <Descriptions.Item label="Date d'émission">{formatDate(record?.date)}</Descriptions.Item>
            <Descriptions.Item label="Délai de paiement (en jours)">{record?.delai}</Descriptions.Item>
            <Descriptions.Item label="Date d'échéance">{formatDate(record?.echeance)}</Descriptions.Item>
            <Descriptions.Item label="Retard">{record?.retard}</Descriptions.Item>
            <Descriptions.Item label="Montant de la facture">{record?.montant} {record?.devise}</Descriptions.Item>
            <Descriptions.Item label="Montant encaissé">{record?.montantEncaisse} {record?.devise}</Descriptions.Item>
            <Descriptions.Item label="Solde restant">{record?.solde} {record?.devise}</Descriptions.Item>
            <Descriptions.Item label="Action de recouvrement">{record?.actionRecouvrement}</Descriptions.Item>
            <Descriptions.Item label="Date de finalisation">{formatDate(record?.dateFinalisation)}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    </>
  );
};

export default DetailsFactureForm;
