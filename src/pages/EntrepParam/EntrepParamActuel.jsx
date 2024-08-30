import { useState, useEffect } from "react";
import {
  ControlTwoTone,
  SettingOutlined,
  MailTwoTone,
  InfoCircleTwoTone,
  MoneyCollectTwoTone,
} from "@ant-design/icons";
import {
  Button,
  Descriptions,
  notification,
  Typography,
  Row,
  Col,
  Card,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import UpdateParamForm from "../../components/Modals/Params/UpdateParamForm";
import api from "../../utils/axios";
import moment from "moment";
import { AddMailForm } from "../../components/Modals/Emails/AddMailForm";
import UpdateMailForm from "../../components/Modals/Emails/UpdateMailForm";

const EntrepParamActuel = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [mail, setMail] = useState([]);

  useEffect(() => {
    fetchData();
    fetchMail();
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
          tauxTndEur: param.tauxTndEur,
          tauxUsdEur: param.tauxUsdEur,
        });
      })
      .catch((error) => {
        notification.error({
          message: "Erreur lors de la récupération des paramètres!",
          description: error.message,
        });
      });
  };

  const fetchMail = () => {
    api
      .get("/emailcascade/getAll")
      .then((response) => {
        const mails = response.data;
        setMail(
          mails.map((mail) => ({
            key: mail.id,
            type: mail.type,
            objet: mail.objet,
            dateInsertion: moment(mail.dateInsertion).format("YYYY-MM-DD"),
            corps: mail.corps,
          }))
        );
      })
      .catch((error) => {
        notification.error({
          message: "Erreur lors de la récupération des emails!",
          description: error.message,
        });
      });
  };

  const handleParams = () => {
    fetchData();
    fetchMail();
  };

  const ToHistoriqueParam = () => {
    navigate("/parametres/historique");
  };

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  const handleAddEmailState = (record) => {
    setMail([record, ...mail]);
    fetchMail();
  };

  const handleEmails = () => {
    fetchData();
    fetchMail();
  };

  return (
    <div>
      <Typography.Title level={4}>
        <span>
          {" "}
          <SettingOutlined />{" "}
        </span>
        Les paramètres actuels
      </Typography.Title>

      <Space>
        <UpdateParamForm record={data} handleState={handleParams} />
        <Button
          icon={<ControlTwoTone />}
          size="small"
          onClick={ToHistoriqueParam}
        >
          Historique des paramètres
        </Button>
      </Space>

      <Row gutter={16} className="mb-6 mt-6">
        <Col span={24}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <InfoCircleTwoTone
                  style={{ fontSize: "18px", marginRight: "8px" }}
                />
                <span>Informations personnelles de l'entreprise</span>
              </div>
            }
          >
            <Descriptions bordered size="small" column={3}>
              <Descriptions.Item label="Raison sociale">
                {data.raisonSociale}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
              <Descriptions.Item label="Téléphone">
                {data.phone}
              </Descriptions.Item>
              <Descriptions.Item label="ID Fiscal">
                {data.identifiantFiscal}
              </Descriptions.Item>
              <Descriptions.Item label="Adresse">
                {data.adresse}
              </Descriptions.Item>
              <Descriptions.Item label="Date d'insertion">
                {formatDate(data.dateInsertion)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="mb-6 mt-6">
        <Col span={10}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <MoneyCollectTwoTone
                  style={{ fontSize: "18px", marginRight: "8px" }}
                />
                <span>Taux de change</span>
              </div>
            }
          >
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Taux de change (TND -> EUR)">
                {data.tauxTndEur}
              </Descriptions.Item>
              <Descriptions.Item label="Taux de change (USD -> EUR)">
                {data.tauxUsdEur}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={14}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MailTwoTone
                    style={{ fontSize: "18px", marginRight: "8px" }}
                  />
                  <span>Modèles d'emails</span>
                </div>
                <AddMailForm handleState={handleAddEmailState} />
              </div>
            }
          >
            <Descriptions bordered size="small" column={2}>
              {mail.map((mail) => (
                <Descriptions.Item
                  key={mail.key}
                  label={"Mail de " + mail.type}
                >
                  <UpdateMailForm record={mail} handleState={handleEmails} />
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EntrepParamActuel;
