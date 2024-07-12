import React, { useState } from 'react';
import { Modal, Button, Descriptions, Card, Avatar } from 'antd';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';

const DetailsContratForm = ({ record }) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const handleDetails = () => {
    setIsDetailsModalVisible(true);
  };

  const handleClose = () => {
    setIsDetailsModalVisible(false);
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
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
                <Avatar icon={<UserOutlined />} />
              </div>
            }
            description={`ID : ${record.key}`}
          />
          <Descriptions bordered style={{ marginTop: '16px' }} column={1}>
            <Descriptions.Item label="Référence">{record.reference}</Descriptions.Item>
            <Descriptions.Item label="Date de début">{formatDate(record.dateDebut)}</Descriptions.Item>
            <Descriptions.Item label="Délai">{record.delai}</Descriptions.Item>
            <Descriptions.Item label="Date de fin">{formatDate(record.dateFin)}</Descriptions.Item>
            <Descriptions.Item label="Conditions financières">{record.conditionsFinancieres}</Descriptions.Item>
            <Descriptions.Item label="Prochaine action">{record.prochaineAction}</Descriptions.Item>
            <Descriptions.Item label="Date de la prochaine action">{formatDate(record.dateProchaineAction)}</Descriptions.Item>
            <Descriptions.Item label="Date de rappel pour renégociation">{formatDate(record.dateRappel)}</Descriptions.Item>
            <Descriptions.Item label="Client">{record.client}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    </>
  );
};

export default DetailsContratForm;
