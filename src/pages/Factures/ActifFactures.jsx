import { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,
  FolderOpenOutlined,
  EyeTwoTone,FileTextOutlined
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Input,
  Modal,
  notification,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import UpdateFactureForm from "../../components/Modals/Factures/UpdateFactureForm";
import { AddFactureForm } from "../../components/Modals/Factures/AddFactureForm";
import moment from "moment";
import DetailsFactureForm from "../../components/Modals/Factures/DetailsFactureForm";
import api from "../../utils/axios";

const ActifFactures = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const ToHistorique = (clientId) => {
    navigate(`/clients/historique/facture/${clientId}`);
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/facture/getAllUnpaid");
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

    } catch (error) {
      notification.error({
        message: "Erreur lors de la récupération des factures !",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ToListArchive = () => {
    console.log("Button ToListArchive clicked");
    navigate("/factures/archive");
  };

  const handleFactures = (record) => {
    const tempFacture = data.map((facture) => {
      if (facture.key === record.key) {
        return record;
      } else {
        return facture;
      }
    });

    setData(tempFacture);
    fetchData();
  };

  const handleAddFactureState = (record) => {
    setData([record, ...data]);
  };

  const Report = (key) => {
    console.log("Generating facture with key: ", key);
    api
      .get(`/facture/auto/${key}`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        window.open(url);
      })
      .catch((error) => {
        notification.error({
          message: "Une erreur lors de la génération de la facture !",
          description: error.message,
        });
      });
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const columns1 = [
    { label: "Référence de facture", value: "numero" },
    { label: "Date d'émission", value: "date" },
    { label: "Délai de paiement", value: "delai" },
    { label: "Date d'échéance", value: "echeance" },
    { label: "Retard", value: "retard" },
    { label: "Montant total", value: "montant" },
    { label: "Montant encaissé", value: "montantEncaisse" },
    { label: "Solde restant", value: "solde" },
    { label: "Devise", value: "devise" },
    { label: "Statut", value: "statut" },
    { label: "Actif", value: "actif" },
    { label: "Client", value: "client" },
    { label: "Contrat", value: "contrat" },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    try {
      const response = await api.get(
        `/facture/export/csv?columns=${selectedColumns.join(",")}`,
        {
          responseType: "blob",
        }
      );
      console.log(response);

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      const text = await response.data.text();
      console.log("CSV Content:", text);
      const blob = new Blob([text], { type: "text/csv;charset=utf-8" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "FacturesEncours.csv";

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notification.error({
        message: "There was a problem with the fetch operation:",
        description: error.message,
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedColumns([]);
  };

  const onChange = (checkedValues) => {
    setSelectedColumns(checkedValues);
  };

  const columns = [
    {
      title: "Date d'échéance",
      dataIndex: "echeance",
      //...getColumnSearchProps('date'),
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
      render: (text, record) => (
        <Button
          style={{
            cursor: "pointer",
            fontWeight: 600,
            color:'#6666FF',
            //textDecoration: "underline",
          }}
          type="link"
          onClick={() => ToHistorique(record.client_id)}
        >
          {text}
        </Button>
      ),
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
      sorter: (a, b) => a.montant - b.montant,
      render: (_, record) => `${record.montant} ${record.devise}`,
    },
    {
      title: "Statut",
      dataIndex: "statut",
      filters: [
        { text: "Échue", value: "Échue" },
        { text: "Non échue", value: "Non échue" },
      ],
      onFilter: (value, record) => record.statut === value,
      render: (statut) => {
        const getColor = (statut) => {
          switch (statut) {
            case "Échue":
              return "red";
            case "Non échue":
              return "orange";
            default:
              return "green";
          }
        };

        const color = getColor(statut);

        return <Tag color={color}>{statut}</Tag>;
      },
    },
    {
      title: "Action(s)",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <UpdateFactureForm record={record} handleState={handleFactures} />
          <Tooltip title="Visualiser">
            <Button
              icon={<EyeTwoTone />}
              size="small"
              onClick={() => Report(record.key)}
            ></Button>
          </Tooltip>
          <DetailsFactureForm record={record} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>
      <span> <FileTextOutlined/> </span>

        Liste des factures en cours</Typography.Title>
      <Space className="mb-4">
        <AddFactureForm handleState={handleAddFactureState} />
        <Button onClick={ToListArchive} icon={<FolderOpenOutlined />}>
          Factures payées
        </Button>
      </Space>
      <Table
        scroll={{
          x: "max-content"
        }}
        loading={loading}

        columns={columns}
        dataSource={data}
        pagination={{
              total: data.length, 
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} éléments`,
              pageSize: 10,
            }}
        
        size="small"
        showSorterTooltip={{ target: "sorter-icon" }}
        footer={null}
      />
      <Row justify="end">
        <Col>
          <>
            <Button type="primary" onClick={showModal}>
              Exporter
            </Button>
            <Modal
              title="Selectionner les colonnes à exporter"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <Checkbox.Group options={columns1} onChange={onChange} />
            </Modal>
          </>
        </Col>
      </Row>
    </div>
  );
};

export default ActifFactures;
