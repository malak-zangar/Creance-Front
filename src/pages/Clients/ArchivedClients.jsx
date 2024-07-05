import { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const handleUpdate = (key) => {
  console.log('Update record with key: ', key);
  // Ajoutez ici la logique pour mettre à jour la ligne
};

const handleRestaure = (key) => {
    console.log('restaure record with key: ', key);
    axios.put(`http://localhost:5551/user/restaurerClient/${key}`)
    .then(response => {
      console.log('Client restaured successfully:', response.data);
    })
    .catch(error => {
      console.error('There was an error restauring the client!', error);
    });  };

const columns = [
  {
    title: 'Client',
    dataIndex: 'username',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Téléphone',
    dataIndex: 'phone',
  },
  {
    title: 'Adresse',
    dataIndex: 'adresse',
  },

  {
    title: 'Action',
    dataIndex: 'action',
    render: (_, record) => (
      <><Button onClick={() => handleUpdate(record.key)} style={{ marginRight: 8 }}>Modifier</Button>
      <Button onClick={() => handleRestaure(record.key)}>Restaurer</Button></>

    ),
  },
];

const ArchivedClients = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

    const fetchData = () => {
      axios.get('http://localhost:5551/user/getAllArchived')
        .then(response => {
          setData(response.data.map(client => ({
            key: client.id,
            username: client.username,
            email: client.email,
            phone: client.phone,
            adresse: client.adresse,
          })));
        })
        .catch(error => {
          console.error('There was an error fetching the clients!', error);
        });
    };
  
    const ToListActif = () => {
      console.log('Button ToListActif clicked');
      navigate('/ActifClients');
    };


  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000); 

    return () => clearInterval(interval);
  }, []);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };


  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [

     /* {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },*/
    ],
  };

  return(
    <div style={{ textAlign: 'center'}}> 
    <div style={{ fontWeight: 'bold', fontSize: '25px' }}>
      <h1 >Liste de tous les clients archivés</h1></div>
      <Button type="default" onClick={ToListActif} style={{ marginBottom: 18, marginTop:18 }}>
          Tous les clients actifs
        </Button>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  );
};

export default ArchivedClients;
