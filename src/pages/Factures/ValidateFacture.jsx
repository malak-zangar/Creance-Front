import { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,
  DownloadOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { Button, Input, notification, Space, Table, Typography } from "antd";
import Highlighter from "react-highlight-words";
import axios from "axios";
import DetailsFactureForm from "../../components/Modals/Factures/DetailsFactureForm";
import moment from "moment";
import { useParams } from 'react-router-dom';


const ValidateFacture = () => {
  const { param } = useParams();
  const [data, setData] = useState([]);
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
          placeholder={`Search ${dataIndex}`}
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
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
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
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
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
    console.log("activated record with key: ", key);
    axios
      .put(`http://localhost:5555/facture/restaureFacture/${key}`)
      .then((response) => {
        console.log("Facture activated successfully:", response.data);
        notification.success({ message: "Facture activée avec succès" });
        fetchData(response.data.client_id);
      })
      .catch((error) => {
        notification.error("There was an error activating the Facture!", error);
      });
  };

  const fetchData = () => {
    axios
      .get(`http://localhost:5555/facture/getByClient/${param}`)
      .then((response) => {
        if (response.data.length > 0) {
          setClientName(response.data[0].client); // Set the client name
        }
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
              : null, 
          }))
        );
      })
      .catch((error) => {
        notification.error("There was an error fetching the factures!", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Report = (key) => {
    console.log("Generating report with key: ", key);
    axios
      .get(`http://localhost:5555/facture/report/${key}`, {
        responseType: "blob",
      })
      .then((response) => {
        console.log("Report generated successfully:", response.data);

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
        notification.error("There was an error generating the report!", error);
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      ...getColumnSearchProps("key"),
    },
    {
      title: "Numéro",
      dataIndex: "numero",
      ...getColumnSearchProps("numero"),
    },
    {
      title: "Date",
      dataIndex: "date",
      //...getColumnSearchProps('date'),
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
    },

    {
      title: "Action",
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
      <Typography.Title level={2}>
      {`Les factures du client : ${clientName}`}      </Typography.Title> 

      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 6,
        }}
      />
    </div>
  );
};

export default ValidateFacture;
