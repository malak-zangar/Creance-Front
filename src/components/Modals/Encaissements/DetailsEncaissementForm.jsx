import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Descriptions,
  Avatar,
  Tooltip,
  notification,
} from "antd";
import { InfoCircleOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import moment from "moment";
import api from "../../../utils/axios";
import DetailsFactureForm from "../Factures/DetailsFactureForm";
import DetailsContratForm from "../Contrats/DetailsContratForm";

const DetailsEncaissementForm = ({ record }) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [facture, setFacture] = useState(null); // État pour stocker la facture associée
  const [isFactModalVisible, setIsFactModalVisible] = useState(false);
  const [selectedFact, setSelectedFact] = useState(null);
  const [contrat, setContrat] = useState(null); // État pour stocker le contrat associé
  const [isContModalVisible, setIsContModalVisible] = useState(false);
  const [selectedCont, setSelectedCont] = useState(null);

  useEffect(() => {
    if (record?.facture) {
      api
        .get(`/facture/getByID/${record.facture_id}`)
        .then((response) => {
          setFacture(response?.data?.facture);
          setSelectedFact(response?.data?.facture) // Mettre à jour l'état avec la facture
        })
        .catch((error) => {
          notification.error(
            "Erreur lors de la récupération de la facture:",
            error
          );
        });
    }
    if (record?.contrat) {
      api
        .get(`/contrat/getByID/${record.contrat_id}`)
        .then((response) => {
          setContrat(response?.data?.contrat); // Mettre à jour l'état avec la facture
        })
        .catch((error) => {
          notification.error(
            "Erreur lors de la récupération du contrat:",
            error
          );
        });
    }

  }, [record, isDetailsModalVisible]);

  const handleDetails = () => {
    setIsDetailsModalVisible(true);
  };

  const handleClose = () => {
    setIsDetailsModalVisible(false);
    setSelectedFact(null);
    setSelectedCont(null);
  };

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  const formatMontant = (value, devise) => {
    if (value === 0) {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: devise || "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(0);
    }
    if (!value || !devise) return "";

    const supportedCurrencies = ["EUR", "USD", "TND"];
    const currency = supportedCurrencies.includes(devise) ? devise : "";  
    return  new Intl.NumberFormat("fr-FR", {
      currency: currency,
      style: "currency",
      minimumFractionDigits: devise === "TND" ? 3 : 2,
      maximumFractionDigits: devise === "TND" ? 3 : 2,
    }).format(value);};
    
  return (
    <>
      {" "}
      <Tooltip title="Détails">
        <Button
          icon={<InfoCircleOutlined />}
          size="small"
          onClick={handleDetails}
        ></Button>{" "}
      </Tooltip>
      <Modal
        title={`Informations du paiement`}
        visible={isDetailsModalVisible}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Fermer
          </Button>,
        ]}
        style={{ top: 20 }}
      >
        <hr
          style={{ backgroundColor: "#CCCCCC", height: "1px", border: "none" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginRight: 10,
                marginTop: 5,
              }}
            >
              <Avatar icon={<MoneyCollectOutlined />} />
            </div>
            {`Référence : ${record.reference}`}
          </span>
        </div>

        <Descriptions bordered style={{ marginTop: "16px" }} column={1}>
          <Descriptions.Item label="Date de paiement">
            {formatDate(record.date)}
          </Descriptions.Item>
          <Descriptions.Item label="Montant encaissé">
            {formatMontant(record.montantEncaisse,record.devise)}
          </Descriptions.Item>
          <Descriptions.Item label="Mode de règlement">
            {record.modeReglement}
          </Descriptions.Item>
          <Descriptions.Item label="Client correspondant">
            {record.client}
          </Descriptions.Item>

          <Descriptions.Item label="Facture correspondante">
          {facture ? (
              <>
            <span>{record.facture}</span>
            <DetailsFactureForm record1={{ ...facture, key: facture.id }} />
            </>
            ) : (
              <span>Aucune facture</span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Contrat correspondant">
            {contrat ? (
              <>
                <span>{record.contrat}</span>
                <DetailsContratForm record={{ ...contrat, key: contrat.id }} />
              </>
            ) : (
              <span>Aucun contrat</span>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default DetailsEncaissementForm;
