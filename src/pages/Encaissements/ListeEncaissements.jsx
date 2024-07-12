import { useState, useEffect, useRef } from "react";
import { Table, Button, Typography, Space, Input } from "antd";
import axios from "axios";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import {
  MoneyCollectOutlined,
  FolderOpenOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { AddEncaissementForm } from "../../components/Modals/Encaissements/AddEncaissementForm";

const ListeEncaissements = () => {
  const [data, setData] = useState([]);

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:5555/encaissement/getAll")
      .then((response) => {
        setData(
          response.data.map((encaissement) => ({
            key: encaissement.id,
            reference: encaissement.reference,
            date: new Date(encaissement.date).toLocaleDateString('fr-FR'),
            modeReglement: encaissement.modeReglement,
            montantEncaisse: encaissement.montantEncaisse,
            actif: encaissement.actif,
            facture_id: encaissement.facture_id,
            facture: encaissement.facture,
            client: encaissement.client,
          }))
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the Encaissements!", error);
      });
  };

  const columns = [
    {
      title: "Référence",
      dataIndex: "reference",
      ...getColumnSearchProps("reference"),
    },
    {
      title: "Facture",
      dataIndex: "facture",
      ...getColumnSearchProps("facture"),
    },
    {
      title: "Client ",
      dataIndex: "client",
      ...getColumnSearchProps("client"),
    },
    {
      title: "Date",
      dataIndex: "date",
      //...getColumnSearchProps("date"),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),

    },
    {
      title: "Mode règlement",
      dataIndex: "modeReglement",
      ...getColumnSearchProps("modeReglement"),

    },
    {
      title: "Montant encaisse ",
      dataIndex: "montantEncaisse",
      //...getColumnSearchProps("montantEncaisse"),
      sorter: (a, b) => a.montantEncaisse - b.montantEncaisse,

    },

    {
      title: "Actif",
      dataIndex: "actif",
      render: (actif) => (actif ? "Oui" : "Non"),
    },
  ];

  const ToListArchive = () => {
    console.log("Button ToListArchive clicked");
    navigate("/encaissements/archive");
  };

  const ToListActif = () => {
    console.log("Button ToListActif clicked");
    navigate("/encaissements/actif");
  };

  return (
    <div>
      <Typography.Title level={2}>
        Liste de tous les encaissements{" "}
      </Typography.Title>

      <Space className="mb-4">
        <AddEncaissementForm />
        <Button
          icon={<MoneyCollectOutlined />}
          type="default"
          onClick={ToListActif}
        >
          Encaissements actifs
        </Button>
        <Button icon={<FolderOpenOutlined />} onClick={ToListArchive}>
          Archive
        </Button>
      </Space>
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

export default ListeEncaissements;
