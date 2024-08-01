import React, { useState } from 'react';
import { Modal, Button, Descriptions, Card, Avatar, Tooltip, notification } from 'antd';
import { InfoCircleOutlined, FileDoneOutlined,EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import api from '../../../utils/axios';

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

  const Report = (key,reference) => {
    console.log("Generating contract with key: ", key," and reference : ", reference);
    api
      .get(`/contrat/contratFile/${key}/${reference}`, {responseType: 'blob', })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        window.open(url); 

      })
      .catch((error) => {
        notification.error("Une erreur lors de la génération du contrat!", error);
      });
  };

  const renderDescriptions = () => {
    const fields = [
      { label: "Date de début", value: formatDate(record?.dateDebut) },
      { label: "Date de fin", value: record?.dateFin && formatDate(record?.dateFin) },
      { label: "Délai de paiement (en jours)", value: record?.delai },
      { label: "Client", value: record?.client },
      { label: "Type de contrat", value: record?.type },
      { label: "Montant total du contrat (TTC)", value: record?.total !== undefined && record?.total !== null && record?.devise ? `${record?.total} ${record?.devise}` : null },   
      { label: "Prix du jour/homme", value: record?.prixJourHomme !== undefined && record?.prixJourHomme !== null && record?.devise ? `${record?.prixJourHomme} ${record?.devise}` : null },   
      { label: "Fréquence de facturation", value: record?.typeFrequenceFacturation },
      { label: "Détails spécifiques à la fréquence de facturation", value: record?.detailsFrequence },
      { label: "Montant à facturer par mois", value: record?.montantParMois !== undefined && record?.montantParMois !== null && record?.devise ? `${record?.montantParMois} ${record?.devise}` : null },   
      { label: "Contrat numérique", value:  <Tooltip title="Visualiser">
        <Button  disabled={!record.contratFile} icon={<EyeOutlined  />} size="small"
         onClick={() => Report(record.key,record.reference)}></Button> </Tooltip> },

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
    <>      <Tooltip title="Détails">
      <Button icon={<InfoCircleOutlined />} size="small" onClick={handleDetails}>
      </Button> </Tooltip>
      <Modal
        title={`Détails du contrat : ${record?.reference}`}
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
            description={`Référence : ${record?.reference}`}
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
