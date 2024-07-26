import { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,
  FolderOpenOutlined,
  ExportOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Input,
  notification,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import UpdateFactureForm from "../../components/Modals/Factures/UpdateFactureForm";
import { AddFactureForm } from "../../components/Modals/Factures/AddFactureForm";
import moment from "moment";
import DetailsFactureForm from "../../components/Modals/Factures/DetailsFactureForm";
import api from "../../utils/axios";

const ActifFactures = () => {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({ totalMontant: 0, totalMontantEncaisse: 0 });
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

  const ToHistorique = (clientId) => {
    navigate(`/clients/historique/facture/${clientId}`);
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/facture/getAllUnpaid");
      setData(
        response.data.map((facture) => ({
          key: facture.id,
          numero: facture.numero,
          date: moment(facture.date).format('YYYY-MM-DD'),
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
          echeance: moment(facture.echeance).format('YYYY-MM-DD'),
          retard: facture.retard,
          statut: facture.statut,
          dateFinalisation: facture.dateFinalisation ? moment(facture.dateFinalisation).format('YYYY-MM-DD') : null,
        }))
      );
      await updateTotals(response.data);
    } catch (error) {
      notification.error({ message: "Erreur lors de la récupération des factures !", description: error.message });
    }
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
    let totalMontantEncaisse = 0;

    for (const facture of factures) {
      const convertedMontant = await convertCurrency(facture.montant, facture.devise, "EUR");
      const convertedMontantEncaisse = await convertCurrency(facture.montantEncaisse, facture.devise, "EUR");

      totalMontant += convertedMontant;
      totalMontantEncaisse += convertedMontantEncaisse;
    }

    setTotals({
      totalMontant,
      totalMontantEncaisse,
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
    setData([record, ...data]);
  };

  const Report = (key) => {
    console.log("Generating facture with key: ", key);
    api
      .get(`/facture/report/${key}`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        window.open(url);
      })
      .catch((error) => {
        notification.error({ message: "Une erreur lors de la génération de la facture !", description: error.message });
      });
  };

  const Export = async () => {
    console.log("Button Export clicked");
    try {
      const response = await api.get('/facture/export/csv', { responseType: 'blob' });

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'factures_en_cours.csv';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
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
      render: (text) => moment(text).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Client",
      dataIndex: "client",
      ...getColumnSearchProps('client'),
      render: (text, record) => (
        <Button
          style={{ cursor: 'pointer', color: '#0e063b', textDecoration: 'underline' }}
          type="link"
          onClick={() => ToHistorique(record.client_id)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Contrat",
      dataIndex: "contrat",
      ...getColumnSearchProps('contrat'),
    },
    {
      title: "Montant total",
      dataIndex: "montant",
      ...getColumnSearchProps('montant'),
      sorter: (a, b) => a.montant - b.montant,
      render: (_, record) => `${record.montant} ${record.devise}`,
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
              return 'gray';
            default:
              return 'grey';
          }
        };

        const color = getColor(statut);

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                padding: '0px 2px',
                borderRadius: '4px',
                backgroundColor: color,
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              {statut}
            </div>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <UpdateFactureForm record={record} handleState={handleFactures} />
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => Report(record.key)}
          >
          </Button>
          <DetailsFactureForm record={record} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Toutes les factures en cours</Typography.Title>
      <Space className="mb-4">
        <AddFactureForm handleState={handleAddFactureState} />
        <Button onClick={ToListArchive} icon={<FolderOpenOutlined />}>
          Les factures payées
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
        footer={() => (
          <div style={{ textAlign: 'right', color: 'grey' }}>
                     <Typography.Title  level={4}>Totaux</Typography.Title>

            <div>Montant total à payer : {totals.totalMontant.toFixed(2)} EUR</div>
            <div>Montant total encaissé : {totals.totalMontantEncaisse.toFixed(2)} EUR</div>
            <div>Montant total restant : {(totals.totalMontant - totals.totalMontantEncaisse).toFixed(2)} EUR</div>
          </div>
        )}
      />
      <Row justify="end">
        <Col>
          <Button icon={<ExportOutlined />} onClick={Export}>
            Exporter
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ActifFactures;
