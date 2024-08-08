import React, { useState } from "react";
import { Modal, Button, Descriptions, Card, Avatar, Tooltip, Tag } from "antd";
import { InfoCircleOutlined, FileDoneOutlined,FileTextOutlined } from "@ant-design/icons";
import moment from "moment";

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
      case "Échue":
        return "red";
      case "Non échue":
        return "orange";
      case "Payée":
        return "green";
    }
  };

  const renderStatut = (statut) => {
    const color = getColor(statut);

    return <Tag color={color}>{statut}</Tag>;
  };

  const formatDate = (date) => {
    if (date == null) {
      return "-";
    } else return moment(date).format("DD/MM/YYYY");
  };

  return (
    <>
     
      <Tooltip title="Détails">
        <Button
          icon={<InfoCircleOutlined />}
          size="small"
          onClick={handleDetails}
        ></Button>
      </Tooltip>
      <Modal
        title={`Informations de la facture : ${record?.numero}`}
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
          <span>
            <div style={{ position: "relative", display: "inline-block", marginRight: 10 , marginTop:5}}>
              <Avatar icon={<FileTextOutlined />} />
            </div>
            {`Numéro : ${record?.numero}`}
          </span>
          {renderStatut(record?.statut)}
        </div>
        <Descriptions bordered style={{ marginTop: "16px" }} column={2}>
          <Descriptions.Item label="Client">{record?.client}</Descriptions.Item>
          <Descriptions.Item label="Contrat">
            {record?.contrat}
          </Descriptions.Item>
          <Descriptions.Item label="Date d'émission">
            {formatDate(record?.date)}
          </Descriptions.Item>
          <Descriptions.Item label="Délai de paiement (en jours)">
            {record?.delai}
          </Descriptions.Item>
          <Descriptions.Item label="Date d'échéance">
            {formatDate(record?.echeance)}
          </Descriptions.Item>
          <Descriptions.Item label="Retard">{record?.retard}</Descriptions.Item>
          <Descriptions.Item label="Montant de la facture">
            {record?.montant} {record?.devise}
          </Descriptions.Item>
          <Descriptions.Item label="Montant encaissé">
            {record?.montantEncaisse} {record?.devise}
          </Descriptions.Item>
          <Descriptions.Item label="Solde restant">
            {record?.solde} {record?.devise}
          </Descriptions.Item>
          <Descriptions.Item label="Action de recouvrement">
            {record?.actionRecouvrement}
          </Descriptions.Item>
          <Descriptions.Item label="Date de finalisation">
            {formatDate(record?.dateFinalisation)}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default DetailsFactureForm;
