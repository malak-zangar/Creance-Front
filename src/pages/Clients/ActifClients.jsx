import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const handleDelete = (key) => {
  console.log('Update record with key: ', key);
  axios.put(`http://localhost:5551/user/archiveClient/${key}`)
  .then(response => {
    console.log('Client archived successfully:', response.data);
  })
  .catch(error => {
    console.error('There was an error archiving the client!', error);
  });
};

const handleUpdate = (key) => {
    console.log('delete record with key: ', key);
  };

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
      <Button onClick={() => handleDelete(record.key)} >Archiver</Button></>

    ),
  },
];

const ActifClients = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false); // État pour afficher le formulaire d'ajout
  const navigate = useNavigate();

  const handleAddClient = (values) => {
    axios.post('http://localhost:5551/user/create', values)
      .then(response => {
        console.log('Client added successfully:', response.data);
        setShowAddForm(false); 
        fetchData(); 
      })
      .catch(error => {
        console.error('Error adding client:', error);
      });
  };

  const fetchData = () => {
    axios.get('http://localhost:5551/user/getAllActif')
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

    ],
  };

  const ToListArchive = () => {
    console.log('Button ToListArchive clicked');
    navigate('/ArchivedClients');
  };

  return(
    <div style={{ textAlign: 'center'}}> 
    <div style={{ fontWeight: 'bold', fontSize: '25px' }}>
      <h1 >Liste de tous les clients actifs</h1></div>
      <div style={{ marginBottom: 16, marginTop:20 }}>
        <Button type="primary" onClick={() => setShowAddForm(true)}>
          Ajouter client
        </Button>
        <Button type="dashed" onClick={ToListArchive} style={{ marginLeft: 8 }}>
          Tous les clients archivés
        </Button>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      <Modal
        title="Ajouter un nouveau client"
        visible={showAddForm}
        onCancel={() => setShowAddForm(false)}
        footer={null}
      >
        <Form
          name="addClientForm"
          onFinish={handleAddClient}
        >
          <Form.Item
            name="username"
            label="Nom du client"
            rules={[{ required: true, message: 'Veuillez saisir le nom du client!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Veuillez saisir l\'email du client!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Téléphone"
            rules={[{ required: true, message: 'Veuillez saisir le numéro de téléphone du client!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="adresse"
            label="Adresse"
            rules={[{ required: true, message: 'Veuillez saisir l\'adresse du client!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Modal>
   
    </div>
  );
};

export default ActifClients;
