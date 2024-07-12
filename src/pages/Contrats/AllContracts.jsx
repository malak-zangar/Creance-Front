import { useState,useRef, useEffect } from "react";
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UpdateContratForm from "../../components/Modals/Contrats/UpdateContratForm";
import DetailsContratForm from "../../components/Modals/Contrats/DetailsContratForm";
import { AddContratForm } from "../../components/Modals/Contrats/AddContratForm";
import moment from "moment";

const AllContracts = () => {

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
    axios
      .get("http://localhost:5555/contrat/getAll")
      .then((response) => {
        setData(
          response.data.map((contrat) => ({
            key: contrat.id,
            reference: contrat.reference,
            dateDebut: moment(contrat.dateDebut).format('YYYY-MM-DD'),
            dateFin: moment(contrat.dateFin).format('YYYY-MM-DD'),
            delai: contrat.delai,
            conditionsFinancieres: contrat.conditionsFinancieres,
            prochaineAction: contrat.prochaineAction,
            client_id: contrat.client_id,
            client: contrat.client,
            dateProchaineAction: moment(contrat.dateProchaineAction).format('YYYY-MM-DD'),
            dateRappel: moment(contrat.dateRappel).format('YYYY-MM-DD'),
          }))
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the contracts!", error);
      });
  };
  

  useEffect(() => {
    fetchData();
  }, []);


  const handleContracts = (record) => {
   /* const tempContrat = data.map((contrat) => {
      if (contrat.key === record.key) {
        return record;
      } else {
        return contrat;
      }
    });

    setData(tempContrat);*/
    fetchData();
  };

  const handleAddContractState = (record) => {
    setData([ record, ...data,]);
  };

  const Report = (key) => {
    console.log("Generating contract with key: ", key);
    axios
      .get(`http://localhost:5555/contrat/report/${key}`, {
        responseType: 'blob', 
      })
      .then((response) => {
        console.log("Contract generated successfully:", response.data);
  
        
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `contrat_${key}.pdf`); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        fetchData();
      })
      .catch((error) => {
        console.error("There was an error generating the contract!", error);
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      ...getColumnSearchProps('key'),
    },
    {
      title: "Référence",
      dataIndex: "reference",
      ...getColumnSearchProps('reference'),
    },
    {
      title: "Date début",
      dataIndex: "dateDebut",
      render: (text) => moment(text).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.dateDebut) - new Date(b.dateDebut),
    },
    {
      title: "Client",
      dataIndex: "client",
      ...getColumnSearchProps('client'),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <UpdateContratForm record={record} handleState={handleContracts} />
          <Button icon={<DownloadOutlined />} size="small" onClick={() => Report(record.key)}>Télécharger</Button>
          <DetailsContratForm record={record} />
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      
        <Typography.Title level={2}>Tous les Contrats</Typography.Title>
    
      <Space className="mb-4">
        <AddContratForm handleState={handleAddContractState}  />
      </Space>
      <Table
      size="small"
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 6,
        }}
        showSorterTooltip={{ target: 'sorter-icon' }}
      />

      

    </div>
  );
};

export default AllContracts;