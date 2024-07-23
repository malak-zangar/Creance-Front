import { useState,useRef, useEffect } from "react";
import { SearchOutlined, FileTextOutlined,FolderOpenOutlined  } from '@ant-design/icons';
import { Button, Input, notification, Space, Table, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import UpdateContratForm from "../../components/Modals/Contrats/UpdateContratForm";
import DetailsContratForm from "../../components/Modals/Contrats/DetailsContratForm";
import { AddContratForm } from "../../components/Modals/Contrats/AddContratForm";
import moment from "moment";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const ActifContracts = () => {

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const navigate = useNavigate();


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
      .get("contrat/getActif")
      .then((response) => {
        setData(
          response.data.map((contrat) => ({
            key: contrat.id,
            reference: contrat.reference,
            dateDebut: moment(contrat.dateDebut).format('YYYY-MM-DD'),
            dateFin: moment(contrat.dateFin).format('YYYY-MM-DD'),
            delai: contrat.delai,
            type: contrat.type,
            total: contrat.total,
            prixJourHomme: contrat.prixJourHomme,
            typeFrequenceFacturation: contrat.typeFrequenceFacturation,
            detailsFrequence: contrat.detailsFrequence,
            montantParMois: contrat.montantParMois,
            devise: contrat.devise,
            client_id: contrat.client_id,
            client: contrat.client,
            contratFile : contrat.contratFile

          }))
        );
      })
      .catch((error) => {
        notification.error("Une erreur lors de la recherche des contrats!", error);
      });
  };
  

  useEffect(() => {
    fetchData();
  }, []);


  const handleContracts = (record) => {
    fetchData();
  };

  const handleAddContractState = (record) => {
    setData([ record, ...data,]);
  };

  const ToListArchive = () => {
    console.log("Button ToListArchive clicked");
    navigate("/contrats/archive");
  };

  const Report = (key,reference) => {
    console.log("Generating contract with key: ", key," and reference : ", reference);
    api
      .get(`/contrat/contratFile/${key}/${reference}`, {responseType: 'blob', })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        window.open(url); 
       /* const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `contrat_${reference}.pdf`); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        fetchData();
        notification.success({ message: "Rapport du contrat généré avec succès" });*/

      })
      .catch((error) => {
        notification.error("Une erreur lors de la génération du contrat!", error);
      });
  };

  const columns = [

    {
      title: "Référence",
      dataIndex: "reference",
      ...getColumnSearchProps('reference'),
    },
    {
      title: "Date début",
      dataIndex: "dateDebut",
      render: (text) => moment(text).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.dateDebut).format('DD/MM/YYYY') - moment(b.dateDebut).format('DD/MM/YYYY'),
    },
    {
      title: "Date fin",
      dataIndex: "dateFin",
      render: (text) => moment(text).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.dateFin).format('DD/MM/YYYY') - moment(b.dateFin).format('DD/MM/YYYY'),
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
          <DetailsContratForm record={record} />
          <Button  disabled={!record.contratFile} icon={<FileTextOutlined  />} size="small" onClick={() => Report(record.key,record.reference)}>Visualiser le contrat</Button>
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      
        <Typography.Title level={2}>Tous les Contrats</Typography.Title>
    
      <Space className="mb-4">
        <AddContratForm handleState={handleAddContractState}  />
        <Button  onClick={ToListArchive} icon={<FolderOpenOutlined />}>
          Les contrats archivés
        </Button>
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

export default ActifContracts;