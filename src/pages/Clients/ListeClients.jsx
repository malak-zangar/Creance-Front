import { useState, useRef, useEffect } from "react";
import { SearchOutlined, FolderOpenOutlined, ExportOutlined,HistoryOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Typography, Row, Col, notification, List } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import UpdateClientForm from "../../components/Modals/Clients/UpdateClientForm";
import { AddClientForm } from "../../components/Modals/Clients/AddClientForm";
import DetailsClientForm from "../../components/Modals/Clients/DetailsClientForm";
import api from "../../utils/axios";
import moment from "moment";
import DetailsContratForm from "../../components/Modals/Contrats/DetailsContratForm"; // Assurez-vous que ce chemin est correct

const ListeClients = () => {
  const [data, setData] = useState([]);
  const [isContractModalVisible, setIsContractModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  /*const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
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
          color: filtered ? '#1677ff' : undefined,
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
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });*/

  const getColumnSearchProps = (dataIndex, isNestedArray = false) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
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
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (isNestedArray) {
        return record[dataIndex].some((item) =>
          item.reference.toLowerCase().includes(value.toLowerCase())
        );
      }
      return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
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
          return text.map(contract => (
            searchedColumn === dataIndex ? (
              <Highlighter
                key={contract.id}
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={contract.reference ? contract.reference.toString() : ''}
              />
            ) : (
              <span key={contract.id} onClick={() => handleContractClick(contract)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
              {contract.reference}
            </span>            )
          ));
        }
        return searchedColumn === dataIndex ? (
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


  /*const fetchData = async () => {
    try {
      const response = await api.get("/user/getAllActif");
      const clients = response.data;

      const updatedClients = await Promise.all(
        clients.map(async (client) => {
          const activeContracts = await fetchContracts(client.id);
          console.log(activeContracts);
          return {
            key: client.id,
            username: client.username,
            email: client.email,
            emailcc: client.emailcc,
            phone: client.phone,
            adresse: client.adresse,
            identifiantFiscal: client.identifiantFiscal,
            actif: client.actif,
            dateCreation: moment(client.dateCreation).format('YYYY-MM-DD'),
            activeContracts: activeContracts,
            contrats: client.contrats,
          };
        })
      );

      setData(updatedClients);
    } catch (error) {
      notification.error({ message: "Une erreur lors de la récupération des clients!", description: error.message });
    }
  };*/


  const fetchData = async () => {
    try {
      const response = await api.get("/user/getAllActif");
      const clients = response.data;
  
      const updatedClients = await Promise.all(
        clients.map(async (client) => {
          const activeContracts = await fetchContracts(client.id);
          // Sélectionner le premier contrat actif s'il existe
          const defaultContract = activeContracts[0] || null;
          if (defaultContract) {
            handleContractClick(defaultContract); // Afficher les détails du premier contrat
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
            dateCreation: moment(client.dateCreation).format('YYYY-MM-DD'),
            activeContracts: activeContracts,
            contrats: client.contrats,
          };
        })
      );
  
      setData(updatedClients);
    } catch (error) {
      notification.error({ message: "Une erreur lors de la récupération des clients!", description: error.message });
    }
  };

  
  useEffect(() => {
    fetchData();
  }, []);

  const ToListArchive = () => {
    navigate("/clients/archive");
  };
  const ToHistorique = (clientId) => {
    navigate(`/clients/historique/contrat/${clientId}`);
  };

  const Export = async () => {
    console.log("Button Export clicked");
    try {
        const response = await api.get('/user/export/csv/actifusers', {
            responseType: 'blob'
        });

        console.log("Response:", response);

        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }

        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'actifusers.csv';  // Nom du fichier CSV

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleClients = (record) => {
    setData(data.map((client) => (client.key === record.key ? record : client)));
    fetchData();
  };

  const handleAddClientState = (record) => {
    setData([record, ...data]);
  };

  const columns = [
    {
      title: "Client",
      dataIndex: "username",
      ...getColumnSearchProps('username'),
    },
    {
      title: "Date de création",
      dataIndex: "dateCreation",
      render: (text) => moment(text).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.dateCreation).diff(moment(b.dateCreation)),
    },
    {
      title: "Contrats en cours",
      dataIndex: "activeContracts",
      render: (contracts) => (
        contracts.length > 0 ? (
          <List
            size="small"
            grid
            dataSource={contracts}
            renderItem={(contract) => (
              <List.Item
                onClick={() => handleContractClick(contract)}
                style={{ cursor: 'pointer', color: '#0e063b' }}
              >
                <span style={{ textDecoration: 'underline' }}>
                  {contract.reference}
                </span>    {isContractModalVisible && selectedContract && (
        <DetailsContratForm record={selectedContract} />
      )}
              </List.Item>
            )}
          />
        ) : (
          <span>-</span>
        )
      ),
      //...getColumnSearchProps('activeContracts', true),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <UpdateClientForm record={record} handleState={handleClients} />
          <DetailsClientForm record={record} />
          <Button icon={<HistoryOutlined />} size="small" onClick={()=>ToHistorique(record.key)}>
        
      </Button>        </Space>
      ),
    },
  ];
  
  return (
    <div>
      <Typography.Title level={2}>Tous les clients actifs</Typography.Title>
      <Space className="mb-4">
        <AddClientForm handleState={handleAddClientState} />
        <Button onClick={ToListArchive} icon={<FolderOpenOutlined />}>
          Les clients non actifs
        </Button>
      </Space>
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 6 }}
      />
      <Row justify="end">
        <Col>
          <Button icon={<ExportOutlined />} onClick={Export}>
            Exporter
          </Button>
        </Col>
      </Row>
   
    </div>
  );
  
};

export default ListeClients;
