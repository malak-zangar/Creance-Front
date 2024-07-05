import  { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListeClients = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:5551/user/getAll')
      .then(response => {
        setData(response.data.map(client => ({
          key: client.id,
          username: client.username,
          email: client.email,
          phone: client.phone,
          adresse: client.adresse,
          actif: client.actif,
        })));
      })
      .catch(error => {
        console.error('There was an error fetching the clients!', error);
      });
  };

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
      title: 'Actif',
      dataIndex: 'actif',
      render: (actif) => (actif ? 'Yes' : 'No'),
    },
  ];


  const ToListArchive = () => {
    console.log('Button ToListArchive clicked');
    navigate('/ArchivedClients');
  };

  const ToListActif = () => {
    console.log('Button ToListActif clicked');
    navigate('/ActifClients');
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '25px' }}>
        <h1>Liste de tous les clients</h1>
      </div>
      <div style={{ marginBottom: 16 , marginTop:20}}>
        <Button type="primary" onClick={() => setShowAddForm(true)}>
          Ajouter client
        </Button>
        <Button type="default" onClick={ToListActif} style={{ marginLeft: 8 }}>
          Tous les clients actifs
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

export default ListeClients;
