import { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,
  EyeTwoTone,FolderOpenOutlined,UserOutlined,HistoryOutlined
} from "@ant-design/icons";
import { Button, Input, notification, Space, Table, Tag, Tooltip, Typography } from "antd";
import Highlighter from "react-highlight-words";
import DetailsFactureForm from "../../components/Modals/Factures/DetailsFactureForm";
import moment from "moment";
import { useNavigate, useParams } from 'react-router-dom';
import api from "../../utils/axios";


const HistoriqueClientFacture = () => {
  const { param } = useParams();
  const [data, setData] = useState([]);
  const [clientName, setClientName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
          color: filtered ? "#1677ff" : undefined,
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
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

 
  const fetchData = () => {

    api
      .get(`/facture/getByClient/${param}`)
      .then((response) => {
        if (response.data.length > 0) {
          setClientName(response.data[0].client); // Set the client name
        }
        setData(
          response.data.map((facture) => ({
            key: facture.id,
            numero: facture.numero,
            date: moment(facture.date).format("YYYY-MM-DD"),
            delai: facture.delai,
            montant: facture.montant,
            montantEncaisse: facture.montantEncaisse,
            actionRecouvrement: facture.actionRecouvrement,
            actif: facture.actif,
            client_id: facture.client_id,
            client: facture.client,
            contrat: facture.contrat,
            contrat_id: facture.contrat_id,
            solde: facture.solde,
            devise: facture.devise,
            echeance: moment(facture.echeance).format("YYYY-MM-DD"),
            retard: facture.retard,
            statut: facture.statut,
            dateFinalisation: facture.dateFinalisation
              ? moment(facture.dateFinalisation).format("YYYY-MM-DD")
              : null, 
          }))
        );
        setLoading(false);

      })
      .catch((error) => {
        notification.error("There was an error fetching the factures!", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Report = (key) => {
    console.log("Generating facture with key: ", key);
    api
      .get(`/facture/auto/${key}`, {responseType: 'blob', })
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
      ...getColumnSearchProps("numero"),
    },
    {
      title: "Date d'émission",
      dataIndex: "date",
      //...getColumnSearchProps('date'),
      render: (text) => moment(text).format("DD/MM/YYYY"),

      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },

    {
      title: "Montant facturé",
      dataIndex: "montant",
      ...getColumnSearchProps("montant"),
      sorter: (a, b) => a.montant - b.montant,
      render: (_, record) => `${record.montant} ${record.devise}`, 

    },
    {
        title: "Montant payé",
        dataIndex: "montantEncaisse",
        ...getColumnSearchProps("montantEncaisse"),
        sorter: (a, b) => a.montantEncaisse - b.montantEncaisse,
        render: (_, record) => `${record.montantEncaisse} ${record.devise}`, 

      },

      {
        title: "Statut",
        dataIndex: "statut",
        filters: [
            { text: 'Échue', value: 'Échue' },
            { text: 'Non échue', value: 'Non échue' },
        ],
        onFilter: (value, record) => record.statut === value,
        render: (statut) => {
            const getColor = (statut) => {
                switch (statut) {
                    case 'Échue':
                        return 'red';
                    case 'Non échue':
                        return 'orange';
                    case 'Payée':
                        return 'green';
    
                }
            };
    
            const color = getColor(statut);
    
            return <Tag color={color}>{statut}</Tag>;

        },
    },

    {
      title: "Action(s)",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
           <Tooltip title="Visualiser">

          <Button
            icon={<EyeTwoTone />}
            size="small"
            onClick={() => Report(record.key)}
          >
          
          </Button>
</Tooltip>
          <DetailsFactureForm record={record} />
        </Space>
      ),
    },
  ];

  const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
      const response = await api.get(`/paramentreprise/convert`, {
        params: {
          base: fromCurrency,
          target: toCurrency,
          amount: amount,
        },
      });
      return response.data.converted_amount || amount; // Return the converted amount or the original if conversion fails
    } catch (error) {
      notification.error({ message: "Erreur lors de la conversion de devise", description: error.message });
      return amount; // Return the original amount if conversion fails
    }
  };

  const calculateTotals = async () => {
    let totalFacture = 0;
    let totalPaye = 0;

    for (const facture of data) {
      const convertedMontant = await convertCurrency(facture.montant, facture.devise, "EUR");
      const convertedMontantEncaisse = await convertCurrency(facture.montantEncaisse, facture.devise, "EUR");

      totalFacture += convertedMontant;
      totalPaye += convertedMontantEncaisse;
    }

    return {
      totalFacture,
      totalPaye
    };
  };

  const ToListArchive = () => {
    navigate("/clients/archive");
  };

  const ToListClients = () => {
    navigate("/clients");
  };

  return (
    <div>
      <Typography.Title level={4}>
      <span> <HistoryOutlined/> </span>

      {`Historique des factures du client : ${clientName}`}      </Typography.Title> 
      <Space className="mb-4">
        <Button onClick={ToListClients} icon={<UserOutlined />}>
          Clients actifs
        </Button>
        <Button onClick={ToListArchive} icon={<FolderOpenOutlined />}>
          Clients inactifs
        </Button>
      </Space>
      <Table
       scroll={{
        x: "max-content"
      }}
      loading={loading}

        size="small"
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
        }}
        footer={() => (
          null
        )   }

      /> 
    </div>
  );
};

export default HistoriqueClientFacture;
