import { useState,useRef, useEffect } from "react";
import { SearchOutlined, UserOutlined ,ExportOutlined} from '@ant-design/icons';
import { Button, Input, Space, Table, Typography,Select,Row,Col, notification } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import UpdateClientForm from "../../components/Modals/Clients/UpdateClientForm";
import  DetailsClientForm  from "../../components/Modals/Clients/DetailsClientForm";
import api from "../../utils/axios";

const ArchivedClients = () => {

  let usernames;


  const [data, setData] = useState([]);
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
          placeholder={`Search ${dataIndex}`}
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
            actif : client.actif

          }))
        );


         usernames = response.data.map((client) => client.username);
         console.log(usernames)


      })
      .catch((error) => {
        notification.error("There was an error fetching the clients!", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


  const ToListClients = () => {
    console.log("Button ToListClients clicked");
    navigate("/clients");
  };

  const Export = async () => {
    console.log("Button Export clicked");
    try {
      const response = await fetch(
        "/user/export/csv/nonactif",
        {
          method: "GET",
          headers: {
            "Content-Type": "text/csv",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "nonactifusers.csv";

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notification.error("There was a problem with the fetch operation:", error);
    }
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


  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      ...getColumnSearchProps('key'),
    },
    {
      title: "Client",
      dataIndex: "username",
      ...getColumnSearchProps('username'),
    },
    {
      title: "Email destinataire",
      dataIndex: "email",
      ...getColumnSearchProps('email'),
    },

    {
      title: "Actif",
      dataIndex: "actif",
      render: (actif) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '13px',
              height: '13px',
              borderRadius:'100%',
              backgroundColor: actif ? 'green' : 'red',
              marginLeft: '8px',
            }}
          ></div>
        </div>
      ),
    },
 
    {
      title: "Action",
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
      
        <Typography.Title level={2}>Tous les clients non actifs </Typography.Title>
    
      <Space className="mb-4">
        <Button  onClick={ToListClients} icon={<UserOutlined />}>
          Tous les clients
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

<Row justify="end" >
      <Col>
        <Button icon={<ExportOutlined />} onClick={Export}>
          Exporter
        </Button>
      </Col>
    </Row>

    </div>
  );
};

export default ArchivedClients;

