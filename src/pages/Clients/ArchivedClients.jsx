import { useState,useRef, useEffect } from "react";
import { SearchOutlined,TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Typography,Row,Col, notification, Modal, Checkbox } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import UpdateClientForm from "../../components/Modals/Clients/UpdateClientForm";
import  DetailsClientForm  from "../../components/Modals/Clients/DetailsClientForm";
import api from "../../utils/axios";
import moment from "moment";

const ArchivedClients = () => {

  let usernames;


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const getColumnSearchProps = (dataIndex) => ({
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
  });

  const fetchData = () => {
    api
      .get("/user/getAllArchived")
      .then((response) => {
        setData(
          response.data.map((client) => ({
            key: client.id,
            username: client.username,
            email: client.email,
            emailcc :client.emailcc,
            phone: client.phone,
            adresse: client.adresse,
            identifiantFiscal : client.identifiantFiscal,
            actif : client.actif,
            dateCreation: moment(client.dateCreation).format('YYYY-MM-DD'),
            delaiRelance : client.delaiRelance,
            maxRelance : client.maxRelance
          }))
        );

        setLoading(false);

         usernames = response.data.map((client) => client.username);


      })
      .catch((error) => {
        notification.error("Une erreur lors de la récupération des clients!", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


  const ToListClients = () => {
    navigate("/clients");
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
    { label: 'Délai de relance', value: 'delaiRelance' },
    { label: 'Max de relance', value: 'maxRelance' },
  ];
               
    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleOk = async () => {
      setIsModalVisible(false);
      try {
        const response = await api.get(
          `/user/export/csv/nonactif?columns=${selectedColumns.join(',')}`,
          {
            responseType: 'blob'

          }
        );
        
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
      }
  
        const blob = new Blob([response.data], { type: 'text/csv' });
  
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

  const handleClients = (record) => {
    const tempClient = data.map((client) => {
      if (client.key === record.key) {
        return record;
      } else {
        return client;
      }
    });

    setData(tempClient);
    fetchData();
  };


  const columns = [
    {
      title: "Date de creation",
      dataIndex: "dateCreation",
      render: (text) => moment(text).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.dateCreation).unix()- moment(b.dateCreation).unix(),
  
    },
    {
      title: "Client",
      dataIndex: "username",
      ...getColumnSearchProps('username'),
    },

 
    {
      title: "Action(s)",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <UpdateClientForm record={record} handleState={handleClients} />
          <DetailsClientForm record={record} />
        
        </Space>
      ),
    },
  ];

  return (
    <div>
      
        <Typography.Title level={4}>
        <span> <TeamOutlined/> </span>

          Liste des clients inactifs </Typography.Title>
    
      <Space className="mb-4">
        <Button  onClick={ToListClients} icon={<UserOutlined />}>
           Clients actifs
        </Button>

      </Space>
      <Table
      size="small"
      loading={loading}

        columns={columns}
        dataSource={data}
        pagination={{
              total: data.length, 
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} éléments`,
              pageSize: 10,
            }}
        
        showSorterTooltip={{ target: "sorter-icon" }}
        scroll={{
          x: "max-content"
        }}
      />

<Row justify="end" >
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

export default ArchivedClients;

