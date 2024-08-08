import React, { useEffect, useState } from "react";
import { Modal, Button, Descriptions, Card, Avatar, Tooltip, notification } from "antd";
import { InfoCircleOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import moment from "moment";
import api from "../../../utils/axios";
import DetailsFactureForm from '../Factures/DetailsFactureForm';

const DetailsEncaissementForm = ({ record }) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [facture, setFacture] = useState(null); // État pour stocker la facture associée
  const [isFactModalVisible, setIsFactModalVisible] = useState(false);
  const [selectedFact, setSelectedFact] = useState(null);

  useEffect(() => {
    if (record?.facture) {
      api
        .get(`/facture/getByID/${record.facture_id}`)
        .then((response) => {
          console.log(response?.data?.facture)
          setFacture(response?.data?.facture); // Mettre à jour l'état avec la facture
        })
        .catch((error) => {
          notification.error("Erreur lors de la récupération de la facture:", error);
        });
    }

  
    console.log(record)
  }, [record,isDetailsModalVisible]);

  const handleDetails = () => {
    setIsDetailsModalVisible(true);
  };

  const handleClose = () => {
    setIsDetailsModalVisible(false);
    setSelectedFact(null);
  };

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };
  const handleFactClick = (fact) => {
    setSelectedFact(fact);
    setIsFactModalVisible(true);
  };
  return (
    <>       <Tooltip title="Détails">
      <Button
        icon={<InfoCircleOutlined />}
        size="small"
        onClick={handleDetails}
      >
      </Button>        </Tooltip>

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
     <hr style={{ backgroundColor: '#CCCCCC', height: '1px', border: 'none' }}/>    
    <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
                 <span>

              <div style={{ position: "relative", display: "inline-block", marginRight: 10 , marginTop:5 }}>
                <Avatar icon={<MoneyCollectOutlined />} />
              </div>
             {`Référence : ${record.reference}`}
                </span>

              </div>
            
          <Descriptions bordered style={{ marginTop: "16px" }} column={1}>
       
            <Descriptions.Item label="Client">
              {record.client}
            </Descriptions.Item>
            <Descriptions.Item label="Facture">
              <span onClick={() => handleFactClick(facture)}
              >{record.facture}</span>
        <DetailsFactureForm record={facture} />
      
            </Descriptions.Item>
            <Descriptions.Item label="Contrat">
              {record.contrat}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {formatDate(record.date)}
            </Descriptions.Item>
            <Descriptions.Item label="Montant encaissé">
              {record.montantEncaisse} {record.devise}

            </Descriptions.Item>
            <Descriptions.Item label="Mode de règlement">
              {record.modeReglement}
            </Descriptions.Item>
          </Descriptions>
      </Modal>
    </>
  );
};

export default DetailsEncaissementForm;
