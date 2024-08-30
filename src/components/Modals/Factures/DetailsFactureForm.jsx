import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Descriptions,
  Avatar,
  notification,
  Tooltip,
  Tag,
} from "antd";
import {
  InfoCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import moment from "moment";
import HistoriqueRelance from "../Emails/HistoriqueRelance";
import api from "../../../utils/axios";

const DetailsFactureForm = ({ record1 }) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [record, setRecord] = useState(null);

  const fetchFacture = (factureId) => {
    api
      .get(`/facture/getByIDSerializedForEmail/${factureId}`)
      .then((response) => {
        if (response.data) {
          setRecord(response.data.facture);
        } else {
          setRecord(null);
        }
      })
      .catch((error) => {
        notification.error(
          "Erreur lors de la récupération de la facture:",
          error
        );
      });
  };
  useEffect(() => {
    fetchFacture(record1?.key);
  }, []);

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

  const currentDateNow = moment();

  const calculateRelanceDates = (
    dateEcheance,
    delaiRelance,
    maxRelance,
    dateFinalisation
  ) => {
    let relanceDates = [];
    let currentDate = moment(dateEcheance);

    for (let i = 1; i <= maxRelance; i++) {
      currentDate = currentDate.add(delaiRelance, "days");
      if (currentDate < currentDateNow) {
        relanceDates.push(currentDate.clone());
      }
    }

    return relanceDates;
  };
  const isRelanceDisabled =
    record?.delaiRelance === 0 && record?.maxRelance === 0;

  const renderHistoriqueRelance = () => {
    const relanceDates = calculateRelanceDates(
      record?.echeance,
      record?.delaiRelance,
      record?.maxRelance,
      record?.dateFinalisation
    );
  
    if (isRelanceDisabled) {
      return "Relance désactivée pour le client associé";
    } else if (record?.actifRelance === false) {
      return "Relance désactivée pour cette facture";
    } else if (
      record?.statut === "Payée" &&
      record?.dateFinalisation <= record?.echeance
    ) {
      return "Payée au délai";
    } else if (record?.statut === "Payée" && relanceDates.length === 0) {
      return "Payée au délai";
    } else if (
      relanceDates.length === 0 &&
      (record?.statut === "Non échue" || record?.statut === "Échue")
    ) {
      return "Pas encore";
    } else {
      return <HistoriqueRelance record={record} />;
    }
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

    // Liste des devises supportées
    const supportedCurrencies = ["EUR", "USD", "TND"];
    const currency = supportedCurrencies.includes(devise) ? devise : "";
    return new Intl.NumberFormat("fr-FR", {
      currency: currency,
      style: "currency",
      minimumFractionDigits: devise === "TND" ? 3 : 2,
      maximumFractionDigits: devise === "TND" ? 3 : 2,
    }).format(value);
  };

  return (
    <>
      <Tooltip title="Détails">
        <Button
          icon={<InfoCircleOutlined />}
          size="small"
          onClick={handleDetails}
        ></Button>{" "}
      </Tooltip>
      <Modal
        title={`Informations de la facture `}
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
              <Avatar icon={<FileTextOutlined />} />
            </div>
            {`Référence : ${record?.numero}`}
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
          <Descriptions.Item label="Date d'échéance">
            {formatDate(record?.echeance)}
          </Descriptions.Item>
          <Descriptions.Item label="Délai de paiement">
            {record?.delai} jours
          </Descriptions.Item>

          <Descriptions.Item label="Retard">
            {record?.retard} jours
          </Descriptions.Item>
          <Descriptions.Item label="Montant TTC de la facture">
            {formatMontant(record?.montant, record?.devise)}
          </Descriptions.Item>
          <Descriptions.Item label="Montant encaissé">
            {formatMontant(record?.montantEncaisse, record?.devise)}
          </Descriptions.Item>
          <Descriptions.Item label="Solde restant">
            {formatMontant(record?.solde, record?.devise)}
          </Descriptions.Item>
          <Descriptions.Item label="Historique de relances">
            {renderHistoriqueRelance()}
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
