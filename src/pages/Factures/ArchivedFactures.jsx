import { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,
  FileDoneOutlined,FileTextOutlined,
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
} from "antd";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import DetailsFactureForm from "../../components/Modals/Factures/DetailsFactureForm";
import moment from "moment";
import api from "../../utils/axios";

const ArchivedFactures = () => {
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

  const fetchData = () => {
    api
      .get("/facture/getAllPaid")
      .then(async (response) => {
        setData(
          response.data.map((facture) => ({
            key: facture.id,
            numero: facture.numero,
            date: moment(facture.date).format("YYYY-MM-DD"),
            delai: facture.delai,
            montant: facture.montant,
            montantEncaisse: facture.montantEncaisse,
            actionRecouvrement: facture.actionRecouvrement,
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
              : null, // Format date
          }))
        );
        setLoading(false);

      })
      .catch((error) => {
        notification.error("There was an error fetching the factures!", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ToListActif = () => {
    console.log("Button toListActif clicked");
    navigate("/factures/actif");
  };

  const Report = (key) => {
    console.log("Generating facture with key: ", key);
    api
      .get(`/facture/report/${key}`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        window.open(url);
        /* const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `facture_${reference}.pdf`); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        fetchData();
        notification.success({ message: "Rapport du contrat généré avec succès" });*/
      })
      .catch((error) => {
        notification.error(
          "Une erreur lors de la génération de la facture!",
          error
        );
      });
  };

  const columns = [
    {
      title: "Numéro",
      dataIndex: "numero",
      ...getColumnSearchProps("numero"),
    },
    {
      title: "Date d'émission",
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
      title: "Montant total (TTC)",
      dataIndex: "montant",
      ...getColumnSearchProps("montant"),
      sorter: (a, b) => a.montant - b.montant,
      render: (_, record) => `${record.montant} ${record.devise}`,
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
          <DetailsFactureForm record={record} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>
      <span> <FileTextOutlined/> </span>

        Liste des factures payées</Typography.Title>

      <Space className="mb-4">
        <Button onClick={ToListActif} icon={<FileTextOutlined />}>
          Factures en cours
        </Button>
      </Space>
      <Table
           scroll={{
            x: "max-content"
          }}
          loading={loading}

        size="small"
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
        }}
       
      />
    </div>
  );
};

export default ArchivedFactures;
