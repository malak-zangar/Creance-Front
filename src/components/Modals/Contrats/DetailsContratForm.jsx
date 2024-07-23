import React, { useState } from 'react';
import { Modal, Button, Descriptions, Card, Avatar } from 'antd';
import { InfoCircleOutlined, FileDoneOutlined } from '@ant-design/icons';
import moment from 'moment';

const DetailsContratForm = ({ record }) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const handleDetails = () => {
    setIsDetailsModalVisible(true);
    console.log(record)
  };

  const handleClose = () => {
    setIsDetailsModalVisible(false);
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  const renderDescriptions = () => {
    const fields = [
      { label: "Date de début", value: formatDate(record.dateDebut) },
      { label: "Délai de paiement (en jours)", value: record.delai },
      { label: "Date de fin", value: record.dateFin && formatDate(record.dateFin) },
      { label: "Client", value: record.client },
      { label: "Type de contrat", value: record.type },
      { label: "Total à payer", value: record.total !== undefined && record.total !== null && record.devise ? `${record.total} ${record.devise}` : null },   
      { label: "Prix du jour/homme", value: record.prixJourHomme !== undefined && record.prixJourHomme !== null && record.devise ? `${record.prixJourHomme} ${record.devise}` : null },   
      { label: "Fréquence de facturation", value: record.typeFrequenceFacturation },
      { label: "Détails spécifiques à la fréquence de facturation", value: record.detailsFrequence },
      { label: "Montant à facturer par mois", value: record.montantParMois !== undefined && record.montantParMois !== null && record.devise ? `${record.montantParMois} ${record.devise}` : null },   

    ];

    return fields
      .filter(field => field.value !== null && field.value !== undefined && field.value !== "")
      .map(field => (
        <Descriptions.Item key={field.label} label={field.label}>
          {field.value}
        </Descriptions.Item>
      ));
  };

  return (
    <>
      <Button icon={<InfoCircleOutlined />} size="small" onClick={handleDetails}>
        Détails
      </Button>
      <Modal
        title={`Détails du contrat : ${record.reference}`}
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
            description={`Référence : ${record.reference}`}
          />
          <Descriptions bordered style={{ marginTop: '16px' }} column={1}>
            {renderDescriptions()}
          </Descriptions>
        </Card>
      </Modal>
    </>
  );
};

export default DetailsContratForm;
