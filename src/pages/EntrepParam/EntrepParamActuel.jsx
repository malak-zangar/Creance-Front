import { useState, useEffect } from "react";
import { ControlOutlined } from "@ant-design/icons";
import { Button, Descriptions, notification, Typography, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import UpdateParamForm from "../../components/Modals/Params/UpdateParamForm";
import api from "../../utils/axios";
import moment from "moment";

const EntrepParamActuel = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api
      .get("/paramentreprise/getLatest")
      .then((response) => {
        const param = response.data.paramentreprise;
        setData({
          key: param.id,
          raisonSociale: param.raisonSociale,
          email: param.email,
          dateInsertion: moment(param.dateInsertion).format("YYYY-MM-DD"),
          phone: param.phone,
          adresse: param.adresse,
          identifiantFiscal: param.identifiantFiscal,
          tauxTndEur:param.tauxTndEur,
          tauxUsdEur:param.tauxUsdEur
        });
      })
      .catch((error) => {
        notification.error({
          message: "Erreur lors de la récupération des paramètres!",
          description: error.message,
        });
      });
  };

  const handleParams = () => {
    fetchData();
  };

  const ToHistoriqueParam = () => {
    navigate("/parametres/historique");
  };

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  return (
    <div>
      <Typography.Title level={4}>Les paramètres actuels</Typography.Title>

      <Button icon={<ControlOutlined />} onClick={ToHistoriqueParam}>
        Historique des paramètres
      </Button>
      <Descriptions
        bordered
        column={2}
        size="small"
        className="mb-6 mt-6"

      >
        <Descriptions.Item label="ID">
          {data.key}
        </Descriptions.Item>
        <Descriptions.Item label="Raison sociale">
          {data.raisonSociale}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
        <Descriptions.Item label="Téléphone">{data.phone}</Descriptions.Item>
        <Descriptions.Item label="ID Fiscal">
          {data.identifiantFiscal}
        </Descriptions.Item>
        
        <Descriptions.Item label="Date d'insertion">
          {formatDate(data.dateInsertion)}
        </Descriptions.Item>
        <Descriptions.Item label="Taux de change (TND -> EUR)">
          {data.tauxTndEur}
        </Descriptions.Item>
        <Descriptions.Item label="Taux de change (USD -> EUR)">
        {data.tauxUsdEur}
        </Descriptions.Item>
        <Descriptions.Item label="Adresse">{data.adresse}</Descriptions.Item>
        <Descriptions.Item label="Action(s)">
        <UpdateParamForm record={data} handleState={handleParams} />
        </Descriptions.Item>
      </Descriptions>
      
    </div>
  );
};

export default EntrepParamActuel;
