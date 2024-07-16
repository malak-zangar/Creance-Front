import React, { useEffect, useState } from "react";
import { Modal, Button, Descriptions, Card, Avatar } from "antd";
import { InfoCircleOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";

const DetailsEncaissementForm = ({ record }) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [facture, setFacture] = useState(null); // État pour stocker la facture associée

  useEffect(() => {
    if (record?.facture) {
      axios
        .get(`http://localhost:5555/facture/getByID/${record.key}`)
        .then((response) => {
          console.log(response.data.facture)
          setFacture(response.data.facture); // Mettre à jour l'état avec la facture
        })
        .catch((error) => {
          notification.error("Erreur lors de la récupération de la facture:", error);
        });
    }
  }, [record]);

  const handleDetails = () => {
    setIsDetailsModalVisible(true);
  };

  const handleClose = () => {
    setIsDetailsModalVisible(false);
  };

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  return (
    <>
      <Button
        icon={<InfoCircleOutlined />}
        size="small"
        onClick={handleDetails}
      >
        Détails
      </Button>
      <Modal
        title={`Informations du paiement : ${record.reference}`}
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
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar icon={<MoneyCollectOutlined />} />
              </div>
            }
            description={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{`ID : ${record.key}`}</span>
              </div>
            }
          />
          <Descriptions bordered style={{ marginTop: "16px" }} column={1}>
            <Descriptions.Item label="Référence">
              {record.reference}
            </Descriptions.Item>
            <Descriptions.Item label="Client">
              {record.client}
            </Descriptions.Item>
            <Descriptions.Item label="Facture">
              {record.facture}
            </Descriptions.Item>
            <Descriptions.Item label="Contrat">
              {record.contrat}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {formatDate(record.date)}
            </Descriptions.Item>
            <Descriptions.Item label="Montant encaissé">
              {record.montantEncaisse} {facture?.devise}

            </Descriptions.Item>
            <Descriptions.Item label="Mode de règlement">
              {record.modeReglement}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    </>
  );
};

export default DetailsEncaissementForm;
