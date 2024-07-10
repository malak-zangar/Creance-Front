import { useState,useRef, useEffect } from "react";
import { SearchOutlined, FolderOpenOutlined ,ExportOutlined,CheckOutlined} from '@ant-design/icons';
import { Button, Input, Space, Table, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UpdateFactureForm from "../../components/Modals/UpdateFactureForm";
import { AddFactureForm } from "../../components/Modals/AddFactureForm";

const ActifFactures = () => {

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

  const handleDelete = (key) => {
    console.log("deleted record with key: ", key);
    axios
      .put(`http://localhost:5551/facture/archiveFacture/${key}`)
      .then((response) => {
        console.log("Facture archived successfully:", response.data);
        fetchData();
      })
      .catch((error) => {
        console.error("There was an error archiving the Facture!", error);
      });
  };

  const fetchData = () => {
    axios
      .get("http://localhost:5551/facture/getAllActif")
      .then((response) => {
        setData(
          response.data.map((facture) => ({
            key: facture.id,
            numero: facture.numero,
            date: new Date(facture.date).toLocaleDateString('fr-FR'),
            delai: facture.delai,
            montant: facture.montant,
            montantEncaisse:facture.montantEncaisse,
            actionRecouvrement:facture.actionRecouvrement,
            actif: facture.actif,
            client_id:facture.client_id,
            client : facture.client,
            solde:facture.solde,
            echeance:new Date (facture.echeance).toLocaleDateString('fr-FR'),
            retard: facture.retard,
            statut:facture.statut,
            dateFinalisation: facture.dateFinalisation ? new Date(facture.dateFinalisation).toLocaleDateString('fr-FR') : null // Format date
                      }))
        );

      })
      .catch((error) => {
        console.error("There was an error fetching the factures!", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


  const ToListArchive = () => {
    console.log("Button ToListArchive clicked");
    navigate("/factures/archive");
  };



  const handleFactures = (record) => {
    const tempFacture = data.map((facture) => {
      if (facture.key === record.key) {
        return record;
      } else {
        return facture;
      }
    });

    setData(tempFacture);
    fetchData();
  };

  const handleAddFactureState = (record) => {
    setData([ record, ...data,]);
  };

  const Report = (key) => {
    console.log("Generating report with key: ", key);
    axios
      .get(`http://localhost:5551/facture/report/${key}`, {
        responseType: 'blob', 
      })
      .then((response) => {
        console.log("Report generated successfully:", response.data);
  
        
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report_${key}.pdf`); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        fetchData();
      })
      .catch((error) => {
        console.error("There was an error generating the report!", error);
      });
  };

  const Payer=(key)=>{
    axios
    .put(`http://localhost:5551/facture/marquerpayeFacture/${key}`, {
      responseType: 'blob', 
    })
    .then((response) => {
      
      fetchData();
    })
    .catch((error) => {
      console.error("There was an error !", error);
    });
  }

  const columns = [
    {
      title: "Numéro",
      dataIndex: "numero",
      ...getColumnSearchProps('numero'),

    },
    {
      title: "Date",
      dataIndex: "date",
      //...getColumnSearchProps('date'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),

    },
    {
      title: "Client",
      dataIndex: "client",
      ...getColumnSearchProps('client'),

      
    },
    {
        title: "Montant",
        dataIndex: "montant",
        ...getColumnSearchProps('montant'),
        sorter: (a, b) => a.montant - b.montant,
  
      },
      {
        title: "Délai",
        dataIndex: "delai",
        ...getColumnSearchProps('delai'),
        sorter: (a, b) => a.delai - b.delai,

      },
      {
        title: "Montant encaisse",
        dataIndex: "montantEncaisse",
        ...getColumnSearchProps('montantEncaisse'),
        sorter: (a, b) => a.montantEncaisse - b.montantEncaisse,

      },
      {
        title: "Solde",
        dataIndex: "solde",
        ...getColumnSearchProps('solde'),
        sorter: (a, b) => a.solde - b.solde,

      },
      {
        title: "Echéance ",
        dataIndex: "echeance",
        //...getColumnSearchProps('echeance'),
        sorter: (a, b) => new Date(a.echeance) - new Date(b.echeance),
  
      },
      {
        title: "Retard ",
        dataIndex: "retard",
        ...getColumnSearchProps('retard'),
        sorter: (a, b) => a.retard - b.retard,

      },
      {
        title: "Statut ",
        dataIndex: "statut",
        ...getColumnSearchProps('statut'),
  
      },
      {
        title: "Action Recouvrement ",
        dataIndex: "actionRecouvrement",
        ...getColumnSearchProps('actionRecouvrement'),
  
      },
      {
        title: "Date Finalisation ",
        dataIndex: "dateFinalisation",
        //...getColumnSearchProps('dateFinalisation'),
        sorter: (a, b) => new Date(a.dateFinalisation) - new Date(b.dateFinalisation),

      },
      {
        title: "Action",
        dataIndex: "action",
        render: (_, record) => (
          <Space direction="vertical">
            <UpdateFactureForm record={record} handleState={handleFactures} />
            <Button icon={<ExportOutlined />} size="small" onClick={()=>Report(record.key)}>Rapport </Button>
            <Button icon={<FolderOpenOutlined />} size="small" onClick={() => handleDelete(record.key)}>Archiver</Button>
            <Button icon={<CheckOutlined />} size="small" onClick={()=>Payer(record.key)}> Payée </Button>

          </Space>
        ),
      },
  ];
  return (
    <div>
      
        <Typography.Title level={2}>Liste de toutes les factures actives</Typography.Title>
    
      <Space className="mb-4">
        <AddFactureForm handleState={handleAddFactureState}  />
        <Button  onClick={ToListArchive} icon={<FolderOpenOutlined />}>
          Archive
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

export default ActifFactures;