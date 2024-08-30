import { Modal, Table } from "antd";
import { useEffect, useState } from "react";
import api from "../../../utils/axios";
import moment from "moment";

const ExchangeRateHistoryModal = ({ currency, visible, onClose }) => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchHistoryData();
    }
  }, [visible]);

  const fetchHistoryData = () => {
    api
      .get(`/paramentreprise/getExchangeRateHistory/${currency}`)
      .then((response) => {
        setHistoryData(response.data.exchangeRateHistory);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération de l'historique des taux:",
          error
        );
      });
  };

  const columns = [
    {
      title: "Date d'insertion",
      dataIndex: "dateInsertion",
      render: (text) => moment(text).format("DD/MM/YYYY"),
      sorter: (a, b) => new Date(a.dateInsertion) - new Date(b.dateInsertion),
    },
    {
      title: `Taux (${currency} -> EUR)`,
      dataIndex: "exchangeRate",
      sorter: (a, b) => a.exchangeRate - b.exchangeRate,
    },
  ];

  return (
    <Modal
      title={`Historique des taux de change (${currency} -> EUR)`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      style={{ top: 10 }}
    >
      <Table
        scroll={{
          x: "max-content",
        }}
        columns={columns}
        size="small"
        dataSource={historyData}
        pagination={{
          total: historyData.length,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} éléments`,
          pageSize: 10,
        }}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </Modal>
  );
};

export default ExchangeRateHistoryModal;
