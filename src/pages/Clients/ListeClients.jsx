import { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,
  FolderOpenOutlined,
  HistoryOutlined,FileTextOutlined,FileTextTwoTone,TeamOutlined
} from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Typography,
  Row,
  Col,
  notification,
  Tooltip,
  Modal,
  Checkbox,
} from "antd";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import UpdateClientForm from "../../components/Modals/Clients/UpdateClientForm";
import { AddClientForm } from "../../components/Modals/Clients/AddClientForm";
import DetailsClientForm from "../../components/Modals/Clients/DetailsClientForm";
import api from "../../utils/axios";
import moment from "moment";
//import { ColorFactory } from "antd/es/color-picker/color";

const ListeClients = () => {
  const [data, setData] = useState([]);
  const [isContractModalVisible, setIsContractModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [loading, setLoading] = useState(true);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex, isNestedArray = false) => ({
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
    onFilter: (value, record) => {
      if (isNestedArray) {
        return record[dataIndex].some((item) =>
          item.reference.toLowerCase().includes(value.toLowerCase())
        );
      }
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    /* render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),*/
    render: (text, record) => {
      if (isNestedArray) {
        return text.map((contract) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              key={contract.id}
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={
                contract.reference ? contract.reference.toString() : ""
              }
            />
          ) : (
            <span
              key={contract.id}
              onClick={() => handleContractClick(contract)}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {contract.reference}
            </span>
          )
        );
      }
      return searchedColumn === dataIndex ? (
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
      );
    },
  });

  const handleContractClick = (contract) => {
    setSelectedContract(contract);
    setIsContractModalVisible(true);
  };

  const fetchContracts = async (clientId) => {
    try {
      const response = await api.get(`/contrat/getActualByClient/${clientId}`);
      return response.data.contracts?.map((contrat) => contrat) || [];
    } catch (error) {
      return [];
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/user/getAllActif");
      const clients = response.data;

      const updatedClients = await Promise.all(
        clients.map(async (client) => {
          const activeContracts = await fetchContracts(client.id);
          const defaultContract = activeContracts[0] || null;
          if (defaultContract) {
            handleContractClick(defaultContract); 
          }
          return {
            key: client.id,
            username: client.username,
            email: client.email,
            emailcc: client.emailcc,
            phone: client.phone,
            adresse: client.adresse,
            identifiantFiscal: client.identifiantFiscal,
            actif: client.actif,
            dateCreation: moment(client.dateCreation).format("YYYY-MM-DD"),
            activeContracts: activeContracts,
            contrats: client.contrats,
          };
        })
      );

      setData(updatedClients);
      setLoading(false);

    } catch (error) {
      notification.error({
        message: "Une erreur lors de la récupération des clients!",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ToListArchive = () => {
    navigate("/clients/archive");
  };
  const ToHistoriqueContrat = (clientId) => {
    navigate(`/clients/historique/contrat/${clientId}`);
  };
  const ToHistoriqueFact = (clientId) => {
    navigate(`/clients/historique/facture/${clientId}`);
  };
  const handleAddClientState = (record) => {
    setData([record, ...data]);
  };

  const handleClients = (record) => {
    const tempClient = data.map((client) => {
      if (client.key === record.key) {
        return record;
      } else {
        return client;
      }
    });
    setData(tempClient);

  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const columns1 = [
    { label: 'Nom dutilisateur', value: 'username' },
    { label: 'Email', value: 'email' },
    { label: 'Email cc', value: 'emailcc' },
    { label: 'Téléphone', value: 'phone' },
    { label: 'Adresse', value: 'adresse' },
    { label: 'Identifiant Fiscal', value: 'identifiantFiscal' },
    { label: 'Date de creation', value: 'dateCreation' },
    { label: 'Actif', value: 'actif' },
    { label: 'Contrats', value: 'contrats' },

  ];
               
    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleOk = async () => {
      setIsModalVisible(false);
      try {
        const response = await api.get(
          `/user/export/csv/actifusers?columns=${selectedColumns.join(',')}`,
          {
            responseType: 'blob'

          }
        );
        console.log(response)
        
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
      }
  
        const blob = new Blob([response.data], { type: 'text/csv' });
      console.log('Blob:', blob);
  
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'actifusers.csv';
  
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
     
      } catch (error) {
        notification.error({
          message: 'There was a problem with the fetch operation:',
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
      title: "Client",
      dataIndex: "username",
      ...getColumnSearchProps("username"),
    },
    {
      title: "Date de création",
      dataIndex: "dateCreation",
      render: (text) => moment(text).format("DD/MM/YYYY"),
      sorter: (a, b) => moment(a.dateCreation)-(moment(b.dateCreation)),
    },

    {
      title: "Action(s)",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <UpdateClientForm record={record} handleState={handleClients} />

          <Tooltip title="Historique Contrats">
            <Button 
              icon={<HistoryOutlined /> }
              size="small"
              onClick={() => ToHistoriqueContrat(record.key)}
            ></Button>
          </Tooltip>
          <Tooltip title="Historique Factures">
            <Button
              icon={<FileTextTwoTone />}
              size="small"
              onClick={() => ToHistoriqueFact(record.key)}
            ></Button>
          </Tooltip>
          <DetailsClientForm record={record} />

        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>
      <span> <TeamOutlined/> </span>

        Liste des clients actifs</Typography.Title>
      <Space className="mb-4">
        <AddClientForm handleState={handleAddClientState} />
        <Button onClick={ToListArchive} icon={<FolderOpenOutlined />}>
          Clients inactifs
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
        pagination={{ pageSize: 10 }}
        showSorterTooltip={{ target: "sorter-icon" }}

      />
      <Row justify="end">
        <Col>
        <>
      <Button type="primary" onClick={showModal}>
        Exporter
      </Button>
      <Modal title="Selectionner les colonnes à exporter" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Checkbox.Group options={columns1} onChange={onChange} />
      </Modal>
    </>
        </Col>
      </Row>
    </div>
  );
};

export default ListeClients;
