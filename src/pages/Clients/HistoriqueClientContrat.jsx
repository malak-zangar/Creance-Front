import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Space, Table, Typography, notification } from 'antd';
import api from '../../utils/axios';
import moment from 'moment';
import { FolderOpenOutlined,SearchOutlined, UserOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const HistoriqueClientContrat = () => {
  const { clientId } = useParams();
  const [username, setUsername] = useState('');
  const [historicData, setHistoricData] = useState([]);
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
    
  });

  const fetchContracts = async (clientId) => {
    try {
      const response = await api.get(`/contrat/getByClient/${clientId}`);
      return response.data.contracts?.map((contrat) => contrat) || [];
    } catch (error) {
      notification.error({ message: "Erreur lors de la récupération des contrats!", description: error.message });
      return [];
    }
  };

  useEffect(() => {
    const fetchHistoricData = async () => {
      try {
        const response = await api.get(`/user/getByID/${clientId}`);
        const client = response.data.client;
        setUsername(client.username);
        const activeContracts = await fetchContracts(client.id);

        const historicEntries = activeContracts.map(contract => ({
          reference: contract.reference,
          dateDebut: contract.dateDebut,
          dateFin: contract.dateFin,
          delai: contract.delai,
        }));

        setHistoricData(historicEntries);
      } catch (error) {
        notification.error({ message: "Erreur lors de la récupération du client!", description: error.message });
      }
    };

    fetchHistoricData();
  }, [clientId]);

  const ToListArchive = () => {
    navigate("/clients/archive");
  };

  const ToListClients = () => {
    navigate("/clients");
  };

  const columns = [
    {
      title: 'Référence du Contrat',
      dataIndex: 'reference',
      ...getColumnSearchProps('reference'),

    },
    {
      title: 'Date de Début',
      dataIndex: 'dateDebut',
      render: (text) => moment(text).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.dateDebut).unix()-moment(b.dateDebut).unix(),

    },
    {
      title: 'Date de Fin',
      dataIndex: 'dateFin',
      render: (text) => moment(text).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.dateFin).diff(moment(b.dateFin)),

    },
    {
      title: 'Durée (jours)',
      dataIndex: 'delai',
      sorter: (a, b) => moment(a.delai).diff(moment(b.delai)),

    },
  ];

  const totalDuration = historicData.reduce((total, item) => total + item.delai, 0);

  return (
    <div>
      <Typography.Title level={2}>Historique d'activité du client : {username}</Typography.Title>
      <Space className="mb-4">
        <Button onClick={ToListClients} icon={<UserOutlined />}>
          Clients actifs
        </Button>
        <Button onClick={ToListArchive} icon={<FolderOpenOutlined />}>
          Clients inactifs
        </Button>
      </Space>
      <Table 
        size="small"
        dataSource={historicData} 
        columns={columns} 
        pagination={{ pageSize: 10 }} 
        footer={() => <div style={{ textAlign: 'right' }}>Durée totale d'activité: {totalDuration} jours</div>}
      />
    </div>
  );
};

export default HistoriqueClientContrat;
