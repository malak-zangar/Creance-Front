import { useState,useRef, useEffect } from "react";
import { SearchOutlined, FolderOpenOutlined ,FileDoneOutlined} from '@ant-design/icons';
import { Button, Input, Space, Table, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AddFactureForm } from "../../components/Modals/AddFactureForm";


function ListeFactures() {
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:5551/facture/getAll")
      .then((response) => {
        setData(
          response.data.map((facture) => ({
            key: facture.id,
            numero: facture.numero,
            date: facture.date,
            delai: facture.delai,
            montant: facture.montant,
            montantEncaisse:facture.montantEncaisse,
            actionRecouvrement:facture.actionRecouvrement,
            actif: facture.actif,
            client_id:facture.client_id,
            client : facture.client,
            solde:facture.solde,
            echeance:facture.echeance,
            retard: facture.retard,
            statut:facture.statut,
            dateFinalisation:facture.dateFinalisation
          }))
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the factures!", error);
      });
  };

  const columns = [
    {
      title: "Numéro",
      dataIndex: "numero",
      ...getColumnSearchProps('numero'),

    },
    {
      title: "Date",
      dataIndex: "date",
      ...getColumnSearchProps('date'),

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
  
      },
      {
        title: "Délai",
        dataIndex: "delai",
        ...getColumnSearchProps('delai'),
      },
      {
        title: "Montant encaisse",
        dataIndex: "montantEncaisse",
        ...getColumnSearchProps('montantEncaisse'),
  
      },
      {
        title: "Solde",
        dataIndex: "solde",
        ...getColumnSearchProps('solde'),
  
      },
      {
        title: "Echéance ",
        dataIndex: "echeance",
        ...getColumnSearchProps('echeance'),
  
      },
      {
        title: "Retard ",
        dataIndex: "retard",
        ...getColumnSearchProps('retard'),
  
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
        ...getColumnSearchProps('dateFinalisation'),
  
      },
    {
      title: "Actif",
      dataIndex: "actif",
      render: (actif) => (actif ? "Oui" : "Non"),
    },
  ];

  const ToListArchive = () => {
    console.log("Button ToListArchive clicked");
    navigate("/factures/archive");
  };

  const ToListActif = () => {
    console.log("Button ToListActif clicked");
    navigate("/factures/actif");
  };

  return (
    <div>
      <Typography.Title level={2}>Liste de toutes les factures  </Typography.Title>

      <Space className="mb-4">
        <AddFactureForm />
        <Button icon={<FileDoneOutlined />} type="default" onClick={ToListActif}>
          Factures actives
        </Button>
        <Button icon={<FolderOpenOutlined />} onClick={ToListArchive}>
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
      />
    </div>
  );
}

export default ListeFactures