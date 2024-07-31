import { useState,useRef, useEffect } from "react";
import { SearchOutlined, FileDoneOutlined ,EyeOutlined} from '@ant-design/icons';
import { Button, Input, notification, Space, Table, Tooltip, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import DetailsFactureForm from "../../components/Modals/Factures/DetailsFactureForm";
import moment from "moment";
import api from "../../utils/axios";

const ArchivedFactures = () => {

  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({ totalMontant: 0 });

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
      .get("/facture/getAllPaid")
      .then(async (response) => {
        setData(
          response.data.map((facture) => ({
            key: facture.id,
            numero: facture.numero,
            date: moment(facture.date).format('YYYY-MM-DD'),
            delai: facture.delai,
            montant: facture.montant,
            montantEncaisse:facture.montantEncaisse,
            actionRecouvrement:facture.actionRecouvrement,
            actif: facture.actif,
            client_id:facture.client_id,
            client : facture.client,
            contrat : facture.contrat,
            contrat_id : facture.contrat_id,
            solde:facture.solde,
            devise:facture.devise,
            echeance:moment(facture.echeance).format('YYYY-MM-DD'),
            retard: facture.retard,
            statut:facture.statut,
            dateFinalisation: facture.dateFinalisation ? moment(facture.dateFinalisation).format('YYYY-MM-DD') : null // Format date
                      }))
        );
        await updateTotals(response.data);

      })
      .catch((error) => {
        notification.error("There was an error fetching the factures!", error);
      });
  };

  const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
      const response = await api.get(`/paramentreprise/convert`, {
        params: {
          base: fromCurrency,
          target: toCurrency,
          amount: amount,
        },
      });
      return response.data.converted_amount || amount;
    } catch (error) {
      notification.error({ message: "Erreur lors de la conversion de devise", description: error.message });
      return amount;
    }
  };

  const updateTotals = async (factures) => {
    let totalMontant = 0;

    for (const facture of factures) {
      const convertedMontant = await convertCurrency(facture.montant, facture.devise, "EUR");

      totalMontant += convertedMontant;
    }

    setTotals({
      totalMontant,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);


  const ToListActif = () => {
    console.log("Button toListActif clicked");
    navigate("/factures/actif");
  };

  const Report = (key) => {
    console.log("Generating facture with key: ", key);
    api
      .get(`/facture/report/${key}`, {responseType: 'blob', })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        window.open(url); 
       /* const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `facture_${reference}.pdf`); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        fetchData();
        notification.success({ message: "Rapport du contrat généré avec succès" });*/

      })
      .catch((error) => {
        notification.error("Une erreur lors de la génération de la facture!", error);
      });
  };
  

  const columns = [
   
    {
      title: "Numéro",
      dataIndex: "numero",
      ...getColumnSearchProps('numero'),

    },
    {
      title: "Date d'émission",
      dataIndex: "date",
      //...getColumnSearchProps('date'),
      render: (text) => moment(text).format('DD/MM/YYYY'),

      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),

    },
    {
      title: "Client",
      dataIndex: "client",
      ...getColumnSearchProps('client'),

      
    },
    {
      title: "Contrat",
      dataIndex: "contrat",
      ...getColumnSearchProps('contrat'),

      
    },
    {
        title: "Montant total (TTC)",
        dataIndex: "montant",
        ...getColumnSearchProps('montant'),
        sorter: (a, b) => a.montant - b.montant,
        render: (_, record) => `${record.montant} ${record.devise}`, 

      },

      {
        title: "Action",
        dataIndex: "action",
        render: (_, record) => (
          <Space >
           <Tooltip title="Visualiser">
           <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => Report(record.key)}
          >
          </Button>    </Tooltip> 
            <DetailsFactureForm record={record} />
            </Space>
        ),
      },
  ];

  
  return (
    <div>
      
        <Typography.Title level={2}>Liste des factures payées</Typography.Title>
    
      <Space className="mb-4">
        <Button  onClick={ToListActif} icon={<FileDoneOutlined />}>
          Factures en cours
        </Button>
  
      </Space>
      <Table
      size="small"
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
        }}
        footer={() => (
          <div style={{ textAlign: 'right', color: 'grey' }}>
                     <Typography.Title  level={4}>Totaux</Typography.Title>

            <div>Montant total payé : {totals.totalMontant.toFixed(2)} EUR</div>
               </div>
        )}
      />

      

    </div>
  );
};

export default ArchivedFactures;