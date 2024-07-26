import { useState, useEffect, useRef } from "react";
import { Table, Button, Typography, Space, Input, notification } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { AddEncaissementForm } from "../../components/Modals/Encaissements/AddEncaissementForm";
import UpdateEncaissementForm from "../../components/Modals/Encaissements/UpdateEncaissementForm";
import DetailsEncaissementForm from "../../components/Modals/Encaissements/DetailsEncaissementForm";
import moment from "moment";
import api from "../../utils/axios";

const ListeEncaissements = () => {
  const [data, setData] = useState([]);

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

  useEffect(() => {
    fetchData();
  }, []);

  const Report = (key) => {
    console.log("Generating report with key: ", key);
    api
      .get(`/encaissement/recu/${key}`, {
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
        notification.success({ message: "Rapport paiement généré avec succès" });

      })
      .catch((error) => {
        notification.error("There was an error generating the report!", error);
      });
  };

  const handleAddEncaissementState = (record) => {
    setData([record, ...data]);
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
    fetchData();
  };

  const fetchData = () => {
    api
      .get("/encaissement/getAll")
      .then((response) => {
        setData(
          response.data.map((encaissement) => ({
            key: encaissement.id,
            reference: encaissement.reference,
            date: moment(encaissement.date).format("YYYY-MM-DD"),
            modeReglement: encaissement.modeReglement,
            montantEncaisse: encaissement.montantEncaisse,
            actif: encaissement.actif,
            facture_id: encaissement.facture_id,
            facture: encaissement.facture,
            client: encaissement.client,
            contrat: encaissement.contrat,
          }))
        );
      })
      .catch((error) => {
        notification.error("There was an error fetching the paiement!", error);
      });
  };

  const columns = [
 
    {
      title: "Référence",
      dataIndex: "reference",
      ...getColumnSearchProps("reference"),
    },
    {
      title: "Date",
      dataIndex: "date",
      //...getColumnSearchProps("date"),
      render: (text) => moment(text).format("DD/MM/YYYY"),

      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
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
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <UpdateEncaissementForm
            record={record}
            handleState={handleEncaissements}
          />
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => Report(record.key)}
          >
            
          </Button>
          <DetailsEncaissementForm record={record} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Tous les paiements</Typography.Title>

      <Space className="mb-4">
        <AddEncaissementForm handleState={handleAddEncaissementState} />
      </Space>
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 6,
        }}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </div>
  );
};

export default ListeEncaissements;
