import { useState,useRef, useEffect } from "react";
import { SearchOutlined, ControlOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Typography, notification } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import UpdateParamForm from "../../components/Modals/Params/UpdateParamForm";
import api from "../../utils/axios";
import moment from "moment";

const EntrepParamHistorique = () => {


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
      .get("/paramentreprise/getAll")
      .then((response) => {
        setData(
          response.data.map((param) => ({
            key: param.id,
            raisonSociale: param.raisonSociale,
            email: param.email,
            dateInsertion: moment(param.dateInsertion).format("YYYY-MM-DD"),
            phone: param.phone,
            adresse: param.adresse,
            identifiantFiscal : param.identifiantFiscal,

          }))
        );

      }
    
    )
      .catch((error) => {
        notification.error("Erreur lors de la récupération des paramètres!", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleParams = () => {
    fetchData();
  };


  const ToLatestParam = () => {
    console.log("Button toLatestParam clicked");
    navigate("/parametres/actuels");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      ...getColumnSearchProps('key'),
    },
    {
      title: "Date insertion",
      dataIndex: "dateInsertion",
      render: (text) => moment(text).format("DD/MM/YYYY"),
      sorter: (a, b) => moment(a.dateInsertion).unix() - moment(b.dateInsertion).unix(),
    },
    {
      title: "Raison sociale",
      dataIndex: "raisonSociale",
      ...getColumnSearchProps('raisonSociale'),
    },
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps('email'),
    },
    {
      title: "Téléphone",
      dataIndex: "phone",
    },
    {
      title: "Adresse",
      dataIndex: "adresse",
    },
    {
      title: "ID fiscal",
      dataIndex: "identifiantFiscal",
    },

 
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <UpdateParamForm record={record} handleState={handleParams} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      
        <Typography.Title level={2}>Historique des paramètres </Typography.Title>
    
      <Space className="mb-4">
        <Button  onClick={ToLatestParam} icon={<ControlOutlined />}>
          Paramètres actuels
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

export default EntrepParamHistorique;
