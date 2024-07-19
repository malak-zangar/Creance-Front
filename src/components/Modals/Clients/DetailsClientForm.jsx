import React, { useState } from 'react';
import { Modal, Button, Descriptions, Card, Avatar } from 'antd';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';

const DetailsClientForm = ({ record }) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const handleDetails = () => {
    setIsDetailsModalVisible(true);
  };

  const handleClose = () => {
    setIsDetailsModalVisible(false);
  };

  return (
    <>
      <Button icon={<InfoCircleOutlined />} size="small" onClick={handleDetails}>
        Détails
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
            description={`ID : ${record.key}`}
          />
          <Descriptions bordered style={{ marginTop: '16px' }} column={1}>
            <Descriptions.Item label="Nom d'utilisateur">{record.username}</Descriptions.Item>
            <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
            <Descriptions.Item label="Email à copier en cc">{record.emailcc}</Descriptions.Item>
            <Descriptions.Item label="Téléphone">{record.phone}</Descriptions.Item>
            <Descriptions.Item label="ID Fiscal">{record.identifiantFiscal}</Descriptions.Item>
            <Descriptions.Item label="Adresse">{record.adresse}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    </>
  );
};

export default DetailsClientForm;
