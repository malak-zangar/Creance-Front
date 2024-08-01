import { useState, useEffect } from "react";
import { ControlOutlined } from "@ant-design/icons";
import {
  Button,
  Descriptions,
  notification,
  Typography,
  Row,
  Col,
} from "antd";
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
        console.log(response.data.paramentreprise);

        setData({
          key: param.id,
          raisonSociale: param.raisonSociale,
          email: param.email,
          dateInsertion: moment(param.dateInsertion).format("YYYY-MM-DD"),
          phone: param.phone,
          adresse: param.adresse,
          identifiantFiscal: param.identifiantFiscal,
        });
        console.log(data);
      })
      .catch((error) => {
        notification.error(
          "Erreur lors de la récupération des paramètres!",
          error.message
        );
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
      <Typography.Title level={2}>Les paramètres actuels</Typography.Title>

      <Button icon={<ControlOutlined />} onClick={ToHistoriqueParam}>
        Historique des paramètres
      </Button>
      <Descriptions
        bordered
        column={1}
        size="small"
        className="mb-6 mt-6 ml-12 mr-12 "
      >
        <Descriptions.Item labelStyle={{ width: "350px" }} label="ID">
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
        <Descriptions.Item label="Adresse">{data.adresse}</Descriptions.Item>
        <Descriptions.Item label="Date d'insertion">
          {formatDate(data.dateInsertion)}
        </Descriptions.Item>
      </Descriptions>
      <Row justify="end">
        <Col>
          <UpdateParamForm record={data} handleState={handleParams} />{" "}
        </Col>
      </Row>
    </div>
  );
};

export default EntrepParamActuel;
