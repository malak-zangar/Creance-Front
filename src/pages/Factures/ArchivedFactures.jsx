import { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  FilterTwoTone,
  EyeTwoTone,
} from "@ant-design/icons";
import {
  Button,
  Input,
  notification,
  Space,
  Table,
  Tooltip,
  Typography,
  DatePicker,
} from "antd";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import DetailsFactureForm from "../../components/Modals/Factures/DetailsFactureForm";
import moment from "moment";
import api from "../../utils/axios";

const { RangePicker } = DatePicker;

const ArchivedFactures = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([]);

  const navigate = useNavigate();
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

  const fetchData = (startDate, endDate) => {
    setLoading(true);
    api
      .get(`/facture/getAllPaid?start=${startDate}&end=${endDate}`)
      .then(async (response) => {
        const fetchedData = response.data.map((facture) => ({
          key: facture.id,
          numero: facture.numero,
          date: moment(facture.date).format("YYYY-MM-DD"),
          delai: facture.delai,
          montant: facture.montant,
          montantEncaisse: facture.montantEncaisse,
          actif: facture.actif,
          client_id: facture.client_id,
          client: facture.client,
          actifRelance: facture.actifRelance,
          contrat: facture.contrat,
          contrat_id: facture.contrat_id,
          solde: facture.solde,
          devise: facture.devise,
          echeance: moment(facture.echeance).format("YYYY-MM-DD"),
          retard: facture.retard,
          statut: facture.statut,
          dateFinalisation: facture.dateFinalisation
            ? moment(facture.dateFinalisation).format("YYYY-MM-DD")
            : null, // Format date
        }));

        if (fetchedData.length === 0) {
          notification.info({
            message: "Aucune facture trouvée",
            description:
              "Il n'y a aucune facture pour la période sélectionnée.",
          });
        }

        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        notification.error({
          message: "Erreur de récupération des factures",
          description:
            "Il y a eu une erreur lors de la récupération des factures.",
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      fetchData(startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
    }
  }, [dateRange]);

  const ToListActif = () => {
    navigate("/factures/actif");
  };

  const Report = (key) => {
    api
      .get(`/facture/auto/${key}`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        window.open(url);
      })
      .catch((error) => {
        notification.error(
          "Une erreur lors de la génération de la facture!",
          error
        );
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

  const handleResetModel = () => {
    setDateRange([]);
  };

  const handleFilter = () => {
    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      fetchData(startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
    } else {
      notification.warning({
        description: "SVP séléctionner une durée.",
      });
    }
  };

  const renderTitle = () => {
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      return (
        <span>
          {} Liste des factures payées{" "}
          <span style={{ color: "gray", fontSize: "17px" }}>
            {" "}
            pour la période : {}
            {startDate.format("DD/MM/YYYY")} - {endDate.format("DD/MM/YYYY")}
          </span>
        </span>
      );
    }
    return "Liste des factures payées";
  };

  const columns = [
    {
      title: "Date de finalisation",
      dataIndex: "dateFinalisation",
      render: (text) => moment(text).format("DD/MM/YYYY"),

      sorter: (a, b) => moment(a.echeance).unix() - moment(b.echeance).unix(),
    },

    {
      title: "Date d'émission",
      dataIndex: "date",
      render: (text) => moment(text).format("DD/MM/YYYY"),

      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Référence",
      dataIndex: "numero",
      ...getColumnSearchProps("numero"),
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
      title: "Montant TTC",
      dataIndex: "montant",
      ...getColumnSearchProps("montant"),
      render: (_, record) => formatMontant(record.montant, record.devise),
    },

    {
      title: "Action(s)",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Visualiser">
            <Button
              icon={<EyeTwoTone />}
              size="small"
              onClick={() => Report(record.key)}
            ></Button>{" "}
          </Tooltip>
          <DetailsFactureForm record1={record} />
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
        {renderTitle()}{" "}
      </Typography.Title>

      <Space className="mb-4">
        <Button onClick={ToListActif} icon={<FileTextOutlined />}>
          Factures en cours
        </Button>
      </Space>

      {!data.length || dateRange.length === 0 ? ( // Check if data array is empty or date range is cleared
        <div>
          <Typography.Title level={5}>
            Veuillez sélectionner une période pour afficher les factures payées.
          </Typography.Title>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            style={{ width: "100%", marginBottom: "16px" }}
            placeholder={["Date de début", "Date de fin"]}
          />
          <Button
            key="reset"
            onClick={handleResetModel}
            style={{ marginRight: "18px" }}
          >
            Réinitialiser
          </Button>
          <Button key="filter" type="primary" onClick={handleFilter}>
            Filtrer
          </Button>
        </div>
      ) : (
        <>
          <Button
            icon={<FilterTwoTone />}
            type="default"
            onClick={() => setDateRange([])} // Clear the date range to show the RangePicker again
            style={{ marginLeft: "16px", marginBottom: "16px" }}
          >
            Changer la période
          </Button>

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
        </>
      )}
    </div>
  );
};

export default ArchivedFactures;
