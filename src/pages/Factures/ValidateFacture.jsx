import { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,
  DownloadOutlined,
  RetweetOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Button, Input, notification, Space, Table, Typography } from "antd";
import Highlighter from "react-highlight-words";
import DetailsFactureForm from "../../components/Modals/Factures/DetailsFactureForm";
import moment from "moment";
import { useParams } from "react-router-dom";
import api from "../../utils/axios";

const ValidateFacture = () => {
  const { param } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Rechercher ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 100,
            }}
          >
            Rechercher
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Réinitialiser
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrer
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Fermer
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleActivate = (key) => {
    api
      .put(`/facture/restaureFacture/${key}`)
      .then((response) => {
        notification.success({ message: "Facture activée avec succès" });
        fetchData(response.data.client_id);
      })
      .catch((error) => {
        notification.error("Erreur lors de l'activation de la facture!", error);
      });
  };

  const fetchData = () => {
    api
      .get(`/facture/getByClient/${param}`)
      .then((response) => {
        if (response.data.length > 0) {
          setClientName(response.data[0].client);
        }
        setData(
          response.data.map((facture) => ({
            key: facture.id,
            numero: facture.numero,
            date: moment(facture.date).format("YYYY-MM-DD"),
            delai: facture.delai,
            montant: facture.montant,
            montantEncaisse: facture.montantEncaisse,
            actif: facture.actif,
            client_id: facture.client_id,
            client: facture.client,
            contrat: facture.contrat,
            contrat_id: facture.contrat_id,
            solde: facture.solde,
            devise: facture.devise,
            echeance: moment(facture.echeance).format("YYYY-MM-DD"),
            retard: facture.retard,
            statut: facture.statut,
            dateFinalisation: facture.dateFinalisation
              ? moment(facture.dateFinalisation).format("YYYY-MM-DD")
              : null,
          }))
        );
        setLoading(false);
      })
      .catch((error) => {
        notification.error("Une erreur lors de la récupération des factures!", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Report = (key) => {
    api
      .get(`/facture/report/${key}`, {
        responseType: "blob",
      })
      .then((response) => {

        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report_${key}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notification.success({ message: "Rapport facture généré avec succès" });

        fetchData();
      })
      .catch((error) => {
        notification.error("Une erreur lors de la génération du rapport!", error);
      });
  };

  const formatMontant = (value, devise) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: devise,
      minimumFractionDigits: devise === "TND" ? 3 : 2,
      maximumFractionDigits: devise === "TND" ? 3 : 2,
    }).format(value);
  };

  const columns = [
    {
      title: "Référence",
      dataIndex: "numero",
      ...getColumnSearchProps("numero"),
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => moment(text).format("DD/MM/YYYY"),

      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Client",
      dataIndex: "client",
      ...getColumnSearchProps("client"),
    },
    {
      title: "Contrat",
      dataIndex: "contrat",
      ...getColumnSearchProps("contrat"),
    },
    {
      title: "Montant",
      dataIndex: "montant",
      ...getColumnSearchProps("montant"),
      sorter: (a, b) => a.montant - b.montant,
      render: (_, record) => formatMontant(record.montant, record.devise),
    },

    {
      title: "Action(s)",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<RetweetOutlined />}
            size="small"
            onClick={() => handleActivate(record.key)}
            disabled={record.actif}
          >
            activer
          </Button>
          <Button
            icon={<DownloadOutlined />}
            size="small"
            onClick={() => Report(record.key)}
          >
            Télécharger
          </Button>

          <DetailsFactureForm record={record} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>
        <span>
          {" "}
          <FileTextOutlined />{" "}
        </span>
        {`Les factures du client : ${clientName}`}{" "}
      </Typography.Title>

      <Table
        scroll={{
          x: "max-content",
        }}
        loading={loading}
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{
          total: data.length,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} éléments`,
          pageSize: 10,
        }}
      />
    </div>
  );
};

export default ValidateFacture;
