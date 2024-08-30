import { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Typography,
  Space,
  Input,
  notification,
  Tooltip,
  DatePicker,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  DeleteTwoTone,
  FilterTwoTone,
  EyeTwoTone,
  EuroCircleOutlined,
} from "@ant-design/icons";
import { AddEncaissementForm } from "../../components/Modals/Encaissements/AddEncaissementForm";
import UpdateEncaissementForm from "../../components/Modals/Encaissements/UpdateEncaissementForm";
import DetailsEncaissementForm from "../../components/Modals/Encaissements/DetailsEncaissementForm";
import moment from "moment";
import api from "../../utils/axios";

const { RangePicker } = DatePicker;

const ListeEncaissements = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [dateRange, setDateRange] = useState([]);

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

  useEffect(() => {
    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      fetchData(startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
    }
  }, [dateRange]);

  const Delete = (key) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cet encaissement?",
      content: "Cette action est irréversible.",
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      onOk: () => {
        api
          .delete(`/encaissement/cancelEncaissement/${key}`)
          .then((response) => {
            handleFilter();
            notification.success({
              message: "Encaissement supprimé avec succès",
            });
          })
          .catch((error) => {
            notification.error({
              message: "Erreur lors de la suppression de l'encaissement!",
              description: error.toString(),
            });
          });
      },
    });
  };


  const handleAddEncaissementState = (record) => {
  };

  const handleEncaissements = (record) => {
    const tempEncaissement = data.map((encaissement) => {
      if (encaissement.key === record.key) {
        return record;
      } else {
        return encaissement;
      }
    });

    setData(tempEncaissement);
    handleFilter();
  };

  const fetchData = (startDate, endDate) => {
    setLoading(true);
    api
      .get(`/encaissement/getAll?start=${startDate}&end=${endDate}`)
      .then((response) => {
        const fetchedData = response.data.map((encaissement) => ({
          key: encaissement.id,
          reference: encaissement.reference,
          date: moment(encaissement.date).format("YYYY-MM-DD"),
          modeReglement: encaissement.modeReglement,
          montantEncaisse: encaissement.montantEncaisse,
          facture_id: encaissement.facture_id,
          facture: encaissement.facture,
          client: encaissement.client,
          contrat: encaissement.contrat,
          devise: encaissement.devise,
          contrat_id: encaissement.contrat_id,
          client_id: encaissement.client_id,
        }));
        if (fetchedData.length === 0) {
          notification.info({
            message: "Aucun paiement trouvé",
            description:
              "Il n'y a aucun paiement pour la période sélectionnée.",
          });
        }
        setData(fetchedData);

        setLoading(false);
      })
      .catch((error) => {
        notification.error({
          message: "Erreur de récupération des paiements",
          description:
            "Il y a eu une erreur lors de la récupération des paiements.",
        });
        setLoading(false);
      });
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
          {} Liste des paiements{" "}
          <span style={{ color: "gray", fontSize: "17px" }}>
            {" "}
            pour la période : {}
            {startDate.format("DD/MM/YYYY")} - {endDate.format("DD/MM/YYYY")}
          </span>
        </span>
      );
    }
    return " Liste des paiements";
  };

  const columns = [
    {
      title: "Date de paiement",
      dataIndex: "date",
      render: (text) => moment(text).format("DD/MM/YYYY"),

      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Référence du paiement",
      dataIndex: "reference",
      ...getColumnSearchProps("reference"),
    },
    {
      title: "Mode de règlement",
      dataIndex: "modeReglement",
      filters: [
        { text: "Chèque", value: "Chèque" },
        { text: "Virement", value: "Virement" },
      ],
      onFilter: (value, record) => record.modeReglement === value,
    },
    {
      title: "Facture correspondante",
      dataIndex: "facture",
      ...getColumnSearchProps("facture"),
    },
    {
      title: "Client correspondant ",
      dataIndex: "client",
      ...getColumnSearchProps("client"),
    },

    {
      title: "Action(s)",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <UpdateEncaissementForm
            record={record}
            handleState={handleEncaissements}
          />{" "}

          <DetailsEncaissementForm record={record} />
          <Tooltip title="Supprimer">
            <Button
              icon={<DeleteTwoTone />}
              size="small"
              onClick={() => Delete(record.key)}
            ></Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>
        <span>
          <EuroCircleOutlined />
        </span>
        {renderTitle()}{" "}
      </Typography.Title>

      <Space className="mb-4">
        <AddEncaissementForm handleState={handleAddEncaissementState} />
      </Space>

      {!data.length || dateRange.length === 0 ? ( // Check if data array is empty or date range is cleared
        <div>
          <Typography.Title level={5}>
            Veuillez sélectionner une période pour afficher les paiements.
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
            showSorterTooltip={{ target: "sorter-icon" }}
          />
        </>
      )}
    </div>
  );
};

export default ListeEncaissements;
