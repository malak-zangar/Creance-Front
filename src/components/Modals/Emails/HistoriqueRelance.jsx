import React, { useState } from "react";
import { Modal, Button, Descriptions, Avatar, List, Tooltip } from "antd";
import { HistoryOutlined, NotificationOutlined } from "@ant-design/icons";
import moment from "moment";

const HistoriqueRelance = ({ record }) => {
  const [isHistoriqueModalVisible, setisHistoriqueModalVisible] =
    useState(false);

  const handleDetails = () => {
    setisHistoriqueModalVisible(true);
  };

  const handleClose = () => {
    setisHistoriqueModalVisible(false);
  };

  const formatDate = (date) => {
    return date ? moment(date).format("DD/MM/YYYY") : "-";
  };

  const currentDateNow = moment();

  const calculateRelanceDates = (dateEcheance, delaiRelance, maxRelance) => {
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

  const displayDelaiRelance = (delaiRelance) => {
    if (delaiRelance % 7 === 0) {
      return `${delaiRelance / 7} semaines`;
    }
    return `${delaiRelance} jours`;
  };

  const relanceDates = calculateRelanceDates(
    record?.echeance,
    record?.delaiRelance,
    record?.maxRelance
  );

  return (
    <>
      <Tooltip title="Historique des relances">
        <Button
          icon={<HistoryOutlined />}
          size="small"
          onClick={handleDetails}
        />
      </Tooltip>
      <Modal
        title={`Historique des relances `}
        visible={isHistoriqueModalVisible}
        onCancel={handleClose}
        width={600}
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
              <Avatar icon={<NotificationOutlined />} />
            </div>
            {`Référence de la facture : ${record?.numero}`}
          </span>
        </div>
        <Descriptions bordered style={{ marginTop: "16px" }} column={1}>
          <Descriptions.Item label="Délai de relance">
            {displayDelaiRelance(record?.delaiRelance)}
          </Descriptions.Item>
          <Descriptions.Item label="Maximum de relance">
            {`${record?.maxRelance} fois`}
          </Descriptions.Item>
          <Descriptions.Item label="Relances effectuées">
            <List
              size="small"
              dataSource={relanceDates}
              renderItem={(date, index) => (
                <List.Item key={index}>
                  <span>{`Relance n°${index + 1} : ${formatDate(date)}`}</span>
                </List.Item>
              )}
            />
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default HistoriqueRelance;
