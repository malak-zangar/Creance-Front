import { useState, useRef, useEffect } from "react";
import { Button, Input, Space, Table, Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  RetweetOutlined,
  SearchOutlined,
  MoneyCollectOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const ArchivedEncaissements = () => {
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

  const handleRestaure = (key) => {
    console.log("restaure record with key: ", key);
    axios
      .put(`http://localhost:5555/encaissement/activerEncaissement/${key}`)
      .then((response) => {
        console.log("Encaissement restaured successfully:", response.data);
        fetchData();

      })
      .catch((error) => {
        console.error("There was an error restauring the encaisement!", error);
      });
  };

  const Report = (key) => {
    console.log("Generating report with key: ", key);
    axios
      .get(`http://localhost:5555/encaissement/recu/${key}`, {
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

        fetchData();
      })
      .catch((error) => {
        console.error("There was an error generating the report!", error);
      });
  };

  const fetchData = () => {
    axios
      .get("http://localhost:5555/encaissement/getAllArchived")
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
        console.error("There was an error fetching the encaissements!", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ToListActif = () => {
    console.log("Button ToListActif clicked");
    navigate("/encaissements/actif");
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
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <Space>
            <Button
              icon={<RetweetOutlined />}
              size="small"
              onClick={() => handleRestaure(record.key)}
            >
              activer
            </Button>
            <Button
              icon={<ExportOutlined />}
              size="small"
              onClick={() => Report(record.key)}
            >
              Rapport{" "}
            </Button>
          </Space>{" "}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>
        Liste de tous les encaissements archivés
      </Typography.Title>
      <Space className="mb-4">
        <Button
          icon={<MoneyCollectOutlined />}
          onClick={ToListActif}
          size="small"
        >
          Encaissements actifs
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

export default ArchivedEncaissements;
